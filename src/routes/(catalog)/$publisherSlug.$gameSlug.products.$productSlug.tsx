import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(catalog)/$publisherSlug/$gameSlug/products/$productSlug")(
  {}
);
