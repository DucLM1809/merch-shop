import { screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { renderWithProviders } from '../../test-utils'
import { ProductCatalogView } from './ProductCatalogView'
import type { Product } from '../../api/types'

const products: Product[] = [
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
  },
]

describe('ProductCatalogView', () => {
  it('hides product names when loading', () => {
    renderWithProviders(<ProductCatalogView products={undefined} isLoading={true} isError={false} />)
    expect(screen.queryByText('Faker Jersey')).not.toBeInTheDocument()
  })

  it('shows error message when isError', () => {
    renderWithProviders(<ProductCatalogView products={undefined} isLoading={false} isError={true} />)
    expect(screen.getByText(/failed to load products/i)).toBeInTheDocument()
  })

  it('shows empty message when products array is empty', () => {
    renderWithProviders(<ProductCatalogView products={[]} isLoading={false} isError={false} />)
    expect(screen.getByText(/no products found/i)).toBeInTheDocument()
  })

  it('renders all product names', () => {
    renderWithProviders(<ProductCatalogView products={products} isLoading={false} isError={false} />)
    expect(screen.getByText('Faker Jersey')).toBeInTheDocument()
    expect(screen.getByText('League of Legends Hoodie')).toBeInTheDocument()
  })

  it('renders formatted prices', () => {
    renderWithProviders(<ProductCatalogView products={products} isLoading={false} isError={false} />)
    expect(screen.getByText('$59.99')).toBeInTheDocument()
    expect(screen.getByText('$79.99')).toBeInTheDocument()
  })

  it('uses renderLink when provided', () => {
    renderWithProviders(
      <ProductCatalogView
        products={products}
        isLoading={false}
        isError={false}
        renderLink={(product, children) => <a href={`/products/${product.slug}`}>{children}</a>}
      />,
    )
    expect(screen.getByRole('link', { name: 'Faker Jersey' })).toHaveAttribute('href', '/products/faker-jersey')
  })
})
