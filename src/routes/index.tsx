import { createFileRoute } from "@tanstack/react-router";

import { redirectToResolvedLocale } from "@/i18n/localeRedirect";

// The only path with no locale segment for `/$locale` to catch: the bare root.
export const Route = createFileRoute("/")({
  beforeLoad: ({ location }) => redirectToResolvedLocale(location),
});
