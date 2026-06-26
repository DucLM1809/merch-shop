import { createLazyFileRoute } from "@tanstack/react-router";

import { AdminGamesView } from "@/modules/admin";

export const Route = createLazyFileRoute("/(admin)/admin/games")({
  component: AdminGamesView,
});
