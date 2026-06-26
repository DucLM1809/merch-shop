import { createLazyFileRoute } from "@tanstack/react-router";

import { AdminPublishersView } from "@/modules/admin";

export const Route = createLazyFileRoute("/(admin)/admin/publishers")({
  component: AdminPublishersView,
});
