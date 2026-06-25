import type { JSX } from 'react'

import { useStore } from '@tanstack/react-store'

import { cartStore, updateQuantity, removeFromCart } from '@/store/cart'
import { CartView } from './CartView'

export function CartPage(): JSX.Element {
  const items = useStore(cartStore, (s) => s.items)

  return (
    <CartView
      items={items}
      onUpdateQuantity={updateQuantity}
      onRemove={removeFromCart}
    />
  )
}
