import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { expectNoA11yViolations, renderWithProviders } from "@/test-utils";
import { EmptyState } from "./EmptyState";

describe("EmptyState", () => {
  it("renders just a title when no description is given", () => {
    renderWithProviders(<EmptyState title="No results" />);
    expect(screen.getByText("No results")).toBeInTheDocument();
  });

  it("renders a description when given", () => {
    renderWithProviders(<EmptyState title="No results" description="Try a different filter." />);
    expect(screen.getByText("Try a different filter.")).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = renderWithProviders(
      <EmptyState title="No results" description="Try a different filter." />
    );
    await expectNoA11yViolations(container);
  });
});
