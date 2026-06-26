import { createFileRoute } from "@tanstack/react-router";

import { AdminPublishersView } from "@/modules/admin";

export const Route = createFileRoute("/admin/publishers")({
  component: AdminPublishersView,
});
