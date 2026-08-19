import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderRoute } from "../../../test-utils";
import { VALID_TOKEN } from "../../../mocks/handlers";

describe("/verify-email route", () => {
  it("shows a success message for a valid token", async () => {
    renderRoute(`/verify-email?token=${VALID_TOKEN}`);

    expect(await screen.findByTestId("verify-email-success")).toBeInTheDocument();
  });

  it("shows an error message for an invalid token", async () => {
    renderRoute("/verify-email?token=bad-token");

    expect(await screen.findByTestId("verify-email-error")).toBeInTheDocument();
  });
});
