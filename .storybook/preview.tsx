import React from 'react'
import type { Preview } from '@storybook/tanstack-react'
import { ChakraProvider } from '@chakra-ui/react'
import { initialize, mswLoader } from 'msw-storybook-addon'
import { system } from '../src/theme'
import { handlers } from '../src/mocks/handlers'

initialize({ onUnhandledRequest: 'bypass' })

const preview: Preview = {
  loaders: [mswLoader],
  parameters: {
    msw: {
      handlers,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
  },
  decorators: [
    (Story) => (
      <div data-theme="dark" style={{ minHeight: '100dvh', background: 'var(--chakra-colors-gray-950, #0a0a0a)' }}>
        <ChakraProvider value={system}>
          <Story />
        </ChakraProvider>
      </div>
    ),
  ],
}

export default preview
