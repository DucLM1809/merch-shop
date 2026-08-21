import { LOCALE_COOKIE_NAME } from "./resolveLocale";

import type { LocaleHints } from "./resolveLocale";

function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;

  const entry = document.cookie.split("; ").find((part) => part.startsWith(`${name}=`));

  return entry ? decodeURIComponent(entry.slice(name.length + 1)) : undefined;
}

/**
 * The locale hints the current environment can offer. On the server they come off the
 * request itself, so a bare URL is resolved before anything renders; on the client (a
 * client-side navigation, or a test) the browser's equivalents stand in. The server
 * helpers are imported lazily so they never reach the browser bundle.
 */
export async function readLocaleHints(): Promise<LocaleHints> {
  if (import.meta.env.SSR) {
    const { getCookie, getRequestHeader } = await import("@tanstack/react-start/server");

    return {
      cookie: getCookie(LOCALE_COOKIE_NAME),
      acceptLanguage: getRequestHeader("accept-language"),
    };
  }

  return {
    cookie: readCookie(LOCALE_COOKIE_NAME),
    acceptLanguage: navigator.languages?.join(",") ?? navigator.language,
  };
}
