import { createLazyFileRoute } from "@tanstack/react-router";

import { OrderConfirmationPage } from "@/modules/orders";
import type { CartItem } from "@/store/cart";

export const Route = createLazyFileRoute("/(checkout)/order-confirmation")({
  component: RouteComponent,
});

function RouteComponent() {
  const { orderId, items: itemsJson } = Route.useSearch();
  const items = JSON.parse(itemsJson) as CartItem[];
  return <OrderConfirmationPage orderId={orderId} items={items} />;
}
