import { createLazyFileRoute } from "@tanstack/react-router";

import { AdminTeamsView } from "@/modules/admin";

export const Route = createLazyFileRoute("/$locale/(admin)/admin/teams")({
  component: AdminTeamsView,
});
