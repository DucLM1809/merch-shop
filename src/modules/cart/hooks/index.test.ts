import { createElement } from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, expect, it, vi } from "vitest";

import { useCart, useAddCartItem, useRemoveCartItem, useMergeCart, cartKeys } from "./index";

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

describe("useCart", () => {
  it("fetches cart on mount", async () => {
    const { wrapper } = makeWrapper();
    const { result } = renderHook(() => useCart(), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.id).toBe("guest-cart");
  });
});

describe("useAddCartItem", () => {
  it("invalidates cart query on success", async () => {
    const { wrapper, queryClient } = makeWrapper();
    const invalidate = vi.spyOn(queryClient, "invalidateQueries");
    const { result } = renderHook(() => useAddCartItem(), { wrapper });
    result.current.mutate({ skuId: "sku_001", quantity: 1 });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(invalidate).toHaveBeenCalledWith({ queryKey: cartKeys.cart() });
  });
});

describe("useRemoveCartItem", () => {
  it("invalidates cart query on success", async () => {
    const { wrapper, queryClient } = makeWrapper();
    const invalidate = vi.spyOn(queryClient, "invalidateQueries");
    const { result } = renderHook(() => useRemoveCartItem(), { wrapper });
    result.current.mutate("sku_001");
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(invalidate).toHaveBeenCalledWith({ queryKey: cartKeys.cart() });
  });
});

describe("useMergeCart", () => {
  it("invalidates cart query on success", async () => {
    const { wrapper, queryClient } = makeWrapper();
    const invalidate = vi.spyOn(queryClient, "invalidateQueries");
    const { result } = renderHook(() => useMergeCart(), { wrapper });
    result.current.mutate("session_abc");
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(invalidate).toHaveBeenCalledWith({ queryKey: cartKeys.cart() });
  });
});
