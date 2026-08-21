import { Store } from "@tanstack/react-store";

import { readLocaleCookie, writeLocaleCookie } from "../i18n/localeCookie";
import { isSupportedLocale } from "../i18n/locales";

import type { SupportedLocale } from "../i18n/locales";

type LocaleState = {
  /** The locale a Buyer explicitly chose, or `undefined` if they never have. */
  preferred: SupportedLocale | undefined;
};

function load(): LocaleState {
  const cookie = readLocaleCookie();

  // A tag we no longer serve — a locale that was dropped, or a hand-edited cookie — is
  // treated as no preference at all rather than kept around as a value nothing can use.
  return { preferred: cookie !== undefined && isSupportedLocale(cookie) ? cookie : undefined };
}

export const localeStore = new Store<LocaleState>(load());

// Mirrored to a cookie rather than to storage like the cart: the preference exists to
// decide which language a *bare* URL resolves to, and that decision is made on the server
// before render, so it has to travel with the next document request.
localeStore.subscribe(() => {
  const { preferred } = localeStore.state;

  if (preferred !== undefined) writeLocaleCookie(preferred);
});

export function setPreferredLocale(locale: SupportedLocale): void {
  localeStore.setState(() => ({ preferred: locale }));
}
