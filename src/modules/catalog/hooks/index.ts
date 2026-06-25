import { useQuery } from '@tanstack/react-query'

import { client } from '@/api/client'
import type { ProductFilters } from '@/api/types'

export const catalogKeys = {
  all: ['catalog'] as const,
  products: (filters?: ProductFilters) => [...catalogKeys.all, 'products', filters] as const,
  product: (slug: string) => [...catalogKeys.all, 'product', slug] as const,
  publishers: () => [...catalogKeys.all, 'publishers'] as const,
  publisher: (slug: string) => [...catalogKeys.all, 'publisher', slug] as const,
  teams: () => [...catalogKeys.all, 'teams'] as const,
  characters: () => [...catalogKeys.all, 'characters'] as const,
}

export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: catalogKeys.products(filters),
    queryFn: () => client.getProducts(filters),
  })
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: catalogKeys.product(slug),
    queryFn: () => client.getProduct(slug),
  })
}

export function usePublishers() {
  return useQuery({
    queryKey: catalogKeys.publishers(),
    queryFn: () => client.getPublishers(),
    staleTime: Infinity, // static reference data
  })
}

export function usePublisher(slug: string) {
  return useQuery({
    queryKey: catalogKeys.publisher(slug),
    queryFn: () => client.getPublisher(slug),
  })
}

export function useTeams() {
  return useQuery({
    queryKey: catalogKeys.teams(),
    queryFn: () => client.getTeams(),
    staleTime: Infinity, // static reference data
  })
}

export function useCharacters() {
  return useQuery({
    queryKey: catalogKeys.characters(),
    queryFn: () => client.getCharacters(),
    staleTime: Infinity, // static reference data
  })
}
