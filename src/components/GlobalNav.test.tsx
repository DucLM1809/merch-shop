import { describe, it, expect } from "vitest";
import { screen, within } from "@testing-library/react";
import enUS from "../i18n/locales/en-US/common.json";
import frFR from "../i18n/locales/fr-FR/common.json";
import { renderRoute, expectNoA11yViolations } from "../test-utils";

describe("GlobalNav", () => {
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
