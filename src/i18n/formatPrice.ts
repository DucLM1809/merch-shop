import { DEFAULT_LOCALE, isSupportedLocale } from "./locales";

import type { SupportedLocale } from "./locales";

/**
 * Every price in the API is a plain `number` with no currency field beside it, and every
 * one of them is US dollars. Phase 1 formats that amount per locale but does not convert
 * it, so a French visitor sees `59,99 $US` — the same money, spelled the way their locale
 * spells money. Real conversion waits on the backend growing a currency field (ADR-0017).
 */
export const PRICE_CURRENCY = "USD";

// `Intl.NumberFormat` construction is the expensive part, not `format` — and there are only
// ever as many formatters as supported locales, so they're built once and kept.
const formatters = new Map<SupportedLocale, Intl.NumberFormat>();

function formatterFor(locale: SupportedLocale): Intl.NumberFormat {
  const existing = formatters.get(locale);
  if (existing) return existing;

  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: PRICE_CURRENCY,
  });

  formatters.set(locale, formatter);

  return formatter;
}

/** A USD amount, formatted the way `locale` writes currency. */
export function formatPrice(amount: number, locale: SupportedLocale): string {
  return formatterFor(locale).format(amount);
}

/**
 * The locale to format prices in, given the language an i18next instance settled on.
 *
 * Prices are formatted against the same instance that produced the surrounding copy rather
 * than against the URL, so a price can never disagree with the words around it. i18next
 * hands back whatever language it resolved, including a fallback we don't serve, so an
 * unsupported value lands on the default locale instead of reaching `Intl`.
 */
export function priceLocaleOf(language: string): SupportedLocale {
  return isSupportedLocale(language) ? language : DEFAULT_LOCALE;
}
