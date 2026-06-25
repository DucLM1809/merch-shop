import { QueryClient } from '@tanstack/react-query'

export function getContext(): { queryClient: QueryClient } {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        gcTime: 300_000,
      },
    },
  })

  return { queryClient }
}

export default function TanstackQueryProvider(): null {
  return null
}
