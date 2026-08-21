import { DEFAULT_LOCALE, SUPPORTED_LOCALES, isSupportedLocale } from "./locales";

import type { SupportedLocale } from "./locales";

/** What a locale can be inferred from when the URL itself doesn't carry one. */
export type LocaleHints = {
  cookie?: string;
  acceptLanguage?: string;
};

const TAG_SHAPED = /^[a-z]{2}(-[a-z]{2})?$/i;

function languageOf(tag: string): string {
  return (tag.split("-")[0] ?? "").toLowerCase();
}

const SUPPORTED_LANGUAGES = new Set(SUPPORTED_LOCALES.map(languageOf));

/** `en-us` and `EN-US` are the same tag as `en-US`; extra subtags don't participate. */
function normalizeTag(tag: string): string {
  const [language, region] = tag.trim().split("-");
  const lower = (language ?? "").toLowerCase();

  return region ? `${lower}-${region.toUpperCase()}` : lower;
}

/** The supported locale a single tag asks for — exact match first, then same-language. */
function matchLocale(tag: string | undefined): SupportedLocale | undefined {
  if (!tag) return undefined;

  const normalized = normalizeTag(tag);
  if (isSupportedLocale(normalized)) return normalized;

  const language = languageOf(normalized);

  return SUPPORTED_LOCALES.find((locale) => languageOf(locale) === language);
}

/** Tags from an `Accept-Language` header, most preferred first. */
export function parseAcceptLanguage(header: string | undefined): string[] {
  if (!header) return [];

  return header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const quality = params.map((param) => param.trim()).find((param) => param.startsWith("q="));

      return {
        tag: (tag ?? "").trim(),
        quality: quality ? Number.parseFloat(quality.slice("q=".length)) : 1,
      };
    })
    .filter(({ tag, quality }) => tag !== "" && tag !== "*" && quality > 0)
    .sort((a, b) => b.quality - a.quality)
    .map(({ tag }) => tag);
}

/**
 * The locale a request should be served in: cookie, then `Accept-Language`, then the
 * default. The URL segment isn't consulted — this only runs once it has already turned
 * out to be missing or unsupported.
 */
export function resolveLocale({ cookie, acceptLanguage }: LocaleHints): SupportedLocale {
  const fromCookie = matchLocale(cookie);
  if (fromCookie) return fromCookie;

  for (const tag of parseAcceptLanguage(acceptLanguage)) {
    const fromHeader = matchLocale(tag);
    if (fromHeader) return fromHeader;
  }

  return DEFAULT_LOCALE;
}

/**
 * Whether a first path segment was *meant* to be a locale, as opposed to being the start
 * of a path given without a prefix. Publisher slugs share the shape of a bare language
 * tag (`/ea/...`), so a two-letter segment only counts when it's a language we ship.
 */
export function isLocaleSegment(segment: string): boolean {
  if (!TAG_SHAPED.test(segment)) return false;
  if (segment.includes("-")) return true;

  return SUPPORTED_LANGUAGES.has(segment.toLowerCase());
}

/**
 * The same logical page under `locale` — replacing the leading segment when it was an
 * unsupported locale, prefixing when the path had none.
 */
export function withLocalePrefix(pathname: string, locale: SupportedLocale): string {
  const segments = pathname.split("/").filter((segment) => segment !== "");
  const rest = isLocaleSegment(segments[0] ?? "") ? segments.slice(1) : segments;

  return `/${[locale, ...rest].join("/")}`;
}
