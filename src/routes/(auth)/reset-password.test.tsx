import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderRoute } from "../../test-utils";
import { VALID_TOKEN } from "../../mocks/handlers";

describe("/reset-password route", () => {
  it("renders the reset-password form", async () => {
    renderRoute(`/reset-password?token=${VALID_TOKEN}`);

    expect(await screen.findByRole("heading", { name: /reset password/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/new password/i)).toBeInTheDocument();
  });

  it("shows a success message on a valid token", async () => {
    const user = userEvent.setup();
    renderRoute(`/reset-password?token=${VALID_TOKEN}`);

    await screen.findByRole("heading", { name: /reset password/i });
    await user.type(screen.getByLabelText(/new password/i), "correct-horse-battery-staple");
    await user.click(screen.getByRole("button", { name: /reset password/i }));

    expect(await screen.findByTestId("reset-password-success")).toBeInTheDocument();
  });

  it("shows an error on an invalid token", async () => {
    const user = userEvent.setup();
    renderRoute("/reset-password?token=bad-token");

    await screen.findByRole("heading", { name: /reset password/i });
    await user.type(screen.getByLabelText(/new password/i), "correct-horse-battery-staple");
    await user.click(screen.getByRole("button", { name: /reset password/i }));

    expect(await screen.findByTestId("reset-password-error")).toBeInTheDocument();
  });
});
