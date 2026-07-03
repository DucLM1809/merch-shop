import { createElement } from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, expect, it, vi } from "vitest";

import { mockOrders } from "@/mocks/handlers";

import {
  useOrders,
  useAdminOrders,
  useOrder,
  useOrderByPaymentIntent,
  useRetryFulfillment,
  orderKeys,
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
    const { result } = renderHook(() => useAdminOrders(undefined, false), { wrapper });
    expect(result.current.fetchStatus).toBe("idle");
    expect(result.current.data).toBeUndefined();
  });

  it("fetches admin orders when enabled (default)", async () => {
    const { wrapper } = makeWrapper();
    const { result } = renderHook(() => useAdminOrders(), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.orders).toEqual(mockOrders);
    expect(result.current.data?.meta.total).toBe(mockOrders.length);
  });

  it("sends page/limit/status filters as query params", async () => {
    const { wrapper } = makeWrapper();
    const { result } = renderHook(() => useAdminOrders({ status: "FORWARDED" }), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.orders.every((o) => o.status === "FORWARDED")).toBe(true);
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

describe("useOrderByPaymentIntent", () => {
  it("does not call client when paymentIntentId is undefined", async () => {
    const { wrapper } = makeWrapper();
    const { result } = renderHook(() => useOrderByPaymentIntent(undefined), { wrapper });
    expect(result.current.fetchStatus).toBe("idle");
    expect(result.current.data).toBeUndefined();
  });

  it("resolves the order for a matching payment intent id", async () => {
    const { wrapper } = makeWrapper();
    const { result } = renderHook(() => useOrderByPaymentIntent("pi_test_001"), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.id).toBe("ord_001");
  });

  it("returns null for a payment intent with no matching order yet", async () => {
    const { wrapper } = makeWrapper();
    const { result } = renderHook(() => useOrderByPaymentIntent("pi_unknown"), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeNull();
  });
});

describe("useRetryFulfillment", () => {
  it("invalidates admin query key on success", async () => {
    const { wrapper, queryClient } = makeWrapper();
    const invalidate = vi.spyOn(queryClient, "invalidateQueries");
    const { result } = renderHook(() => useRetryFulfillment(), { wrapper });
    result.current.mutate("ord_001");
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(invalidate).toHaveBeenCalledWith({ queryKey: orderKeys.admin() });
  });
});
