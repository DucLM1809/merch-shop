import { describe, it, expect } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderRoute } from "../../../test-utils";
import { buyerAccount, mockSignedIn } from "../../../mocks/fixtures";

describe("/sign-up route", () => {
  it("renders the sign-up form", async () => {
    renderRoute("/sign-up");

    expect(await screen.findByRole("heading", { name: /sign up/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("registers, auto-signs-in, and redirects to / on valid input", async () => {
    const user = userEvent.setup();
    const { router } = renderRoute("/sign-up");

    await screen.findByRole("heading", { name: /sign up/i });
    await user.type(screen.getByLabelText(/email/i), "new-buyer@test.com");
    await user.type(screen.getByLabelText(/password/i), "correct-horse-battery-staple");
    await user.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/en-US");
    });
  });

  it("shows a validation error when the password is too short", async () => {
    const user = userEvent.setup();
    renderRoute("/sign-up");

    await screen.findByRole("heading", { name: /sign up/i });
    await user.type(screen.getByLabelText(/email/i), "short@test.com");
    await user.type(screen.getByLabelText(/password/i), "short");
    await user.click(screen.getByRole("button", { name: /sign up/i }));

    expect(await screen.findByText(/at least 12 characters/i)).toBeInTheDocument();
  });

  it("redirects to / when already signed in", async () => {
    mockSignedIn(buyerAccount);

    const { router } = renderRoute("/sign-up");

    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/en-US");
    });
  });
});
