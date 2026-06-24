import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { fn } from 'storybook/test'
import { Input } from '@chakra-ui/react'
import { CheckoutFormView } from './CheckoutFormView'

const filledFields = {
  fullName: 'Jane Doe',
  email: 'jane@example.com',
  line1: '123 Main St',
  city: 'Los Angeles',
  state: 'CA',
  postalCode: '90001',
  country: 'US',
}

const meta = {
  component: CheckoutFormView,
  parameters: { layout: 'padded' },
  args: {
    fields: {},
    errors: {},
    paymentError: null,
    submitting: false,
    total: 59.99,
    onFieldChange: fn(),
    onSubmit: fn(),
    cardSlot: <Input placeholder="Card number (mock)" readOnly />,
  },
} satisfies Meta<typeof CheckoutFormView>

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {}

export const FilledOut: Story = {
  args: { fields: filledFields },
}

export const ValidationErrors: Story = {
  args: {
    errors: {
      fullName: 'Full name is required',
      email: 'Email is required',
      line1: 'Address is required',
      city: 'City is required',
      state: 'State is required',
      postalCode: 'Postal code is required',
      country: 'Country is required',
    },
  },
}

export const PaymentDeclined: Story = {
  args: {
    fields: filledFields,
    paymentError: 'Your card was declined.',
  },
}

export const Submitting: Story = {
  args: {
    fields: filledFields,
    submitting: true,
  },
}
