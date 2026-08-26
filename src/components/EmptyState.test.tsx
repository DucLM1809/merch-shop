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

  it("renders action children below the title", () => {
    renderWithProviders(
      <EmptyState title="No results">
        <button type="button">Clear filters</button>
      </EmptyState>
    );
    expect(screen.getByRole("button", { name: "Clear filters" })).toBeInTheDocument();
  });

  it("applies size-specific styles to the root element", () => {
    const { container: mdContainer } = renderWithProviders(<EmptyState title="No results" />);
    const { container: smContainer } = renderWithProviders(
      <EmptyState title="No results" size="sm" />
    );

    const mdRoot = mdContainer.querySelector(".chakra-empty-state__root");
    const smRoot = smContainer.querySelector(".chakra-empty-state__root");

    expect(mdRoot?.className).not.toEqual(smRoot?.className);
  });

  it("has no axe violations", async () => {
    const { container } = renderWithProviders(
      <EmptyState title="No results" description="Try a different filter." />
    );
    await expectNoA11yViolations(container);
  });
});
