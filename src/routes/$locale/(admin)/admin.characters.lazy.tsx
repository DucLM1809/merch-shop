import { createLazyFileRoute } from "@tanstack/react-router";

import { AdminCharactersView } from "@/modules/admin";

export const Route = createLazyFileRoute("/$locale/(admin)/admin/characters")({
  component: AdminCharactersView,
});
