import { useEffect } from 'react'
import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { ChakraProvider } from '@chakra-ui/react'
import { ClerkProvider } from '@clerk/react'
import { system } from '../theme'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'
import { GlobalNav } from '../components/GlobalNav'
import { env } from '../env'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Merch Shop',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (env.VITE_ENABLE_MSW) {
      import('../mocks/browser').then(({ worker }) =>
        worker.start({ onUnhandledRequest: 'bypass' }),
      )
    }
  }, [])

  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        <ClerkProvider publishableKey={env.VITE_CLERK_PUBLISHABLE_KEY ?? ''}>
          <ChakraProvider value={system}>
            <GlobalNav />
            {children}
          </ChakraProvider>
        </ClerkProvider>
        {!import.meta.env.VITEST && (
          <TanStackDevtools
            config={{
              position: 'bottom-right',
            }}
            plugins={[
              {
                name: 'Tanstack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
              TanStackQueryDevtools,
            ]}
          />
        )}
        <Scripts />
      </body>
    </html>
  )
}
