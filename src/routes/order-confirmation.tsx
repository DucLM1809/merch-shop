import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import { OrderConfirmationPage } from '@/modules/orders'
import type { CartItem } from '@/store/cart'

const searchSchema = z.object({
  orderId: z.string(),
  items: z.string(),
})

export const Route = createFileRoute('/order-confirmation')({
  validateSearch: searchSchema,
  component: RouteComponent,
})

function RouteComponent() {
  const { orderId, items: itemsJson } = Route.useSearch()
  const items = JSON.parse(itemsJson) as CartItem[]
  return <OrderConfirmationPage orderId={orderId} items={items} />
}
