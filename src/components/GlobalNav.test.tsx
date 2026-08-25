import { act } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ChakraProvider } from "@chakra-ui/react";
import { RouterContextProvider, createMemoryHistory, createRouter } from "@tanstack/react-router";
import { screen, within } from "@testing-library/react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { I18nextProvider } from "react-i18next";
import { describe, it, expect, afterEach, vi } from "vitest";
import { getI18n } from "../i18n/i18n";
import { DEFAULT_LOCALE } from "../i18n/locales";
import enUS from "../i18n/locales/en-US/common.json";
import frFR from "../i18n/locales/fr-FR/common.json";
import { routeTree } from "../routeTree.gen";
import { clearCart, setItems } from "../store/cart";
import { renderRoute, expectNoA11yViolations } from "../test-utils";
import { system } from "../theme";
import { GlobalNav } from "./GlobalNav";

const seededItem = {
  skuId: "fj-s-black",
  productId: "1",
  productName: "Faker Jersey",
  variant: "S / Black",
  price: 59.99,
  quantity: 3,
};

/** A fresh GlobalNav tree, wrapped exactly like `renderWithProviders` — needed twice per
 * hydration test (once for the "server" pass, once for the "client" pass), so it can't
 * reuse a single rendered instance the way `renderWithProviders` does. */
function buildTree() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const router = createRouter({
    routeTree,
    context: { queryClient },
    history: createMemoryHistory(),
  });
  return (
    <RouterContextProvider router={router}>
      <I18nextProvider i18n={getI18n(DEFAULT_LOCALE)}>
        <ChakraProvider value={system}>
          <QueryClientProvider client={queryClient}>
            <GlobalNav />
          </QueryClientProvider>
        </ChakraProvider>
      </I18nextProvider>
    </RouterContextProvider>
  );
}

describe("GlobalNav", () => {
  afterEach(() => clearCart());

  it("shows the real cart count once mounted, even when the cart already had items on load", async () => {
    setItems([seededItem]);
    renderRoute("/en-US");
    const nav = await screen.findByRole("navigation");

    expect(
      within(nav).getByRole("link", {
        name: enUS.nav.cartItems_other.replace("{{count}}", "3"),
      })
    ).toBeInTheDocument();
  });

  it("hydrates cleanly when the cart already has items — the server always renders 0", async () => {
    clearCart();
    const serverHtml = renderToString(buildTree());

    // The real bug: by the time the client mounts, the guest cart module has already
    // read sessionStorage synchronously — the server never sees this, only the client.
    setItems([seededItem]);

    const container = document.createElement("div");
    container.innerHTML = serverHtml;
    document.body.appendChild(container);

    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    const hydrationErrors: unknown[] = [];
    const onHydrationError = (error: unknown) => hydrationErrors.push(error);

    try {
      await act(async () => {
        hydrateRoot(container, buildTree(), {
          onUncaughtError: onHydrationError,
          onCaughtError: onHydrationError,
          onRecoverableError: onHydrationError,
        });
      });
    } finally {
      consoleError.mockRestore();
      container.remove();
    }

    expect(hydrationErrors).toEqual([]);
  });

  it("renders the mobile menu hamburger button", async () => {
    renderRoute("/");
    expect(await screen.findByTestId("mobile-menu-button")).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    renderRoute("/");
    await screen.findByTestId("mobile-menu-button");
    await expectNoA11yViolations(screen.getByRole("navigation"));
  });

  it("renders its chrome in the language of the locale in the URL", async () => {
    const american = renderRoute("/en-US");
    const americanNav = await screen.findByRole("navigation");

    expect(within(americanNav).getByText(enUS.nav.cart)).toBeInTheDocument();
    expect(within(americanNav).getByText(enUS.nav.signIn)).toBeInTheDocument();
    american.unmount();

    renderRoute("/fr-FR");
    const french = await screen.findByRole("navigation");

    expect(within(french).getByText(frFR.nav.cart)).toBeInTheDocument();
    expect(within(french).getByText(frFR.nav.signIn)).toBeInTheDocument();
    expect(within(french).queryByText(enUS.nav.cart)).not.toBeInTheDocument();
  });

  it("names the cart link with the number of items it holds", async () => {
    renderRoute("/en-US");
    const nav = await screen.findByRole("navigation");

    expect(
      within(nav).getByRole("link", {
        name: enUS.nav.cartItems_other.replace("{{count}}", "0"),
      })
    ).toBeInTheDocument();
  });
});
