/**
 * Cookie holding a visitor's chosen locale.
 *
 * The URL is the source of truth for what language a page renders in; this only decides
 * where a *bare* URL lands, which is a decision made on the server before render. That's
 * why the preference is a cookie and not `sessionStorage` like the cart — it has to
 * travel with the next document request.
 */
export const LOCALE_COOKIE_NAME = "locale";

/** A year — a language preference should outlive the session it was set in. */
const MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

/**
 * The raw cookie value, unvalidated. Callers decide what to do with a tag we don't serve:
 * `resolveLocale` still tries to match it by language, so a hand-set `fr` finds `fr-FR`.
 */
export function readLocaleCookie(): string | undefined {
  if (typeof document === "undefined") return undefined;

  const entry = document.cookie
    .split("; ")
    .find((part) => part.startsWith(`${LOCALE_COOKIE_NAME}=`));

  return entry === undefined
    ? undefined
    : decodeURIComponent(entry.slice(LOCALE_COOKIE_NAME.length + 1));
}

export function writeLocaleCookie(locale: string): void {
  if (typeof document === "undefined") return;

  document.cookie = `${LOCALE_COOKIE_NAME}=${encodeURIComponent(locale)}; path=/; max-age=${MAX_AGE_SECONDS}; samesite=lax`;
}
