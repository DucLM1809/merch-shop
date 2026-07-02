import { createFileRoute } from "@tanstack/react-router";

import { productQueryOptions } from "@/modules/catalog";

export const Route = createFileRoute("/(catalog)/$publisherSlug/$gameSlug/products/$productSlug")({
  loader: async ({ context, params }) => {
    // Swallow fetch failures — the cached error state still lets useProduct() surface isError/retry.
    await context.queryClient
      .ensureQueryData(productQueryOptions(params.productSlug))
      .catch(() => {});
  },
});
