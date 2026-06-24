import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { fn } from 'storybook/test'
import { ProductDetailView } from './ProductDetailView'

const product = {
  id: '1',
  slug: 'faker-jersey',
  name: 'Faker Jersey',
  description: 'Official T1 Faker jersey — lightweight performance fabric.',
  price: 59.99,
  publisherId: 'riot',
  publisherSlug: 'riot',
  gameId: 'lol',
  gameSlug: 'league-of-legends',
  accentColor: '#d13639',
  imageUrl: 'https://picsum.photos/seed/faker-jersey/400/400',
  skus: [
    { id: 'fj-s-black', size: 'S', color: 'Black', price: 59.99, available: true },
    { id: 'fj-m-black', size: 'M', color: 'Black', price: 59.99, available: true },
    { id: 'fj-l-black', size: 'L', color: 'Black', price: 59.99, available: false },
    { id: 'fj-s-white', size: 'S', color: 'White', price: 62.99, available: true },
    { id: 'fj-m-white', size: 'M', color: 'White', price: 62.99, available: false },
  ],
}

const meta = {
  component: ProductDetailView,
  parameters: { layout: 'padded' },
  args: { onAddToCart: fn() },
} satisfies Meta<typeof ProductDetailView>

export default meta
type Story = StoryObj<typeof meta>

export const Loading: Story = {
  args: { product: undefined, isLoading: true, isError: false },
}

export const Error: Story = {
  args: { product: undefined, isLoading: false, isError: true },
}

export const Default: Story = {
  args: { product, isLoading: false, isError: false },
}

export const NoImage: Story = {
  args: {
    product: { ...product, imageUrl: undefined },
    isLoading: false,
    isError: false,
  },
}

export const NoSkus: Story = {
  args: {
    product: { ...product, skus: [] },
    isLoading: false,
    isError: false,
  },
}

export const EditionVariants: Story = {
  args: {
    product: {
      ...product,
      skus: [
        { id: 'fj-standard', edition: 'Standard', price: 59.99, available: true },
        { id: 'fj-pro', edition: 'Pro', price: 89.99, available: true },
        { id: 'fj-collector', edition: "Collector's", price: 129.99, available: false },
      ],
    },
    isLoading: false,
    isError: false,
  },
}
