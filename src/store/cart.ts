import { Store } from '@tanstack/react-store'

export type CartItem = {
  skuId: string
  productId: string
  productName: string
  variant: string
  price: number
  quantity: number
}

type CartState = {
  items: CartItem[]
}

const STORAGE_KEY = 'merch-cart'

function load(): CartState {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : { items: [] }
  } catch {
    return { items: [] }
  }
}

export const cartStore = new Store<CartState>(load())

cartStore.subscribe(() => {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(cartStore.state))
  } catch {
    // sessionStorage unavailable (SSR / private browsing quota)
  }
})

export function addToCart(item: Omit<CartItem, 'quantity'>) {
  cartStore.setState((s) => {
    const existing = s.items.find((i) => i.skuId === item.skuId)
    if (existing) {
      return { items: s.items.map((i) => i.skuId === item.skuId ? { ...i, quantity: i.quantity + 1 } : i) }
    }
    return { items: [...s.items, { ...item, quantity: 1 }] }
  })
}

export function updateQuantity(skuId: string, quantity: number) {
  if (quantity <= 0) {
    removeFromCart(skuId)
    return
  }
  cartStore.setState((s) => ({
    items: s.items.map((i) => i.skuId === skuId ? { ...i, quantity } : i),
  }))
}

export function removeFromCart(skuId: string) {
  cartStore.setState((s) => ({ items: s.items.filter((i) => i.skuId !== skuId) }))
}

export function clearCart() {
  cartStore.setState(() => ({ items: [] }))
}

export function getSubtotal(items: CartItem[]) {
  return items.reduce((sum, i) => sum + i.price * i.quantity, 0)
}

export function formatVariant(size?: string, color?: string, edition?: string) {
  return [size, color, edition].filter(Boolean).join(' / ')
}
