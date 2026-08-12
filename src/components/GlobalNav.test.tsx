import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
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
});
