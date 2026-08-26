import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { expectNoA11yViolations, renderWithProviders } from "@/test-utils";
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

  it("has no axe violations", async () => {
    const { container } = renderWithProviders(
      <FormField name="price" label="Price" error="Required">
        <input id="price" />
      </FormField>
    );
    await expectNoA11yViolations(container);
  });

  it("marks the label as required when required", () => {
    const { container } = renderWithProviders(
      <FormField name="price" label="Price" required>
        <input id="price" />
      </FormField>
    );
    expect(container.querySelector('label[data-required="true"]')).not.toBeNull();
  });

  it("does not mark the label as required by default", () => {
    const { container } = renderWithProviders(
      <FormField name="price" label="Price">
        <input id="price" />
      </FormField>
    );
    expect(container.querySelector("label")?.getAttribute("data-required")).toBeNull();
  });

  it("does not change the label's accessible name when required", () => {
    renderWithProviders(
      <FormField name="price" label="Price" required>
        <input id="price" />
      </FormField>
    );
    expect(screen.getByLabelText("Price")).toBeInTheDocument();
  });

  it("has no axe violations when required", async () => {
    const { container } = renderWithProviders(
      <FormField name="price" label="Price" required>
        <input id="price" />
      </FormField>
    );
    await expectNoA11yViolations(container);
  });
});
