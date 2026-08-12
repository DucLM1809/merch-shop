import { createElement } from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";

import { BASE_URL } from "@/api/client";
import { mockAccount, VALID_TOKEN } from "@/mocks/handlers";
import { server } from "@/mocks/server";
import { authStore, clearSession, getAccessToken, setSession } from "@/store/authToken";

import {
  useAccount,
  useDeleteAccount,
  accountKeys,
  useAuth,
  bootstrapAuth,
  useLogin,
  useRegister,
  useLogout,
  useForgotPassword,
  useResetPassword,
  useVerifyEmail,
} from "./index";

function makeWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return {
    wrapper: ({ children }: { children: React.ReactNode }) =>
      createElement(QueryClientProvider, { client: queryClient }, children),
    queryClient,
  };
}

describe("useAccount", () => {
  it("does not call client when enabled=false", async () => {
    const { wrapper } = makeWrapper();
    const { result } = renderHook(() => useAccount(false), { wrapper });
    expect(result.current.fetchStatus).toBe("idle");
    expect(result.current.data).toBeUndefined();
  });

  it("fetches the current account when enabled (default)", async () => {
    const { wrapper } = makeWrapper();
    const { result } = renderHook(() => useAccount(), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockAccount);
  });
});

describe("useDeleteAccount", () => {
  it("invalidates account queries on success", async () => {
    const { wrapper, queryClient } = makeWrapper();
    const invalidate = vi.spyOn(queryClient, "invalidateQueries");
    const { result } = renderHook(() => useDeleteAccount(), { wrapper });
    result.current.mutate(mockAccount.id);
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(invalidate).toHaveBeenCalledWith({ queryKey: accountKeys.all });
  });
});

describe("useAuth", () => {
  it("reflects authStore state", async () => {
    const { wrapper } = makeWrapper();
    setSession("token-abc");
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.isSignedIn).toBe(true);

    clearSession();
    await waitFor(() => expect(result.current.isSignedIn).toBe(false));
  });
});

describe("bootstrapAuth", () => {
  it("signs in and loads the account when refresh succeeds", async () => {
    const { queryClient } = makeWrapper();
    server.use(
      http.post(`${BASE_URL}/auth/refresh`, () =>
        HttpResponse.json({
          success: true,
          data: { accessToken: "fresh-token" },
          meta: { total: 1, page: 1, limit: 20 },
        })
      )
    );

    await bootstrapAuth(queryClient);

    expect(authStore.state.isSignedIn).toBe(true);
    expect(authStore.state.isLoaded).toBe(true);
    expect(getAccessToken()).toBe("fresh-token");
    expect(queryClient.getQueryData(accountKeys.me())).toBeTruthy();
  });

  it("clears the session when refresh fails", async () => {
    const { queryClient } = makeWrapper();
    server.use(
      http.post(`${BASE_URL}/auth/refresh`, () => new HttpResponse(null, { status: 401 }))
    );

    await bootstrapAuth(queryClient);

    expect(authStore.state.isSignedIn).toBe(false);
    expect(authStore.state.isLoaded).toBe(true);
    expect(getAccessToken()).toBeNull();
  });
});

describe("useLogin", () => {
  it("sets the session token on success", async () => {
    const { wrapper } = makeWrapper();
    const { result } = renderHook(() => useLogin(), { wrapper });

    result.current.mutate({ email: "buyer@test.com", password: "correct-horse-battery" });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(getAccessToken()).toBe("mock-access-token");
  });
});

describe("useRegister", () => {
  it("registers then auto-signs-in", async () => {
    const { wrapper } = makeWrapper();
    const { result } = renderHook(() => useRegister(), { wrapper });

    result.current.mutate({ email: "new-user@test.com", password: "correct-horse-battery" });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(getAccessToken()).toBe("mock-access-token");
  });
});

describe("useLogout", () => {
  it("clears the session even when the logout request fails", async () => {
    const { wrapper } = makeWrapper();
    setSession("token-abc");
    server.use(http.post(`${BASE_URL}/auth/logout`, () => new HttpResponse(null, { status: 500 })));

    const { result } = renderHook(() => useLogout(), { wrapper });
    result.current.mutate();

    await waitFor(() => expect(getAccessToken()).toBeNull());
  });
});

describe("useForgotPassword", () => {
  it("resolves on submit", async () => {
    const { wrapper } = makeWrapper();
    const { result } = renderHook(() => useForgotPassword(), { wrapper });

    result.current.mutate({ email: "buyer@test.com" });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});

describe("useResetPassword", () => {
  it("resolves with a valid token", async () => {
    const { wrapper } = makeWrapper();
    const { result } = renderHook(() => useResetPassword(), { wrapper });

    result.current.mutate({ token: VALID_TOKEN, newPassword: "correct-horse-battery" });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it("errors with an invalid token", async () => {
    const { wrapper } = makeWrapper();
    const { result } = renderHook(() => useResetPassword(), { wrapper });

    result.current.mutate({ token: "bad-token", newPassword: "correct-horse-battery" });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("useVerifyEmail", () => {
  it("resolves with a valid token", async () => {
    const { wrapper } = makeWrapper();
    const { result } = renderHook(() => useVerifyEmail(), { wrapper });

    result.current.mutate({ token: VALID_TOKEN });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
