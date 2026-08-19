import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { ORDER_STATUSES } from "@/api/types";
import { adminOrdersQueryOptions } from "@/modules/orders";

const adminOrdersSearch = z.object({
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).max(100).optional(),
  status: z.enum(ORDER_STATUSES).optional(),
});

export const Route = createFileRoute("/$locale/(admin)/admin/orders")({
  validateSearch: adminOrdersSearch,
  loaderDeps: ({ search }) => search,
  loader: async ({ context, deps }) => {
    await context.queryClient.ensureQueryData(adminOrdersQueryOptions(deps)).catch(() => {});
  },
});
