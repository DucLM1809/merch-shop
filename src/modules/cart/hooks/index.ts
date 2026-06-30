import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { client } from "@/api/client";
import type { SyncCartItem } from "@/api/types";
import { setItems } from "@/store/cart";

export const cartKeys = {
  all: ["cart"] as const,
  cart: () => [...cartKeys.all, "current"] as const,
};

export function useCart() {
  return useQuery({
    queryKey: cartKeys.cart(),
    queryFn: () => client.getCart(),
    select: (r) => r.data,
  });
}

export function useAddCartItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ skuId, quantity }: { skuId: string; quantity: number }) =>
      client.addCartItem(skuId, quantity),
    onSuccess: () => qc.invalidateQueries({ queryKey: cartKeys.cart() }),
  });
}

export function useRemoveCartItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (skuId: string) => client.removeCartItem(skuId),
    onSuccess: () => qc.invalidateQueries({ queryKey: cartKeys.cart() }),
  });
}

export function useMergeCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (sessionId: string) => client.mergeCart(sessionId),
    onSuccess: () => qc.invalidateQueries({ queryKey: cartKeys.cart() }),
  });
}

export function useCartSync() {
  return useMutation({
    mutationFn: (items: SyncCartItem[]) => client.syncCart(items),
    onSuccess: (data) => setItems(data.data.items),
  });
}
