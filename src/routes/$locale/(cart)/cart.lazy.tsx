import { createLazyFileRoute } from "@tanstack/react-router";

import { CartPage } from "@/modules/cart";

export const Route = createLazyFileRoute("/$locale/(cart)/cart")({
  component: CartPage,
});
