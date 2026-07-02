import type { JSX } from "react";

import { createFileRoute } from "@tanstack/react-router";

import { buildGameHeadMeta, publisherQueryOptions } from "@/modules/catalog";

export const Route = createFileRoute("/(catalog)/$publisherSlug/$gameSlug/")({
  loader: async ({ context, params }) => {
    // Swallow fetch failures — the cached error state still lets usePublisher() surface isError/retry.
    return await context.queryClient
      .ensureQueryData(publisherQueryOptions(params.publisherSlug))
      .catch(() => undefined);
  },
  head: ({ loaderData, params }) => {
    const publisher = loaderData?.data;
    const game = publisher?.games.find((g) => g.slug === params.gameSlug);
    const meta = game
      ? buildGameHeadMeta({
          gameName: game.name,
          gameSlug: params.gameSlug,
          publisherName: publisher?.name,
          publisherSlug: params.publisherSlug,
        })
      : [];
    // Router's React types only expose native <meta> attrs here, but the runtime
    // (headContentUtils) special-cases `title` and `script:ld+json` keys.
    return { meta: meta as Array<JSX.IntrinsicElements["meta"]> };
  },
});
