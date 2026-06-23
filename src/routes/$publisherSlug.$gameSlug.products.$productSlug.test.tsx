import { screen, waitFor, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { renderRoute } from '../test-utils'

const PRODUCT_ROUTE = '/riot/league-of-legends/products/faker-jersey'

describe('Product detail page', () => {
  it('renders product name and description', async () => {
    renderRoute(PRODUCT_ROUTE)
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /faker jersey/i })).toBeInTheDocument()
      expect(screen.getByText(/official t1 faker jersey/i)).toBeInTheDocument()
    })
  })

  it('shows all variant dimensions', async () => {
    renderRoute(PRODUCT_ROUTE)
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'S' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'M' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'L' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Black' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'White' })).toBeInTheDocument()
    })
  })

  it('unavailable size L is disabled', async () => {
    renderRoute(PRODUCT_ROUTE)
    const lBtn = await screen.findByRole('button', { name: 'L' })
    expect(lBtn).toBeDisabled()
  })

  it('selecting a size marks it as pressed', async () => {
    renderRoute(PRODUCT_ROUTE)
    const sBtn = await screen.findByRole('button', { name: 'S' })
    fireEvent.click(sBtn)
    expect(sBtn).toHaveAttribute('aria-pressed', 'true')
  })

  it('price updates when a full SKU is selected', async () => {
    renderRoute(PRODUCT_ROUTE)
    // Default price shown before selection
    await screen.findByRole('button', { name: 'S' })

    fireEvent.click(screen.getByRole('button', { name: 'S' }))
    fireEvent.click(screen.getByRole('button', { name: 'White' }))

    // S + White = $62.99
    await waitFor(() => {
      expect(screen.getByTestId('product-price')).toHaveTextContent('$62.99')
    })
  })

  it('Add to Cart is disabled with no SKU selected', async () => {
    renderRoute(PRODUCT_ROUTE)
    const addBtn = await screen.findByRole('button', { name: /add to cart/i })
    expect(addBtn).toBeDisabled()
  })

  it('Add to Cart is enabled when an available SKU is fully selected', async () => {
    renderRoute(PRODUCT_ROUTE)
    await screen.findByRole('button', { name: 'S' })

    fireEvent.click(screen.getByRole('button', { name: 'S' }))
    fireEvent.click(screen.getByRole('button', { name: 'Black' }))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /add to cart/i })).not.toBeDisabled()
    })
  })

  it('Add to Cart stays disabled when unavailable SKU is selected', async () => {
    renderRoute(PRODUCT_ROUTE)
    await screen.findByRole('button', { name: 'M' })

    fireEvent.click(screen.getByRole('button', { name: 'M' }))
    fireEvent.click(screen.getByRole('button', { name: 'White' }))

    // M + White = unavailable
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /add to cart/i })).toBeDisabled()
    })
  })
})
