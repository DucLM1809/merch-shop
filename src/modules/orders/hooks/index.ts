import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { client } from "@/api/client";
import type { AdminOrdersFilters } from "@/api/types";

export const orderKeys = {
  all: ["orders"] as const,
  mine: () => [...orderKeys.all, "mine"] as const,
  admin: (filters?: AdminOrdersFilters) => [...orderKeys.all, "admin", filters] as const,
  detail: (id: string) => [...orderKeys.all, "detail", id] as const,
  byPaymentIntent: (paymentIntentId: string) =>
    [...orderKeys.all, "by-payment-intent", paymentIntentId] as const,
};

// Unselected query options, shared between route loaders (SSR prefetch) and hooks (CSR read).
export const adminOrdersQueryOptions = (filters?: AdminOrdersFilters) =>
  queryOptions({
    queryKey: orderKeys.admin(filters),
    queryFn: () => client.getAdminOrders(filters),
  });

export function useOrders(enabled = true) {
  const result = useQuery({
    queryKey: orderKeys.mine(),
    queryFn: () => client.getMyOrders(),
    enabled,
    select: (r) => r.data,
  });
  return { ...result, error: result.error };
}

export function useAdminOrders(filters?: AdminOrdersFilters, enabled = true) {
  const result = useQuery({
    ...adminOrdersQueryOptions(filters),
    enabled,
    select: (r) => ({ orders: r.data, meta: r.meta }),
  });
  return { ...result, error: result.error };
}

export function useOrder(id: string, enabled = true) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => client.getOrder(id),
    enabled,
    select: (r) => r.data,
  });
}

export function useOrderByPaymentIntent(paymentIntentId?: string) {
  return useQuery({
    queryKey: orderKeys.byPaymentIntent(paymentIntentId ?? ""),
    queryFn: () => client.getOrderByPaymentIntent(paymentIntentId!),
    enabled: !!paymentIntentId,
    staleTime: 0,
    // webhook lag is usually <2s; poll until the order shows up, then stop
    refetchInterval: (query) => (query.state.data ? false : 1500),
  });
}

export function useRetryFulfillment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => client.retryFulfillment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.admin() });
    },
  });
}
