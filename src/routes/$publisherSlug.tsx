import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/$publisherSlug')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Outlet />
}
