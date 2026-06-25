import { createFileRoute } from '@tanstack/react-router'

import { CheckoutPage } from '@/modules/checkout'

export const Route = createFileRoute('/checkout')({
  component: CheckoutPage,
})
