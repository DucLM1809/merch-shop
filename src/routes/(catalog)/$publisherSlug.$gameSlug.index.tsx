import { createFileRoute } from "@tanstack/react-router";

import { publisherQueryOptions } from "@/modules/catalog";

export const Route = createFileRoute("/(catalog)/$publisherSlug/$gameSlug/")({
  loader: async ({ context, params }) => {
    // Swallow fetch failures — the cached error state still lets usePublisher() surface isError/retry.
    await context.queryClient
      .ensureQueryData(publisherQueryOptions(params.publisherSlug))
      .catch(() => {});
  },
});
