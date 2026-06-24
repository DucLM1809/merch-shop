import { useState } from 'react'
import { Box } from '@chakra-ui/react'
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { useNavigate } from '@tanstack/react-router'
import { useStore } from '@tanstack/react-store'
import { cartStore, clearCart } from '../store/cart'
import { client } from '../api/client'
import type { CreateOrderRequest, ShippingAddress } from '../api/types'
import { CheckoutFormView, type FieldErrors } from './ui/CheckoutFormView'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ?? 'pk_test_placeholder')

function validate(fields: Partial<ShippingAddress>): FieldErrors {
  const errors: FieldErrors = {}
  if (!fields.fullName?.trim()) errors.fullName = 'Full name is required'
  if (!fields.email?.trim()) errors.email = 'Email is required'
  if (!fields.line1?.trim()) errors.line1 = 'Address is required'
  if (!fields.city?.trim()) errors.city = 'City is required'
  if (!fields.state?.trim()) errors.state = 'State is required'
  if (!fields.postalCode?.trim()) errors.postalCode = 'Postal code is required'
  if (!fields.country?.trim()) errors.country = 'Country is required'
  return errors
}

function CheckoutForm() {
  const navigate = useNavigate()
  const stripe = useStripe()
  const elements = useElements()
  const items = useStore(cartStore, (s) => s.items)

  const [fields, setFields] = useState<Partial<ShippingAddress>>({})
  const [errors, setErrors] = useState<FieldErrors>({})
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  function handleFieldChange(name: keyof ShippingAddress, value: string) {
    setFields((f) => ({ ...f, [name]: value }))
    setErrors((er) => ({ ...er, [name]: undefined }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate(fields)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    if (!stripe || !elements) return

    setSubmitting(true)
    setPaymentError(null)

    try {
      const body: CreateOrderRequest = {
        shipping: fields as ShippingAddress,
        lines: items.map((i) => ({
          skuId: i.skuId,
          productName: i.productName,
          variant: i.variant,
          price: i.price,
          quantity: i.quantity,
        })),
      }
      const { orderId, clientSecret } = await client.createOrder(body)

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: elements.getElement(CardElement)! },
      })

      if (result.error) {
        setPaymentError(result.error.message ?? 'Payment failed')
        return
      }

      clearCart()
      navigate({
        to: '/order-confirmation',
        search: { orderId, items: JSON.stringify(items) },
      })
    } catch {
      setPaymentError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <CheckoutFormView
      fields={fields}
      errors={errors}
      paymentError={paymentError}
      submitting={submitting}
      total={items.reduce((s, i) => s + i.price * i.quantity, 0)}
      onFieldChange={handleFieldChange}
      onSubmit={handleSubmit}
      cardSlot={<CardElement />}
    />
  )
}

export function CheckoutPage() {
  return (
    <Box p={8} maxW="2xl" mx="auto">
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </Box>
  )
}
