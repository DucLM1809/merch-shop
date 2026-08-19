import { createLazyFileRoute } from "@tanstack/react-router";

import { AdminSkusView } from "@/modules/admin";

export const Route = createLazyFileRoute("/$locale/(admin)/admin/skus")({
  component: AdminSkusView,
});
