import { createLazyFileRoute } from "@tanstack/react-router";

import { CartPage } from "@/modules/cart";

export const Route = createLazyFileRoute("/(cart)/cart")({
  component: CartPage,
});
