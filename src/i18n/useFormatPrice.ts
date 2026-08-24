import { useCallback } from "react";

import { useTranslation } from "react-i18next";

import { formatPrice, priceLocaleOf } from "./formatPrice";

/**
 * A price formatter bound to the current locale, for rendering a USD amount in a component.
 *
 * Takes its locale from the i18next instance rather than from `useLocale`, so a view that
 * renders a price needs the translation provider it already needs and nothing more — which
 * is also what lets the presentational `*View` components render under Storybook.
 */
export function useFormatPrice(): (amount: number) => string {
  const { i18n } = useTranslation();
  const locale = priceLocaleOf(i18n.language);

  return useCallback((amount: number) => formatPrice(amount, locale), [locale]);
}
