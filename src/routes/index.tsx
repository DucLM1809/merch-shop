import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { productsQueryOptions } from "@/modules/catalog";

const filterSearch = z.object({
  game: z.string().optional(),
  team: z.string().optional(),
  character: z.string().optional(),
});

export const Route = createFileRoute("/")({
  validateSearch: filterSearch,
  loaderDeps: ({ search }) => search,
  loader: async ({ context, deps }) => {
    // Swallow fetch failures — the cached error state still lets useProducts() surface isError/retry.
    await context.queryClient.ensureQueryData(productsQueryOptions(deps)).catch(() => {});
  },
});
