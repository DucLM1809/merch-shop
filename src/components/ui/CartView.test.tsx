import { screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { renderWithProviders } from '../../test-utils'
import { CartView } from './CartView'

const items = [
  { skuId: 'fj-s-black', productId: '1', productName: 'Faker Jersey', variant: 'S / Black', price: 59.99, quantity: 1 },
  { skuId: 'fj-m-white', productId: '1', productName: 'Faker Jersey', variant: 'M / White', price: 62.99, quantity: 2 },
]

describe('CartView', () => {
  it('shows empty state when no items', () => {
    renderWithProviders(<CartView items={[]} onUpdateQuantity={vi.fn()} onRemove={vi.fn()} />)
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument()
  })

  it('shows item count in heading', () => {
    renderWithProviders(<CartView items={items} onUpdateQuantity={vi.fn()} onRemove={vi.fn()} />)
    expect(screen.getByText('2 items')).toBeInTheDocument()
  })

  it('renders all item names', () => {
    renderWithProviders(<CartView items={items} onUpdateQuantity={vi.fn()} onRemove={vi.fn()} />)
    const jerseyItems = screen.getAllByText('Faker Jersey')
    expect(jerseyItems).toHaveLength(2)
  })

  it('computes correct subtotal', () => {
    // 59.99×1 + 62.99×2 = 185.97
    renderWithProviders(<CartView items={items} onUpdateQuantity={vi.fn()} onRemove={vi.fn()} />)
    expect(screen.getByTestId('cart-subtotal')).toHaveTextContent('$185.97')
  })

  it('calls onRemove with skuId when Remove clicked', () => {
    const onRemove = vi.fn()
    renderWithProviders(<CartView items={[items[0]]} onUpdateQuantity={vi.fn()} onRemove={onRemove} />)
    fireEvent.click(screen.getByRole('button', { name: /remove/i }))
    expect(onRemove).toHaveBeenCalledWith('fj-s-black')
  })

  it('calls onUpdateQuantity with quantity - 1 when decrement clicked', () => {
    const onUpdateQuantity = vi.fn()
    renderWithProviders(<CartView items={[items[0]]} onUpdateQuantity={onUpdateQuantity} onRemove={vi.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: /decrease quantity/i }))
    expect(onUpdateQuantity).toHaveBeenCalledWith('fj-s-black', 0)
  })

  it('calls onUpdateQuantity with quantity + 1 when increment clicked', () => {
    const onUpdateQuantity = vi.fn()
    renderWithProviders(<CartView items={[items[0]]} onUpdateQuantity={onUpdateQuantity} onRemove={vi.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: /increase quantity/i }))
    expect(onUpdateQuantity).toHaveBeenCalledWith('fj-s-black', 2)
  })

  it('shows singular "item" for one item', () => {
    renderWithProviders(<CartView items={[items[0]]} onUpdateQuantity={vi.fn()} onRemove={vi.fn()} />)
    expect(screen.getByText('1 item')).toBeInTheDocument()
  })
})
