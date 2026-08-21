import { screen, waitFor } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";

import { LOCALE_COOKIE_NAME } from "@/i18n/localeCookie";
import { SUPPORTED_LOCALES } from "@/i18n/locales";
import { renderRoute } from "@/test-utils";

function setLocaleCookie(value: string): void {
  document.cookie = `${LOCALE_COOKIE_NAME}=${value}`;
}

afterEach(() => {
  document.cookie = `${LOCALE_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
});

describe("/$locale route tree", () => {
  it.each(SUPPORTED_LOCALES)("renders the cart route under /%s", async (locale) => {
    const { router } = renderRoute(`/${locale}/cart`);

    await screen.findByText(/your cart is empty/i);
    expect(router.state.location.pathname).toBe(`/${locale}/cart`);
  });

  it.each(SUPPORTED_LOCALES)("declares the document language as %s", async (locale) => {
    renderRoute(`/${locale}/cart`);

    await screen.findByRole("navigation");
    expect(document.documentElement).toHaveAttribute("lang", locale);
  });

  it("renders the same content for a path given with and without a locale prefix", async () => {
    const prefixed = renderRoute("/en-US/cart");
    const prefixedText = (await screen.findByText(/your cart is empty/i)).textContent;
    prefixed.unmount();

    const bare = renderRoute("/cart");
    const bareText = (await screen.findByText(/your cart is empty/i)).textContent;

    expect(bareText).toBe(prefixedText);
    expect(bare.router.state.location.pathname).toBe("/en-US/cart");
  });

  it("redirects a locale segment it doesn't serve to a locale it does", async () => {
    const { router } = renderRoute("/de-DE/cart");

    await screen.findByText(/your cart is empty/i);
    expect(router.state.location.pathname).toBe("/en-US/cart");
  });

  it("redirects the bare root onto a locale", async () => {
    const { router } = renderRoute("/");

    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/en-US");
    });
  });

  it("keeps the search string when a path is given without a locale prefix", async () => {
    const { router } = renderRoute("/?team=t1");

    await screen.findByRole("navigation");
    expect(router.state.location.pathname).toBe("/en-US");
    expect(router.state.location.search).toMatchObject({ team: "t1" });
  });

  it("resolves an unprefixed path against the locale cookie", async () => {
    setLocaleCookie("fr-FR");

    const { router } = renderRoute("/cart");

    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/fr-FR/cart");
    });
  });

  it("lets the cookie override a locale segment it doesn't serve", async () => {
    setLocaleCookie("en-GB");

    const { router } = renderRoute("/de-DE/cart");

    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/en-GB/cart");
    });
  });
});
