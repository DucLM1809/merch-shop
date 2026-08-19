import { createLazyFileRoute } from "@tanstack/react-router";

import { CheckoutPage } from "@/modules/checkout";

export const Route = createLazyFileRoute("/$locale/(checkout)/checkout")({
  component: CheckoutPage,
});
