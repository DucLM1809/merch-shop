import { createLazyFileRoute } from "@tanstack/react-router";

import { AdminSkusView } from "@/modules/admin";

export const Route = createLazyFileRoute("/(admin)/admin/skus")({
  component: AdminSkusView,
});
