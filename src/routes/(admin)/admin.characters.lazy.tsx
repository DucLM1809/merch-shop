import { createLazyFileRoute } from "@tanstack/react-router";

import { AdminCharactersView } from "@/modules/admin";

export const Route = createLazyFileRoute("/(admin)/admin/characters")({
  component: AdminCharactersView,
});
