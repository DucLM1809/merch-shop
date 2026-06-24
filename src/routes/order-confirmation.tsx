import { createFileRoute } from '@tanstack/react-router'
import { OrderConfirmationPage } from '../components/OrderConfirmationPage'
import { z } from 'zod'

const searchSchema = z.object({
  orderId: z.string(),
  items: z.string(),
})

export const Route = createFileRoute('/order-confirmation')({
  validateSearch: searchSchema,
  component: OrderConfirmationPage,
})
