import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import { useAuth, useUser } from "@clerk/react";
import { renderRoute, expectNoA11yViolations } from "../test-utils";
import { AUTH_SIGNED_OUT, USER_SIGNED_OUT } from "../mocks/fixtures";

const mockUseAuth = vi.mocked(useAuth);
const mockUseUser = vi.mocked(useUser);

describe("GlobalNav", () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue(AUTH_SIGNED_OUT);
    mockUseUser.mockReturnValue(USER_SIGNED_OUT);
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
});
