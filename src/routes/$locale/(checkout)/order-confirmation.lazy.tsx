import { createLazyFileRoute } from "@tanstack/react-router";

import { OrderConfirmationPage, useOrderByPaymentIntent } from "@/modules/orders";
import type { CartItem } from "@/store/cart";

export const Route = createLazyFileRoute("/$locale/(checkout)/order-confirmation")({
  component: RouteComponent,
});

function RouteComponent() {
  const { paymentIntentId, items: itemsJson } = Route.useSearch();
  const items = JSON.parse(itemsJson) as CartItem[];
  const { data: order, isLoading } = useOrderByPaymentIntent(paymentIntentId);
  return (
    <OrderConfirmationPage
      orderId={order?.id}
      status={order?.status}
      isResolving={!!paymentIntentId && isLoading}
      items={items}
    />
  );
}
