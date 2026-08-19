import { createLazyFileRoute } from "@tanstack/react-router";

import { ProductDetail } from "@/modules/catalog";

export const Route = createLazyFileRoute(
  "/$locale/(catalog)/$publisherSlug/$gameSlug/products/$productSlug"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { productSlug } = Route.useParams();
  return <ProductDetail productSlug={productSlug} />;
}
