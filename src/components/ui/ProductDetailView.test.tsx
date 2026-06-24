import { screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { renderWithProviders } from '../../test-utils'
import { ProductDetailView } from './ProductDetailView'

const product = {
  id: '1',
  slug: 'faker-jersey',
  name: 'Faker Jersey',
  description: 'Official T1 Faker jersey.',
  price: 59.99,
  publisherId: 'riot',
  publisherSlug: 'riot',
  gameId: 'lol',
  gameSlug: 'league-of-legends',
  accentColor: '#d13639',
  skus: [
    { id: 'fj-s-black', size: 'S', color: 'Black', price: 59.99, available: true },
    { id: 'fj-m-black', size: 'M', color: 'Black', price: 59.99, available: true },
    { id: 'fj-l-black', size: 'L', color: 'Black', price: 59.99, available: false },
  ],
}

describe('ProductDetailView', () => {
  it('shows no heading when loading', () => {
    renderWithProviders(<ProductDetailView product={undefined} isLoading={true} isError={false} />)
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })

  it('shows error message when isError', () => {
    renderWithProviders(<ProductDetailView product={undefined} isLoading={false} isError={true} />)
    expect(screen.getByText(/failed to load product/i)).toBeInTheDocument()
  })

  it('renders product name as heading', () => {
    renderWithProviders(<ProductDetailView product={product} isLoading={false} isError={false} />)
    expect(screen.getByRole('heading', { name: 'Faker Jersey' })).toBeInTheDocument()
  })

  it('renders product price', () => {
    renderWithProviders(<ProductDetailView product={product} isLoading={false} isError={false} />)
    expect(screen.getByTestId('product-price')).toHaveTextContent('$59.99')
  })

  it('renders all size options', () => {
    renderWithProviders(<ProductDetailView product={product} isLoading={false} isError={false} />)
    expect(screen.getByRole('button', { name: 'S' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'M' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'L' })).toBeInTheDocument()
  })

  it('Add to Cart is disabled when no SKU fully selected', () => {
    renderWithProviders(<ProductDetailView product={product} isLoading={false} isError={false} />)
    expect(screen.getByRole('button', { name: /add to cart/i })).toBeDisabled()
  })

  it('enables Add to Cart and calls onAddToCart when a valid SKU is selected', () => {
    const onAddToCart = vi.fn()
    renderWithProviders(
      <ProductDetailView product={product} isLoading={false} isError={false} onAddToCart={onAddToCart} />,
    )
    fireEvent.click(screen.getByRole('button', { name: 'S' }))
    fireEvent.click(screen.getByRole('button', { name: 'Black' }))
    const addBtn = screen.getByRole('button', { name: /add to cart/i })
    expect(addBtn).not.toBeDisabled()
    fireEvent.click(addBtn)
    expect(onAddToCart).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'fj-s-black', available: true }),
    )
  })

  it('unavailable SKU keeps Add to Cart disabled', () => {
    renderWithProviders(<ProductDetailView product={product} isLoading={false} isError={false} />)
    fireEvent.click(screen.getByRole('button', { name: 'L' }))
    fireEvent.click(screen.getByRole('button', { name: 'Black' }))
    expect(screen.getByRole('button', { name: /add to cart/i })).toBeDisabled()
  })

  it('renders description when provided', () => {
    renderWithProviders(<ProductDetailView product={product} isLoading={false} isError={false} />)
    expect(screen.getByText('Official T1 Faker jersey.')).toBeInTheDocument()
  })
})
