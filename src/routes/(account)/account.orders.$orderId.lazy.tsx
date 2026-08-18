import { createLazyFileRoute } from "@tanstack/react-router";

import { OrderDetailPage } from "@/modules/orders";

export const Route = createLazyFileRoute("/(account)/account/orders/$orderId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { orderId } = Route.useParams();
  return <OrderDetailPage orderId={orderId} />;
}
