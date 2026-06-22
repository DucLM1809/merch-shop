import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { RouterContextProvider, createMemoryHistory, createRouter } from '@tanstack/react-router'
import { render } from '@testing-library/react'
import type { ReactElement } from 'react'
import { routeTree } from './routeTree.gen'

export function renderWithProviders(ui: ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  const router = createRouter({
    routeTree,
    context: { queryClient },
    history: createMemoryHistory(),
  })
  return render(
    <RouterContextProvider router={router}>
      <ChakraProvider value={defaultSystem}>
        <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
      </ChakraProvider>
    </RouterContextProvider>,
  )
}
