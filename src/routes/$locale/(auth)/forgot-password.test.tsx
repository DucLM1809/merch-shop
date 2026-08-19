import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderRoute } from "../../../test-utils";

describe("/forgot-password route", () => {
  it("renders the forgot-password form", async () => {
    renderRoute("/forgot-password");

    expect(await screen.findByRole("heading", { name: /forgot password/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it("shows a generic confirmation after submitting", async () => {
    const user = userEvent.setup();
    renderRoute("/forgot-password");

    await screen.findByRole("heading", { name: /forgot password/i });
    await user.type(screen.getByLabelText(/email/i), "buyer@test.com");
    await user.click(screen.getByRole("button", { name: /send reset link/i }));

    expect(await screen.findByTestId("forgot-password-success")).toBeInTheDocument();
  });
});
