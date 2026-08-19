import { createLazyFileRoute } from "@tanstack/react-router";

import { AdminPublishersView } from "@/modules/admin";

export const Route = createLazyFileRoute("/$locale/(admin)/admin/publishers")({
  component: AdminPublishersView,
});
