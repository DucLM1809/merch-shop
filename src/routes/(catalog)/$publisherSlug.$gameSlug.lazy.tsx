import { createLazyFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/(catalog)/$publisherSlug/$gameSlug")({
  component: () => <Outlet />,
});
