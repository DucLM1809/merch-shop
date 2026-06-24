import { useState } from 'react'
import { Box, Button, Flex, Heading, Input, Text, VStack } from '@chakra-ui/react'
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { useNavigate } from '@tanstack/react-router'
import { useStore } from '@tanstack/react-store'
import { cartStore, clearCart } from '../store/cart'
import { client } from '../api/client'
import type { CreateOrderRequest, ShippingAddress } from '../api/types'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ?? 'pk_test_placeholder')

interface FieldErrors {
  fullName?: string
  email?: string
  line1?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
}

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

  function field(name: keyof ShippingAddress) {
    return {
      value: fields[name] ?? '',
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        setFields((f) => ({ ...f, [name]: e.target.value }))
        setErrors((er) => ({ ...er, [name]: undefined }))
      },
    }
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
    <Box as="form" onSubmit={handleSubmit} noValidate>
      <VStack gap={4} align="stretch">
        <Heading size="xl" color="white" fontWeight="800">Checkout</Heading>

        <Heading size="sm" color="gray.400" fontWeight="600" textTransform="uppercase" letterSpacing="0.05em">
          Shipping
        </Heading>

        <FieldRow label="Full Name" error={errors.fullName}>
          <Input placeholder="Full Name" {...field('fullName')} />
        </FieldRow>
        <FieldRow label="Email" error={errors.email}>
          <Input placeholder="Email" type="email" {...field('email')} />
        </FieldRow>
        <FieldRow label="Address" error={errors.line1}>
          <Input placeholder="Street address" {...field('line1')} />
        </FieldRow>
        <Input placeholder="Apartment, suite, etc. (optional)" {...field('line2')} />
        <Flex gap={3}>
          <FieldRow label="City" error={errors.city} flex="1">
            <Input placeholder="City" {...field('city')} />
          </FieldRow>
          <FieldRow label="State" error={errors.state} flex="1">
            <Input placeholder="State" {...field('state')} />
          </FieldRow>
        </Flex>
        <Flex gap={3}>
          <FieldRow label="Postal Code" error={errors.postalCode} flex="1">
            <Input placeholder="Postal code" {...field('postalCode')} />
          </FieldRow>
          <FieldRow label="Country" error={errors.country} flex="1">
            <Input placeholder="Country" {...field('country')} />
          </FieldRow>
        </Flex>

        <Heading size="sm" color="gray.400" fontWeight="600" textTransform="uppercase" letterSpacing="0.05em" mt={2}>
          Payment
        </Heading>
        <Box
          p={3}
          borderRadius="md"
          border="1px solid"
          borderColor="gray.700"
          bg="gray.900"
        >
          <CardElement />
        </Box>

        {paymentError && (
          <Text color="red.400" fontSize="sm" data-testid="payment-error">{paymentError}</Text>
        )}

        <Button
          type="submit"
          colorPalette="blue"
          size="lg"
          fontWeight="700"
          loading={submitting}
          mt={2}
        >
          Pay ${items.reduce((s, i) => s + i.price * i.quantity, 0).toFixed(2)}
        </Button>
      </VStack>
    </Box>
  )
}

function FieldRow({
  label,
  error,
  children,
  flex,
}: {
  label: string
  error?: string
  children: React.ReactNode
  flex?: string
}) {
  return (
    <Box flex={flex}>
      {children}
      {error && (
        <Text color="red.400" fontSize="xs" mt={1}>{error}</Text>
      )}
    </Box>
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
