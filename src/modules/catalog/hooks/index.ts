import { useQuery } from '@tanstack/react-query'

import { client } from '@/api/client'
import type { ProductFilters } from '@/api/types'

export const catalogKeys = {
  all: ['catalog'] as const,
  products: (filters?: ProductFilters) => [...catalogKeys.all, 'products', filters] as const,
  product: (id: string) => [...catalogKeys.all, 'product', id] as const,
  publishers: () => [...catalogKeys.all, 'publishers'] as const,
  publisher: (slug: string) => [...catalogKeys.all, 'publisher', slug] as const,
  teams: (gameId?: string) => [...catalogKeys.all, 'teams', gameId] as const,
  characters: (gameId?: string) => [...catalogKeys.all, 'characters', gameId] as const,
  skus: (productId: string) => [...catalogKeys.all, 'skus', productId] as const,
}

export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: catalogKeys.products(filters),
    queryFn: () => client.getProducts(filters),
  })
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: catalogKeys.product(id),
    queryFn: () => client.getProduct(id),
  })
}

export function usePublishers() {
  return useQuery({
    queryKey: catalogKeys.publishers(),
    queryFn: () => client.getPublishers(),
    staleTime: Infinity,
  })
}

export function usePublisher(slug: string) {
  return useQuery({
    queryKey: catalogKeys.publisher(slug),
    queryFn: () => client.getPublisher(slug),
  })
}

export function useTeams(gameId?: string) {
  return useQuery({
    queryKey: catalogKeys.teams(gameId),
    queryFn: () => client.getTeams(gameId),
    staleTime: Infinity,
  })
}

export function useCharacters(gameId?: string) {
  return useQuery({
    queryKey: catalogKeys.characters(gameId),
    queryFn: () => client.getCharacters(gameId),
    staleTime: Infinity,
  })
}

export function useSkus(productId: string) {
  return useQuery({
    queryKey: catalogKeys.skus(productId),
    queryFn: () => client.getSkus(productId),
  })
}
