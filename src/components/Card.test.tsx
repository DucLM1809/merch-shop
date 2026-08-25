import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { expectNoA11yViolations, renderWithProviders } from "@/test-utils";
import { Card } from "./Card";

describe("Card", () => {
  it("renders its children", () => {
    renderWithProviders(<Card>Panel content</Card>);
    expect(screen.getByText("Panel content")).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = renderWithProviders(<Card interactive>Panel content</Card>);
    await expectNoA11yViolations(container);
  });
});
