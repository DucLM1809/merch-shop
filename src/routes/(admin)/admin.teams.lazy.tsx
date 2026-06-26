import { createLazyFileRoute } from "@tanstack/react-router";

import { AdminTeamsView } from "@/modules/admin";

export const Route = createLazyFileRoute("/(admin)/admin/teams")({
  component: AdminTeamsView,
});
