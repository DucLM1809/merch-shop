import { useRouterState } from "@tanstack/react-router";

import { DEFAULT_LOCALE, isSupportedLocale } from "./locales";

import type { SupportedLocale } from "./locales";

/**
 * The locale segment of the current URL, for building `to="/$locale/..."` links.
 *
 * Reads the pathname rather than the route param so it also works for chrome
 * rendered above the `/$locale` layout (the root shell) and for components
 * rendered outside a route match in tests. Falls back to the default locale for
 * an unrecognized segment — resolving those properly, with a redirect, is
 * merch-shop-giw.9.
 */
export function useLocale(): SupportedLocale {
  const firstSegment = useRouterState({
    select: (state) => state.location.pathname.split("/")[1] ?? "",
  });

  return isSupportedLocale(firstSegment) ? firstSegment : DEFAULT_LOCALE;
}
