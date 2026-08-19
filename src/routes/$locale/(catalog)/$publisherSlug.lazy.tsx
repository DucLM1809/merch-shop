import { createLazyFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/$locale/(catalog)/$publisherSlug")({
  component: () => <Outlet />,
});
