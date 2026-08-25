import { http, HttpResponse } from "msw";
import { screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import { NavDrawerContent } from "@/components/NavDrawerContent";
import { BASE_URL } from "@/api/client";
import { SUPPORTED_LOCALES } from "@/i18n/locales";
import enUSAccount from "@/i18n/locales/en-US/account.json";
import enUSCart from "@/i18n/locales/en-US/cart.json";
import enUSCheckout from "@/i18n/locales/en-US/checkout.json";
import { GamePage, PublisherPage } from "@/modules/catalog";
import { SignInForm, VerifyEmailView } from "@/modules/account";
import { CartPage } from "@/modules/cart";
import { OrderConfirmationPage } from "@/modules/orders";
import { VALID_TOKEN, envelope, mockOrders } from "@/mocks/handlers";
import { adminAccount, buyerAccount, mockSignedIn } from "@/mocks/fixtures";
import { server } from "@/mocks/server";
import { renderRoute, renderWithProviders } from "@/test-utils";

/**
 * Every internal link, everywhere in the app, is built through a `to`/`params` pair against
 * a locale-prefixed route id (see PublisherNav.test.tsx for why the compiler alone can't
 * catch a slip here: the route id is cast past TanStack Router's typed generics on the way
 * to `Link`). This sweeps the rendered DOM of the app's main pages and fails if any internal
 * `<a>` it finds doesn't carry a supported locale segment as its first path component.
 *
 * A page reached through `renderRoute` (a real, matched `/$locale/...` route) is the wrong
 * tool to catch a `Link` that forgot to pass `locale` in its own `params`: TanStack Router
 * fills a missing param in from the *currently active* match when the target route shares
 * that param name, and every route here shares `locale` with its `/$locale` ancestor — so a
 * `Link` missing `locale` still resolves to the right href purely by inheriting the one the
 * current page is already on. That's exactly the class of bug this guard exists for (the
 * catalog sidebar's pre-fix code, restored locally, still renders correctly-prefixed hrefs
 * under `renderRoute`) — so components that build their own `to`/`params` pair are rendered
 * here with `renderWithProviders` instead, outside of any matched route, where a missing
 * `locale` has nothing to inherit and shows up as a broken href instead of a masked one.
 * Pages with no such extracted, props-driven component (home, the account/admin route
 * files below) still go through `renderRoute` — real coverage for a wrong route id or a
 * stray raw `<a>`, just not for this specific inheritance-masked case.
 */
const LOCALE_PREFIX_PATTERN = new RegExp(`^/(${SUPPORTED_LOCALES.join("|")})(?:/|$|\\?)`);

/**
 * Hrefs that are allowed to skip the locale prefix. Empty today — every internal link in
 * this app goes through a locale-aware `to`/`params` pair. Add an entry here, with a comment
 * explaining why, the day a deliberately unprefixed internal link ships (a redirect entry
 * point, say) — never loosen the pattern above to let a whole class of hrefs through instead.
 */
const EXEMPT_HREFS: readonly string[] = [];

function assertRenderedInternalLinksAreLocalePrefixed(): void {
  const anchors = Array.from(document.body.querySelectorAll<HTMLAnchorElement>("a[href]"));
  const internalHrefs = anchors
    .map((a) => a.getAttribute("href")!)
    // Internal = same-origin path. External links, `mailto:`/`tel:`, and fragment-only
    // anchors don't carry a locale segment by nature and aren't this guard's concern.
    .filter((href) => href.startsWith("/"));

  // A page that rendered zero internal links means the sweep found nothing to check —
  // almost certainly the readiness wait below returned before the real content mounted.
  expect(internalHrefs.length).toBeGreaterThan(0);

  for (const href of internalHrefs) {
    if (EXEMPT_HREFS.includes(href)) continue;
    expect(href, `internal link is missing its locale prefix: ${href}`).toMatch(
      LOCALE_PREFIX_PATTERN
    );
  }
}

describe("locale link guard", () => {
  it("catalog home", async () => {
    renderRoute("/");
    await screen.findByText("Faker Jersey");
    // Also waits out the guest/signed-in branch race in GlobalNav, which renders on
    // every page — checking it once here covers it everywhere else too.
    await screen.findByTestId("nav-guest-links");

    assertRenderedInternalLinksAreLocalePrefixed();
  });

  // Rendered directly rather than through a click on GlobalNav's menu button — matches
  // NavDrawerContent.test.tsx's own approach, and sidesteps the drawer's focus-trap effect
  // hanging when driven through a full RouterProvider tree + userEvent click in this suite.
  it("mobile nav drawer", async () => {
    renderWithProviders(
      <NavDrawerContent
        itemCount={0}
        isLoaded={true}
        isSignedIn={false}
        onClose={vi.fn()}
        onSignOut={vi.fn()}
      />
    );
    await screen.findByTestId("drawer-guest-links");

    assertRenderedInternalLinksAreLocalePrefixed();
  });

  it("publisher page", async () => {
    // The bug this guard exists for: PublisherNav's game/publisher links, loaded async.
    renderWithProviders(<PublisherPage publisherSlug="riot" />);
    await screen.findByRole("link", { name: "League of Legends" });

    assertRenderedInternalLinksAreLocalePrefixed();
  });

  it("game page", async () => {
    renderWithProviders(<GamePage publisherSlug="riot" gameSlug="league-of-legends" />);
    await screen.findByRole("link", { name: "League of Legends" });
    await screen.findByText("Faker Jersey");

    assertRenderedInternalLinksAreLocalePrefixed();
  });

  // No product detail page case: ProductDetailView renders no internal links of its own
  // (only GlobalNav's, already covered elsewhere) — nothing here for this guard to check.

  it("cart (empty)", async () => {
    renderWithProviders(<CartPage />);
    await screen.findByRole("link", { name: enUSCart.empty.continueShopping });

    assertRenderedInternalLinksAreLocalePrefixed();
  });

  it("sign-in", async () => {
    renderWithProviders(<SignInForm />);
    await screen.findByRole("link", { name: enUSAccount.signIn.forgotPassword });

    assertRenderedInternalLinksAreLocalePrefixed();
  });

  it("verify-email (accepted token)", async () => {
    renderWithProviders(<VerifyEmailView token={VALID_TOKEN} />);
    await screen.findByTestId("verify-email-success");

    assertRenderedInternalLinksAreLocalePrefixed();
  });

  it("order confirmation", async () => {
    renderWithProviders(
      <OrderConfirmationPage orderId={mockOrders[0].id} status={mockOrders[0].status} items={[]} />
    );
    await screen.findByRole("heading", { name: enUSCheckout.confirmation.title });

    assertRenderedInternalLinksAreLocalePrefixed();
  });

  it("account orders history", async () => {
    mockSignedIn(buyerAccount);
    server.use(
      http.get(`${BASE_URL}/orders/mine`, () => HttpResponse.json(envelope([mockOrders[0]])))
    );

    renderRoute("/account/orders");
    await screen.findByTestId(`order-row-${mockOrders[0].id}`);

    assertRenderedInternalLinksAreLocalePrefixed();
  });

  it("account order detail", async () => {
    mockSignedIn(buyerAccount);

    renderRoute(`/account/orders/${mockOrders[0].id}`);
    await screen.findByTestId("order-status");

    assertRenderedInternalLinksAreLocalePrefixed();
  });

  it("admin orders", async () => {
    mockSignedIn(adminAccount);

    renderRoute("/admin/orders");
    // AdminLayout's sidebar nav — not itself gated on the admin.orders data loading.
    await screen.findByRole("link", { name: "Orders" });

    assertRenderedInternalLinksAreLocalePrefixed();
  });
});
