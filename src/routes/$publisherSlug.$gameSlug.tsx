import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/$publisherSlug/$gameSlug')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Outlet />
}
