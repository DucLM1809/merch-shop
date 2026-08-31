import { describe, it, expect } from "vitest";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import enUSAccount from "@/i18n/locales/en-US/account.json";
import { renderRoute } from "../../../test-utils";
import { server } from "../../../mocks/server";
import { envelope } from "../../../mocks/handlers";
import { BASE_URL } from "../../../api/client";
import { adminAccount, buyerAccount, mockSignedIn } from "../../../mocks/fixtures";

describe("GlobalNav auth state", () => {
  it("shows sign-in and sign-up links when guest", async () => {
    renderRoute("/");

    expect(await screen.findByTestId("nav-guest-links")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /sign up/i })).toBeInTheDocument();
    expect(screen.queryByTestId("nav-account-menu")).not.toBeInTheDocument();
  });

  it("shows account menu and hides guest links when signed in", async () => {
    mockSignedIn(buyerAccount);

    renderRoute("/");

    const accountMenu = await screen.findByTestId("nav-account-menu");

    // The bar shows the address's local part, not the whole thing — at nav width the full
    // address truncated mid-domain ("admin.test@merch…"), which identified nobody. The
    // complete address stays on the chip itself, and the drawer still prints it in full.
    const [handle = buyerAccount.email] = buyerAccount.email.split("@");
    expect(within(accountMenu).getByText(handle)).toBeInTheDocument();
    expect(accountMenu).toHaveAttribute("title", buyerAccount.email);

    expect(screen.queryByTestId("nav-guest-links")).not.toBeInTheDocument();
  });
});

describe("/sign-in route", () => {
  it("renders the sign-in form", async () => {
    renderRoute("/sign-in");

    expect(await screen.findByRole("heading", { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  // The auth pages are a full-viewport takeover: the brand panel beside the form carries
  // its own mark back to the shop and its own preferences shelf, so the storefront bar
  // would be a second set of chrome competing with the page's one action.
  it("hides the global nav so the takeover owns the viewport", async () => {
    renderRoute("/sign-in");

    await screen.findByRole("heading", { name: /sign in/i });

    expect(screen.queryByTestId("nav-guest-links")).not.toBeInTheDocument();
    expect(screen.queryByTestId("mobile-menu-button")).not.toBeInTheDocument();
  });

  it("offers a route to registration, which the hidden nav no longer provides", async () => {
    renderRoute("/sign-in");

    await screen.findByRole("heading", { name: /sign in/i });

    expect(screen.getByRole("link", { name: enUSAccount.signIn.signUpLink })).toHaveAttribute(
      "href",
      "/en-US/sign-up"
    );
  });

  it("signs in and redirects to / on valid credentials", async () => {
    const user = userEvent.setup();
    const { router } = renderRoute("/sign-in");

    await screen.findByRole("heading", { name: /sign in/i });
    await user.type(screen.getByLabelText(/email/i), "buyer@test.com");
    await user.type(screen.getByLabelText(/password/i), "correct-horse-battery-staple");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/en-US");
    });
  });

  it("signs in and redirects to /admin for an admin account", async () => {
    server.use(http.get(`${BASE_URL}/account/me`, () => HttpResponse.json(envelope(adminAccount))));
    const user = userEvent.setup();
    const { router } = renderRoute("/sign-in");

    await screen.findByRole("heading", { name: /sign in/i });
    await user.type(screen.getByLabelText(/email/i), "admin@test.com");
    await user.type(screen.getByLabelText(/password/i), "correct-horse-battery-staple");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/en-US/admin");
    });
  });

  it("redirects to / when already signed in", async () => {
    mockSignedIn(buyerAccount);

    const { router } = renderRoute("/sign-in");

    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/en-US");
    });
  });

  it("signs in and redirects back to the ?redirect target on valid credentials", async () => {
    const user = userEvent.setup();
    const { router } = renderRoute("/sign-in?redirect=%2Fen-US%2Faccount%2Forders");

    await screen.findByRole("heading", { name: /sign in/i });
    await user.type(screen.getByLabelText(/email/i), "buyer@test.com");
    await user.type(screen.getByLabelText(/password/i), "correct-horse-battery-staple");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/en-US/account/orders");
    });
  });

  it("shows the sign-in failure message on invalid credentials", async () => {
    server.use(http.post(`${BASE_URL}/auth/login`, () => new HttpResponse(null, { status: 401 })));
    const user = userEvent.setup();
    renderRoute("/sign-in");

    await screen.findByRole("heading", { name: /sign in/i });
    await user.type(screen.getByLabelText(/email/i), "buyer@test.com");
    await user.type(screen.getByLabelText(/password/i), "wrong-password");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(await screen.findByTestId("sign-in-error")).toHaveTextContent(enUSAccount.signIn.failed);
  });
});
