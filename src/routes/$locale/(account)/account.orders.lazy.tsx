import { createLazyFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/$locale/(account)/account/orders")({
  component: () => <Outlet />,
});
