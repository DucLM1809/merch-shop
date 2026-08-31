import type { JSX } from "react";

import { useSelector } from "@tanstack/react-store";

import { cartStore, updateQuantity, removeFromCart } from "@/store/cart";
import { CartView } from "./CartView";

export function CartPage(): JSX.Element {
  const items = useSelector(cartStore, (s) => s.items);

  return <CartView items={items} onUpdateQuantity={updateQuantity} onRemove={removeFromCart} />;
}
