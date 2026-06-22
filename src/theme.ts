import { createSystem, defaultConfig } from '@chakra-ui/react'

export const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      fonts: {
        body: { value: "'Geist Variable', system-ui, sans-serif" },
        heading: { value: "'Geist Variable', system-ui, sans-serif" },
        mono: { value: "ui-monospace, 'Geist Mono Variable', monospace" },
      },
    },
  },
})
