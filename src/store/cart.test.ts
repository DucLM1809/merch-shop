import { describe, it, expect, beforeEach } from 'vitest'
import { cartStore, addToCart, updateQuantity, removeFromCart, getSubtotal, clearCart } from './cart'

const sku1 = { skuId: 'fj-s-black', productId: '1', productName: 'Faker Jersey', variant: 'S / Black', price: 59.99 }
const sku2 = { skuId: 'fj-m-white', productId: '1', productName: 'Faker Jersey', variant: 'M / White', price: 62.99 }

beforeEach(() => clearCart())

describe('cart store', () => {
  it('adds item with quantity 1', () => {
    addToCart(sku1)
    expect(cartStore.state.items).toHaveLength(1)
    expect(cartStore.state.items[0].quantity).toBe(1)
  })

  it('increments quantity on duplicate sku', () => {
    addToCart(sku1)
    addToCart(sku1)
    expect(cartStore.state.items).toHaveLength(1)
    expect(cartStore.state.items[0].quantity).toBe(2)
  })

  it('updates quantity', () => {
    addToCart(sku1)
    updateQuantity('fj-s-black', 3)
    expect(cartStore.state.items[0].quantity).toBe(3)
  })

  it('removes item when quantity set to 0', () => {
    addToCart(sku1)
    updateQuantity('fj-s-black', 0)
    expect(cartStore.state.items).toHaveLength(0)
  })

  it('removes item by skuId', () => {
    addToCart(sku1)
    addToCart(sku2)
    removeFromCart('fj-s-black')
    expect(cartStore.state.items).toHaveLength(1)
    expect(cartStore.state.items[0].skuId).toBe('fj-m-white')
  })

  it('computes subtotal', () => {
    addToCart(sku1)
    addToCart(sku2)
    updateQuantity('fj-s-black', 2)
    expect(getSubtotal(cartStore.state.items)).toBeCloseTo(59.99 * 2 + 62.99)
  })

  it('total item count sums quantities', () => {
    addToCart(sku1)
    addToCart(sku2)
    updateQuantity('fj-s-black', 3)
    const total = cartStore.state.items.reduce((s, i) => s + i.quantity, 0)
    expect(total).toBe(4)
  })
})
