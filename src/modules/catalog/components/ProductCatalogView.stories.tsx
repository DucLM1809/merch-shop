import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { ProductCatalogView } from './ProductCatalogView'
import type { Product } from '@/api/types'

const sampleProducts: Product[] = [
  {
    id: '1',
    slug: 'faker-jersey',
    name: 'Faker Jersey',
    price: 59.99,
    publisherId: 'riot',
    publisherSlug: 'riot',
    gameId: 'lol',
    gameSlug: 'league-of-legends',
    imageUrl: 'https://picsum.photos/seed/faker-jersey/400/400',
  },
  {
    id: '2',
    slug: 'lol-hoodie',
    name: 'League of Legends Hoodie',
    price: 79.99,
    publisherId: 'riot',
    publisherSlug: 'riot',
    gameId: 'lol',
    gameSlug: 'league-of-legends',
    imageUrl: 'https://picsum.photos/seed/lol-hoodie/400/400',
  },
  {
    id: '3',
    slug: 'valorant-team-jersey',
    name: 'Valorant Team Jersey',
    price: 54.99,
    publisherId: 'riot',
    publisherSlug: 'riot',
    gameId: 'val',
    gameSlug: 'valorant',
    imageUrl: 'https://picsum.photos/seed/valorant-jersey/400/400',
  },
  {
    id: '4',
    slug: 'cs2-team-jersey',
    name: 'CS2 Team Jersey',
    price: 49.99,
    publisherId: 'valve',
    publisherSlug: 'valve',
    gameId: 'cs2',
    gameSlug: 'cs2',
    imageUrl: 'https://picsum.photos/seed/cs2-jersey/400/400',
  },
]

const meta: Meta<typeof ProductCatalogView> = {
  component: ProductCatalogView,
  title: 'Components/ProductCatalogView',
}
export default meta

type Story = StoryObj<typeof ProductCatalogView>

export const Loading: Story = {
  args: {
    products: undefined,
    isLoading: true,
    isError: false,
  },
}

export const Empty: Story = {
  args: {
    products: [],
    isLoading: false,
    isError: false,
  },
}

export const Default: Story = {
  args: {
    products: sampleProducts,
    isLoading: false,
    isError: false,
  },
}

export const NoImages: Story = {
  args: {
    products: sampleProducts.map(({ imageUrl: _, ...p }) => p),
    isLoading: false,
    isError: false,
  },
}
