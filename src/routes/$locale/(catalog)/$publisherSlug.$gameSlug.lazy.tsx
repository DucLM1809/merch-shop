import { createLazyFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/$locale/(catalog)/$publisherSlug/$gameSlug")({
  component: () => <Outlet />,
});
