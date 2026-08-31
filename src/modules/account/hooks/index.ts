import { useMutation, useQuery, useQueryClient, type QueryClient } from "@tanstack/react-query";
import { useSelector } from "@tanstack/react-store";

import { client, refreshAccessToken } from "@/api/client";
import type {
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
  VerifyEmailDto,
} from "@/api/types";
import { authStore, clearSession, forceSignOut, setLoaded, setSession } from "@/store/authToken";

export const accountKeys = {
  all: ["account"] as const,
  me: () => [...accountKeys.all, "me"] as const,
};

export function useAccount(enabled = true) {
  const result = useQuery({
    queryKey: accountKeys.me(),
    queryFn: () => client.getMyAccount(),
    enabled,
    select: (r) => r.data,
  });
  return { ...result, error: result.error };
}

export function useDeleteAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => client.deleteAccount(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountKeys.all });
    },
  });
}

export function useAuth() {
  const isLoaded = useSelector(authStore, (s) => s.isLoaded);
  const isSignedIn = useSelector(authStore, (s) => s.isSignedIn);
  return { isLoaded, isSignedIn };
}

export function useLogin() {
  return useMutation({
    mutationFn: (body: LoginDto) => client.login(body),
    onSuccess: (res) => setSession(res.data.accessToken),
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: async (body: RegisterDto) => {
      await client.register(body);
      const res = await client.login(body);
      setSession(res.data.accessToken);
      return res.data;
    },
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: () => client.logout(),
    onSettled: () => forceSignOut(),
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (body: ForgotPasswordDto) => client.forgotPassword(body),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (body: ResetPasswordDto) => client.resetPassword(body),
  });
}

type UseVerifyEmailCallbacks = {
  onSuccess?: () => void;
  onError?: () => void;
};

// Callers pass onSuccess/onError here (hook-level useMutation options) rather than
// as the mutate() call's own second argument. This mutation fires from an effect on
// mount, not a user event, and mutate()-level callbacks share the same reactive
// subscription as isError/isSuccess, which can miss a notification when the mutation
// settles right after a dev-mode effect double-invocation resubscribes it. The
// useMutation-level onSuccess/onError below are invoked directly off the mutation's
// own settlement instead, so they aren't affected. See merch-shop-bz7.
export function useVerifyEmail(callbacks?: UseVerifyEmailCallbacks) {
  return useMutation({
    mutationFn: (body: VerifyEmailDto) => client.verifyEmail(body),
    onSuccess: callbacks?.onSuccess,
    onError: callbacks?.onError,
  });
}

export async function bootstrapAuth(queryClient: QueryClient): Promise<void> {
  // Goes through the same deduped refreshAccessToken() the response interceptor uses,
  // rather than posting /auth/refresh directly — otherwise this call can race a
  // request that 401s during the same boot (e.g. the account/cart queries below) for
  // the single-use refresh-token cookie (ADR-0015), and the loser spuriously signs out
  // a session that actually just refreshed fine. See merch-shop e2e admin-nav flakiness.
  const token = await refreshAccessToken();
  if (!token) {
    clearSession();
    setLoaded(true);
    return;
  }
  try {
    await queryClient.fetchQuery({
      queryKey: accountKeys.me(),
      queryFn: () => client.getMyAccount(),
    });
  } catch {
    clearSession();
  } finally {
    setLoaded(true);
  }
}
