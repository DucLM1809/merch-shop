import { useMutation, useQuery, useQueryClient, type QueryClient } from "@tanstack/react-query";
import { useStore } from "@tanstack/react-store";

import { client } from "@/api/client";
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
  const isLoaded = useStore(authStore, (s) => s.isLoaded);
  const isSignedIn = useStore(authStore, (s) => s.isSignedIn);
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

export function useVerifyEmail() {
  return useMutation({
    mutationFn: (body: VerifyEmailDto) => client.verifyEmail(body),
  });
}

export async function bootstrapAuth(queryClient: QueryClient): Promise<void> {
  try {
    const res = await client.refresh();
    setSession(res.data.accessToken);
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
