import { createFileRoute } from '@tanstack/react-router'

import { GamePage } from '@/modules/catalog'

export const Route = createFileRoute('/$publisherSlug/$gameSlug/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { publisherSlug, gameSlug } = Route.useParams()
  return <GamePage publisherSlug={publisherSlug} gameSlug={gameSlug} />
}
