import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { SUPPORTED_LOCALES } from "@/i18n/locales";
import { renderRoute } from "@/test-utils";

describe("/$locale route tree", () => {
  it.each(SUPPORTED_LOCALES)("renders the cart route under /%s", async (locale) => {
    const { router } = renderRoute(`/${locale}/cart`);

    await screen.findByText(/your cart is empty/i);
    expect(router.state.location.pathname).toBe(`/${locale}/cart`);
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

  it("keeps the search string when a path is given without a locale prefix", async () => {
    const { router } = renderRoute("/?team=t1");

    await screen.findByRole("navigation");
    expect(router.state.location.pathname).toBe("/en-US");
    expect(router.state.location.search).toMatchObject({ team: "t1" });
  });
});
