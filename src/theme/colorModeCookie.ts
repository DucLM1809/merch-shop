/**
 * Cookie holding a visitor's explicitly chosen color mode.
 *
 * Resolved server-side before render, same as `../i18n/localeCookie.ts` and for the same
 * reason: the correct class needs to already be on the document the server sends, or the
 * page flashes from one mode to the other after hydration.
 */
export const COLOR_MODE_COOKIE_NAME = "colorMode";

/** A year — a display preference should outlive the session it was set in. */
const MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

/**
 * The raw cookie value, unvalidated. Callers decide what an unrecognized value means —
 * `resolveColorMode` treats it the same as no cookie at all.
 */
export function readColorModeCookie(): string | undefined {
  if (typeof document === "undefined") return undefined;

  const entry = document.cookie
    .split("; ")
    .find((part) => part.startsWith(`${COLOR_MODE_COOKIE_NAME}=`));

  return entry === undefined
    ? undefined
    : decodeURIComponent(entry.slice(COLOR_MODE_COOKIE_NAME.length + 1));
}

export function writeColorModeCookie(mode: string): void {
  if (typeof document === "undefined") return;

  document.cookie = `${COLOR_MODE_COOKIE_NAME}=${encodeURIComponent(mode)}; path=/; max-age=${MAX_AGE_SECONDS}; samesite=lax`;
}

/**
 * Clears the stored override. Unlike locale (which never has a "go back to unset" action),
 * picking "System" is a real, reachable state here, so it has to actively remove the
 * cookie rather than simply never writing one.
 */
export function clearColorModeCookie(): void {
  if (typeof document === "undefined") return;

  document.cookie = `${COLOR_MODE_COOKIE_NAME}=; path=/; max-age=0; samesite=lax`;
}
