import { useStore } from '@tanstack/react-store'
import { cartStore, updateQuantity, removeFromCart } from '../store/cart'
import { CartView } from './ui/CartView'

export function CartPage() {
  const items = useStore(cartStore, (s) => s.items)

  return (
    <CartView
      items={items}
      onUpdateQuantity={updateQuantity}
      onRemove={removeFromCart}
    />
  )
}
