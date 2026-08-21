import { redirect } from "@tanstack/react-router";

import { readLocaleHints } from "./localeHints";
import { resolveLocale, withLocalePrefix } from "./resolveLocale";

import type { ParsedLocation } from "@tanstack/react-router";

/**
 * Send a URL that carries no locale — or one we don't serve — to the same page under the
 * resolved locale. Thrown from `beforeLoad`, so on a document request it resolves on the
 * server and the browser is redirected before any markup is rendered.
 */
export async function redirectToResolvedLocale(location: ParsedLocation): Promise<never> {
  const locale = resolveLocale(await readLocaleHints());
  const hash = location.hash ? `#${location.hash}` : "";

  throw redirect({
    href: `${withLocalePrefix(location.pathname, locale)}${location.searchStr}${hash}`,
    replace: true,
  });
}
