import { createLazyFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/(account)/account/orders")({
  component: () => <Outlet />,
});
