import { queryOptions, useQuery } from "@tanstack/react-query";

import { client } from "@/api/client";
import type { ProductFilters } from "@/api/types";

export const catalogKeys = {
  all: ["catalog"] as const,
  products: (filters?: ProductFilters) => [...catalogKeys.all, "products", filters] as const,
  product: (id: string) => [...catalogKeys.all, "product", id] as const,
  publishers: () => [...catalogKeys.all, "publishers"] as const,
  publisher: (slug: string) => [...catalogKeys.all, "publisher", slug] as const,
  games: () => [...catalogKeys.all, "games"] as const,
  teams: (gameId?: string) => [...catalogKeys.all, "teams", gameId] as const,
  characters: (gameId?: string) => [...catalogKeys.all, "characters", gameId] as const,
  skus: (productId: string) => [...catalogKeys.all, "skus", productId] as const,
};

// Unselected query options, shared between route loaders (SSR prefetch) and hooks (CSR read).
export const productsQueryOptions = (filters?: ProductFilters) =>
  queryOptions({
    queryKey: catalogKeys.products(filters),
    queryFn: () => client.getProducts(filters),
  });

export const productQueryOptions = (id: string) =>
  queryOptions({
    queryKey: catalogKeys.product(id),
    queryFn: () => client.getProduct(id),
  });

export const publisherQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: catalogKeys.publisher(slug),
    queryFn: () => client.getPublisher(slug),
  });

export function useProducts(filters?: ProductFilters) {
  return useQuery({
    ...productsQueryOptions(filters),
    select: (r) => r.data,
  });
}

export function useProduct(id: string) {
  return useQuery({
    ...productQueryOptions(id),
    select: (r) => r.data,
  });
}

export function usePublishers() {
  return useQuery({
    queryKey: catalogKeys.publishers(),
    queryFn: () => client.getPublishers(),
    staleTime: Infinity,
    select: (r) => r.data,
  });
}

export function usePublisher(slug: string) {
  return useQuery({
    ...publisherQueryOptions(slug),
    select: (r) => r.data,
  });
}

export function useGames() {
  return useQuery({
    queryKey: catalogKeys.games(),
    queryFn: () => client.getGames(),
    staleTime: Infinity,
    select: (r) => r.data,
  });
}

export function useTeams(gameId?: string) {
  return useQuery({
    queryKey: catalogKeys.teams(gameId),
    queryFn: () => client.getTeams(gameId),
    staleTime: Infinity,
    select: (r) => r.data,
  });
}

export function useCharacters(gameId?: string) {
  return useQuery({
    queryKey: catalogKeys.characters(gameId),
    queryFn: () => client.getCharacters(gameId),
    staleTime: Infinity,
    select: (r) => r.data,
  });
}

export function useSkus(productId: string) {
  return useQuery({
    queryKey: catalogKeys.skus(productId),
    queryFn: () => client.getSkus(productId),
    select: (r) => r.data,
  });
}
