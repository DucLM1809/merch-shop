import { useQuery } from '@tanstack/react-query'

import { client } from '@/api/client'

export const orderKeys = {
  all: ['orders'] as const,
  list: () => [...orderKeys.all, 'list'] as const,
}

export function useOrders(enabled = true) {
  const result = useQuery({
    queryKey: orderKeys.list(),
    queryFn: () => client.getOrders(),
    enabled,
  })
  return { ...result, error: result.error }
}
