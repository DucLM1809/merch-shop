import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import { DEFAULT_LOCALE } from "./locales";
import { NAMESPACES, resources } from "./resources";

import type { i18n } from "i18next";

import type { SupportedLocale } from "./locales";

const instances = new Map<SupportedLocale, i18n>();

/**
 * The i18next instance for a locale — created on first use, then reused.
 *
 * One instance *per locale* rather than per request: each instance's language is fixed at
 * creation and never changed, so two concurrent SSR requests for different locales get
 * two different instances and neither can observe the other's language. Switching locale
 * in the browser is a navigation to a different `/$locale` prefix, which swaps instances
 * instead of mutating one.
 *
 * Resources are bundled, so `init` settles on the spot — the first render already has
 * translations and there is no flash of raw keys.
 */
export function getI18n(locale: SupportedLocale): i18n {
  const existing = instances.get(locale);
  if (existing) return existing;

  const instance = i18next.createInstance();

  void instance.use(initReactI18next).init({
    lng: locale,
    fallbackLng: DEFAULT_LOCALE,
    ns: NAMESPACES,
    defaultNS: "common",
    resources,
    interpolation: {
      // React escapes interpolated values already; letting i18next escape too would
      // double-encode apostrophes and accents in the French copy.
      escapeValue: false,
    },
    // Resources are already in memory; finish init on this tick so the very first render
    // can translate.
    initAsync: false,
  });

  instances.set(locale, instance);

  return instance;
}
