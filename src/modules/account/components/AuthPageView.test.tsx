import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import enUSAccount from "@/i18n/locales/en-US/account.json";
import enUSCommon from "@/i18n/locales/en-US/common.json";
import { renderWithProviders } from "@/test-utils";
import { AuthPageView } from "./AuthPageView";

describe("AuthPageView", () => {
  it("renders children", () => {
    renderWithProviders(
      <AuthPageView>
        <div data-testid="child">Sign In</div>
      </AuthPageView>
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("renders multiple children", () => {
    renderWithProviders(
      <AuthPageView>
        <div data-testid="a">A</div>
        <div data-testid="b">B</div>
      </AuthPageView>
    );
    expect(screen.getByTestId("a")).toBeInTheDocument();
    expect(screen.getByTestId("b")).toBeInTheDocument();
  });

  it("renders the brand panel copy", () => {
    renderWithProviders(
      <AuthPageView>
        <div />
      </AuthPageView>
    );

    expect(screen.getByTestId("auth-panel-headline")).toHaveTextContent(enUSAccount.panel.headline);
    expect(screen.getByTestId("auth-panel-body")).toHaveTextContent(enUSAccount.panel.body);
  });

  // The takeover hides the global nav, so the panel's mark is the only route back to the
  // storefront from every auth page.
  it("links the brand mark back to the shop", () => {
    renderWithProviders(
      <AuthPageView>
        <div />
      </AuthPageView>
    );

    expect(screen.getByRole("link", { name: enUSCommon.brand })).toHaveAttribute(
      "href",
      "/en-US/shop"
    );
  });

  // Same reason: with the nav gone, this is the visitor's only access to language and
  // color mode while they are signing in.
  it("carries the preferences shelf the hidden nav would hold", () => {
    renderWithProviders(
      <AuthPageView>
        <div />
      </AuthPageView>
    );

    expect(screen.getByTestId("locale-switcher")).toBeInTheDocument();
    expect(screen.getByTestId("color-mode-toggle")).toBeInTheDocument();
  });
});
