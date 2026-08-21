import { redirect } from "@tanstack/react-router";

import { readLocaleHints } from "./localeHints";
import { resolveLocale, withLocalePrefix } from "./resolveLocale";

import type { ParsedLocation } from "@tanstack/react-router";

import type { SupportedLocale } from "./locales";

/**
 * The current page — path, search and hash alike — addressed under a different locale.
 * Shared with the switcher so "the same page in another language" means one thing.
 */
export function hrefUnderLocale(location: ParsedLocation, locale: SupportedLocale): string {
  const hash = location.hash ? `#${location.hash}` : "";

  return `${withLocalePrefix(location.pathname, locale)}${location.searchStr}${hash}`;
}

/**
 * Send a URL that carries no locale — or one we don't serve — to the same page under the
 * resolved locale. Thrown from `beforeLoad`, so on a document request it resolves on the
 * server and the browser is redirected before any markup is rendered.
 */
export async function redirectToResolvedLocale(location: ParsedLocation): Promise<never> {
  const locale = resolveLocale(await readLocaleHints());

  throw redirect({ href: hrefUnderLocale(location, locale), replace: true });
}
