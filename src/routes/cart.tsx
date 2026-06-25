import { createFileRoute } from '@tanstack/react-router'

import { CartPage } from '@/modules/cart'

export const Route = createFileRoute('/cart')({
  component: CartPage,
})
