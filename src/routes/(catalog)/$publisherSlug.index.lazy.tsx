import { createLazyFileRoute } from "@tanstack/react-router";

import { PublisherPage } from "@/modules/catalog";

export const Route = createLazyFileRoute("/(catalog)/$publisherSlug/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { publisherSlug } = Route.useParams();
  return <PublisherPage publisherSlug={publisherSlug} />;
}
