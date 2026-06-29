import { createElement } from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, expect, it, vi } from "vitest";

import { mockOrders } from "@/mocks/handlers";

import { useOrders, useAdminOrders, useOrder, useUpdateOrderStatus, orderKeys } from "./index";

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

describe("useOrders", () => {
  it("does not call client when enabled=false", async () => {
    const { wrapper } = makeWrapper();
    const { result } = renderHook(() => useOrders(false), { wrapper });
    // stays idle — fetchStatus never becomes "fetching"
    expect(result.current.fetchStatus).toBe("idle");
    expect(result.current.data).toBeUndefined();
  });

  it("fetches orders when enabled (default)", async () => {
    const { wrapper } = makeWrapper();
    const { result } = renderHook(() => useOrders(), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    // MSW handler returns [] for /orders/mine
    expect(Array.isArray(result.current.data)).toBe(true);
  });
});

describe("useAdminOrders", () => {
  it("does not call client when enabled=false", async () => {
    const { wrapper } = makeWrapper();
    const { result } = renderHook(() => useAdminOrders(false), { wrapper });
    expect(result.current.fetchStatus).toBe("idle");
    expect(result.current.data).toBeUndefined();
  });

  it("fetches admin orders when enabled (default)", async () => {
    const { wrapper } = makeWrapper();
    const { result } = renderHook(() => useAdminOrders(), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockOrders);
  });
});

describe("useOrder", () => {
  it("does not call client when enabled=false", async () => {
    const { wrapper } = makeWrapper();
    const { result } = renderHook(() => useOrder("ord_001", false), { wrapper });
    expect(result.current.fetchStatus).toBe("idle");
    expect(result.current.data).toBeUndefined();
  });

  it("fetches a single order by id", async () => {
    const { wrapper } = makeWrapper();
    const { result } = renderHook(() => useOrder("ord_001"), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.id).toBe("ord_001");
  });
});

describe("useUpdateOrderStatus", () => {
  it("invalidates admin query key on success", async () => {
    const { wrapper, queryClient } = makeWrapper();
    const invalidate = vi.spyOn(queryClient, "invalidateQueries");
    const { result } = renderHook(() => useUpdateOrderStatus(), { wrapper });
    result.current.mutate({ id: "ord_001", status: "shipped" });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(invalidate).toHaveBeenCalledWith({ queryKey: orderKeys.admin() });
  });
});
