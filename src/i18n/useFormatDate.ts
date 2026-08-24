import { useCallback } from "react";

import { useTranslation } from "react-i18next";

import { dateLocaleOf, formatDate } from "./formatDate";

/**
 * A date formatter bound to the current locale, for rendering an ISO timestamp.
 *
 * Mirrors `useFormatPrice`: it takes its locale from the i18next instance rather than from
 * `useLocale`, so a view that renders a date needs the translation provider it already needs
 * and nothing more.
 */
export function useFormatDate(): (iso: string) => string {
  const { i18n } = useTranslation();
  const locale = dateLocaleOf(i18n.language);

  return useCallback((iso: string) => formatDate(iso, locale), [locale]);
}
