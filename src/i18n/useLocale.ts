import { useRouterState } from "@tanstack/react-router";

import { DEFAULT_LOCALE, isSupportedLocale } from "./locales";

import type { SupportedLocale } from "./locales";

/**
 * The locale segment of the current URL, for building `to="/$locale/..."` links.
 *
 * Reads the pathname rather than the route param so it also works for chrome
 * rendered above the `/$locale` layout (the root shell) and for components
 * rendered outside a route match in tests. An unrecognized segment only shows up
 * mid-redirect — the `/$locale` layout sends it to a supported locale — so the
 * default locale stands in for that tick.
 */
export function useLocale(): SupportedLocale {
  const firstSegment = useRouterState({
    select: (state) => state.location.pathname.split("/")[1] ?? "",
  });

  return isSupportedLocale(firstSegment) ? firstSegment : DEFAULT_LOCALE;
}
