import { createLazyFileRoute } from "@tanstack/react-router";

import { CheckoutPage } from "@/modules/checkout";

export const Route = createLazyFileRoute("/(checkout)/checkout")({
  component: CheckoutPage,
});
