import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { renderWithProviders } from "@/test-utils";
import { FormField } from "./FormField";

describe("FormField", () => {
  it("renders children", () => {
    renderWithProviders(
      <FormField name="x">
        <input data-testid="inp" />
      </FormField>
    );
    expect(screen.getByTestId("inp")).toBeInTheDocument();
  });

  it("renders label linked to input", () => {
    renderWithProviders(
      <FormField name="price" label="Price">
        <input id="price" />
      </FormField>
    );
    expect(screen.getByText("Price")).toBeInTheDocument();
  });

  it("shows string error", () => {
    renderWithProviders(
      <FormField name="x" error="Required">
        <input />
      </FormField>
    );
    expect(screen.getByText("Required")).toBeInTheDocument();
  });

  it("shows FieldError message", () => {
    renderWithProviders(
      <FormField name="x" error={{ type: "required", message: "Must fill" }}>
        <input />
      </FormField>
    );
    expect(screen.getByText("Must fill")).toBeInTheDocument();
  });

  it("hides error when undefined", () => {
    renderWithProviders(
      <FormField name="x">
        <input />
      </FormField>
    );
    expect(screen.queryByText(/.+/)).toBeNull();
  });
});
