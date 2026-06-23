import { createSystem, defaultConfig } from '@chakra-ui/react'

export const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      fonts: {
        body: { value: "'Geist Variable', system-ui, sans-serif" },
        heading: { value: "'Geist Variable', system-ui, sans-serif" },
        mono: { value: "ui-monospace, 'Geist Mono Variable', monospace" },
      },
      colors: {
        brand: {
          50: { value: '#e0f6ff' },
          100: { value: '#b3eaff' },
          200: { value: '#66d0ff' },
          300: { value: '#33bfff' },
          400: { value: '#00aaff' },
          500: { value: '#0094e0' },
          600: { value: '#007bc0' },
          700: { value: '#005f96' },
          800: { value: '#00436c' },
          900: { value: '#002742' },
        },
      },
    },
  },
})
