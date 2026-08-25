import { createIsomorphicFn } from "@tanstack/react-start";

import { LOCALE_COOKIE_NAME, readLocaleCookie } from "./localeCookie";

import type { LocaleHints } from "./resolveLocale";

/**
 * The locale hints the current environment can offer. On the server they come off the
 * request itself, so a bare URL is resolved before anything renders; on the client (a
 * client-side navigation, or a test) the browser's equivalents stand in. createIsomorphicFn
 * lets the Start compiler strip the server branch from the client bundle entirely, so the
 * `@tanstack/react-start/server` import never reaches the browser.
 */
export const readLocaleHints = createIsomorphicFn()
  .server(async (): Promise<LocaleHints> => {
    const { getCookie, getRequestHeader } = await import("@tanstack/react-start/server");

    return {
      cookie: getCookie(LOCALE_COOKIE_NAME),
      acceptLanguage: getRequestHeader("accept-language"),
    };
  })
  .client(
    async (): Promise<LocaleHints> => ({
      cookie: readLocaleCookie(),
      acceptLanguage: navigator.languages?.join(",") ?? navigator.language,
    })
  );
