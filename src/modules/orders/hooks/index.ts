import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { client } from "@/api/client";
import type { OrderStatus } from "@/api/types";

export const orderKeys = {
  all: ["orders"] as const,
  mine: () => [...orderKeys.all, "mine"] as const,
  admin: () => [...orderKeys.all, "admin"] as const,
  detail: (id: string) => [...orderKeys.all, "detail", id] as const,
};

export function useOrders(enabled = true) {
  const result = useQuery({
    queryKey: orderKeys.mine(),
    queryFn: () => client.getMyOrders(),
    enabled,
    select: (r) => r.data,
  });
  return { ...result, error: result.error };
}

export function useAdminOrders(enabled = true) {
  const result = useQuery({
    queryKey: orderKeys.admin(),
    queryFn: () => client.getAdminOrders(),
    enabled,
    select: (r) => r.data,
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

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      client.updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.admin() });
    },
  });
}
