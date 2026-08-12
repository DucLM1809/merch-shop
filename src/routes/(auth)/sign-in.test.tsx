import { describe, it, expect } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderRoute } from "../../test-utils";
import { buyerAccount, mockSignedIn } from "../../mocks/fixtures";

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

    expect(await screen.findByTestId("nav-account-menu")).toBeInTheDocument();
    expect(screen.getByText(buyerAccount.email)).toBeInTheDocument();
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

  it("signs in and redirects to / on valid credentials", async () => {
    const user = userEvent.setup();
    const { router } = renderRoute("/sign-in");

    await screen.findByRole("heading", { name: /sign in/i });
    await user.type(screen.getByLabelText(/email/i), "buyer@test.com");
    await user.type(screen.getByLabelText(/password/i), "correct-horse-battery-staple");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/");
    });
  });

  it("redirects to / when already signed in", async () => {
    mockSignedIn(buyerAccount);

    const { router } = renderRoute("/sign-in");

    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/");
    });
  });
});
