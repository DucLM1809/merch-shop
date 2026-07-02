import type { JSX } from "react";

import { createFileRoute } from "@tanstack/react-router";

import { buildProductHeadMeta, productQueryOptions } from "@/modules/catalog";

export const Route = createFileRoute("/(catalog)/$publisherSlug/$gameSlug/products/$productSlug")({
  loader: async ({ context, params }) => {
    // Swallow fetch failures — the cached error state still lets useProduct() surface isError/retry.
    return await context.queryClient
      .ensureQueryData(productQueryOptions(params.productSlug))
      .catch(() => undefined);
  },
  head: ({ loaderData }) => ({
    // Router's React types only expose native <meta> attrs here, but the runtime
    // (headContentUtils) special-cases `title` and `script:ld+json` keys.
    meta: (loaderData?.data ? buildProductHeadMeta(loaderData.data) : []) as Array<
      JSX.IntrinsicElements["meta"]
    >,
  }),
});
