import { Outlet, createFileRoute } from "@tanstack/react-router";

// Layout route that gives every customer-facing and admin route a leading locale
// segment. It renders unconditionally for now — resolving an unsupported or missing
// locale (cookie → Accept-Language → default, plus the redirect) is merch-shop-giw.9.
export const Route = createFileRoute("/$locale")({
  component: LocaleLayout,
});

function LocaleLayout(): React.JSX.Element {
  return <Outlet />;
}
