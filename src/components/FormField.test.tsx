import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { renderWithProviders } from "@/test-utils";
import { FormField } from "./FormField";

describe("FormField", () => {
  it("renders children", () => {
    renderWithProviders(
      <FormField>
        <input data-testid="inp" />
      </FormField>
    );
    expect(screen.getByTestId("inp")).toBeInTheDocument();
  });

  it("shows string error", () => {
    renderWithProviders(
      <FormField error="Required">
        <input />
      </FormField>
    );
    expect(screen.getByText("Required")).toBeInTheDocument();
  });

  it("shows FieldError message", () => {
    renderWithProviders(
      <FormField error={{ type: "required", message: "Must fill" }}>
        <input />
      </FormField>
    );
    expect(screen.getByText("Must fill")).toBeInTheDocument();
  });

  it("hides error when undefined", () => {
    renderWithProviders(
      <FormField>
        <input />
      </FormField>
    );
    expect(screen.queryByText(/.+/)).toBeNull();
  });
});
