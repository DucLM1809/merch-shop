import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { fn } from 'storybook/test'
import { CartView } from './CartView'

const meta = {
  component: CartView,
  parameters: { layout: 'padded' },
  args: {
    onUpdateQuantity: fn(),
    onRemove: fn(),
  },
} satisfies Meta<typeof CartView>

export default meta
type Story = StoryObj<typeof meta>

const items = [
  { skuId: 'fj-s-black', productId: '1', productName: 'Faker Jersey', variant: 'S / Black', price: 59.99, quantity: 1 },
  { skuId: 'fj-m-white', productId: '1', productName: 'Faker Jersey', variant: 'M / White', price: 62.99, quantity: 2 },
  { skuId: 'lol-hoodie-m', productId: '2', productName: 'League of Legends Hoodie', variant: 'M', price: 79.99, quantity: 1 },
]

export const Empty: Story = {
  args: { items: [] },
}

export const SingleItem: Story = {
  args: { items: [items[0]] },
}

export const MultipleItems: Story = {
  args: { items },
}
