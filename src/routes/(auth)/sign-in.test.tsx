import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { renderRoute } from "../../test-utils";

import { useAuth, useUser } from "@clerk/react";
import {
  fakerUser,
  AUTH_SIGNED_OUT,
  AUTH_SIGNED_IN,
  USER_SIGNED_OUT,
  userCtx,
} from "../../mocks/fixtures";

const mockUseAuth = vi.mocked(useAuth);
const mockUseUser = vi.mocked(useUser);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GlobalNav auth state", () => {
  it("shows sign-in and sign-up links when guest", async () => {
    mockUseAuth.mockReturnValue(AUTH_SIGNED_OUT);
    mockUseUser.mockReturnValue(USER_SIGNED_OUT);

    renderRoute("/");

    expect(await screen.findByTestId("nav-guest-links")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /sign up/i })).toBeInTheDocument();
    expect(screen.queryByTestId("nav-account-menu")).not.toBeInTheDocument();
  });

  it("shows account menu and hides guest links when signed in", async () => {
    mockUseAuth.mockReturnValue(AUTH_SIGNED_IN);
    mockUseUser.mockReturnValue(userCtx(fakerUser));

    renderRoute("/");

    expect(await screen.findByTestId("nav-account-menu")).toBeInTheDocument();
    expect(screen.getByText("Faker")).toBeInTheDocument();
    expect(screen.queryByTestId("nav-guest-links")).not.toBeInTheDocument();
  });
});

describe("/sign-in route", () => {
  it("renders Clerk SignIn component", async () => {
    mockUseAuth.mockReturnValue(AUTH_SIGNED_OUT);
    mockUseUser.mockReturnValue(USER_SIGNED_OUT);

    renderRoute("/sign-in");

    expect(await screen.findByTestId("clerk-sign-in")).toBeInTheDocument();
  });

  it("passes fallbackRedirectUrl=/ to SignIn", async () => {
    mockUseAuth.mockReturnValue(AUTH_SIGNED_OUT);
    mockUseUser.mockReturnValue(USER_SIGNED_OUT);

    renderRoute("/sign-in");

    expect(await screen.findByTestId("clerk-sign-in")).toHaveAttribute("data-redirect-url", "/");
  });

  it("redirects to / when already signed in", async () => {
    mockUseAuth.mockReturnValue(AUTH_SIGNED_IN);
    mockUseUser.mockReturnValue(userCtx(fakerUser));

    const { router } = renderRoute("/sign-in");

    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/");
    });
  });
});

describe("/sign-up route", () => {
  it("renders Clerk SignUp component", async () => {
    mockUseAuth.mockReturnValue(AUTH_SIGNED_OUT);
    mockUseUser.mockReturnValue(USER_SIGNED_OUT);

    renderRoute("/sign-up");

    expect(await screen.findByTestId("clerk-sign-up")).toBeInTheDocument();
  });

  it("passes fallbackRedirectUrl=/ to SignUp", async () => {
    mockUseAuth.mockReturnValue(AUTH_SIGNED_OUT);
    mockUseUser.mockReturnValue(USER_SIGNED_OUT);

    renderRoute("/sign-up");

    expect(await screen.findByTestId("clerk-sign-up")).toHaveAttribute("data-redirect-url", "/");
  });

  it("redirects to / when already signed in", async () => {
    mockUseAuth.mockReturnValue(AUTH_SIGNED_IN);
    mockUseUser.mockReturnValue(userCtx(fakerUser));

    const { router } = renderRoute("/sign-up");

    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/");
    });
  });
});
