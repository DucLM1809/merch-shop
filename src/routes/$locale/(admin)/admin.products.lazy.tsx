import { createLazyFileRoute } from "@tanstack/react-router";

import { AdminProductsView } from "@/modules/admin";

export const Route = createLazyFileRoute("/$locale/(admin)/admin/products")({
  component: AdminProductsView,
});
