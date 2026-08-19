/** Locales the storefront renders in. Adding one is a deliberate, tracked change. */
export const SUPPORTED_LOCALES = ["en-US", "en-GB", "fr-FR"] as const;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

/** Fallback locale, and the source of truth for translation-key types and parity checks. */
export const DEFAULT_LOCALE: SupportedLocale = "en-US";

export function isSupportedLocale(value: string): value is SupportedLocale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value);
}
