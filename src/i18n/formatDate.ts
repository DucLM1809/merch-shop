import { DEFAULT_LOCALE, isSupportedLocale } from "./locales";

import type { SupportedLocale } from "./locales";

// `Intl.DateTimeFormat` construction is the expensive part, not `format` — and there are only
// ever as many formatters as supported locales, so they're built once and kept.
const formatters = new Map<SupportedLocale, Intl.DateTimeFormat>();

function formatterFor(locale: SupportedLocale): Intl.DateTimeFormat {
  const existing = formatters.get(locale);
  if (existing) return existing;

  // `medium` spells the month out. A numeric date is genuinely ambiguous across these
  // locales — 01/02 is January 2nd to a US reader and February 1st to a British or French
  // one — and an order date is something a buyer may need to read exactly.
  const formatter = new Intl.DateTimeFormat(locale, { dateStyle: "medium" });

  formatters.set(locale, formatter);

  return formatter;
}

/** An ISO timestamp, written the way `locale` writes a date. */
export function formatDate(iso: string, locale: SupportedLocale): string {
  return formatterFor(locale).format(new Date(iso));
}

/**
 * The locale to format dates in, given the language an i18next instance settled on.
 *
 * Same reasoning as `priceLocaleOf`: a date is formatted against the instance that produced
 * the surrounding copy, so it can never disagree with the words around it, and a fallback
 * language we don't serve lands on the default locale instead of reaching `Intl`.
 */
export function dateLocaleOf(language: string): SupportedLocale {
  return isSupportedLocale(language) ? language : DEFAULT_LOCALE;
}
