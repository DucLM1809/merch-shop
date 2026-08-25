import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { expectNoA11yViolations, renderWithProviders } from "@/test-utils";
import { Badge } from "./Badge";

describe("Badge", () => {
  it("renders a count badge", () => {
    renderWithProviders(
      <Badge variant="count" tone="signal">
        3
      </Badge>
    );
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("renders a status badge", () => {
    renderWithProviders(
      <Badge variant="status" tone="success">
        Shipped
      </Badge>
    );
    expect(screen.getByText("Shipped")).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = renderWithProviders(
      <Badge variant="status" tone="danger">
        Cancelled
      </Badge>
    );
    await expectNoA11yViolations(container);
  });
});
