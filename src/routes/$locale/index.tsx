import { createFileRoute } from "@tanstack/react-router";

import { productsQueryOptions } from "@/modules/catalog";

export const Route = createFileRoute("/$locale/")({
  loader: async ({ context }) => {
    // Swallow fetch failures — the cached error state still lets useProducts() surface isError/retry.
    await context.queryClient.ensureQueryData(productsQueryOptions()).catch(() => {});
  },
});
