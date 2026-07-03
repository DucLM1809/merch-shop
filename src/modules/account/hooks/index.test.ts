import { createElement } from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, expect, it, vi } from "vitest";

import { mockAccount } from "@/mocks/handlers";

import { useAccount, useDeleteAccount, accountKeys } from "./index";

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
