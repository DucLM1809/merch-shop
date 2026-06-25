import { createFileRoute } from '@tanstack/react-router'

import { PublisherPage } from '@/modules/catalog'

export const Route = createFileRoute('/$publisherSlug/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { publisherSlug } = Route.useParams()
  return <PublisherPage publisherSlug={publisherSlug} />
}
