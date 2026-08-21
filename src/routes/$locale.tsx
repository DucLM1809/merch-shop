import { Outlet, createFileRoute } from "@tanstack/react-router";

import { redirectToResolvedLocale } from "@/i18n/localeRedirect";
import { isSupportedLocale } from "@/i18n/locales";

// Layout route that gives every customer-facing and admin route a leading locale segment.
// A segment we don't serve is indistinguishable from a path given without a prefix at all
// (`/cart` matches here with locale `cart`), so both resolve a locale and redirect.
export const Route = createFileRoute("/$locale")({
  beforeLoad: ({ params, location }) => {
    if (isSupportedLocale(params.locale)) return;

    return redirectToResolvedLocale(location);
  },
  component: LocaleLayout,
});

function LocaleLayout(): React.JSX.Element {
  return <Outlet />;
}
