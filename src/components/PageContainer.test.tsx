import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { renderWithProviders } from "@/test-utils";
import { PageContainer } from "./PageContainer";

describe("PageContainer", () => {
  it("renders its children", () => {
    renderWithProviders(
      <PageContainer>
        <div data-testid="content">Hello</div>
      </PageContainer>
    );
    expect(screen.getByTestId("content")).toBeInTheDocument();
  });

  it.each(["sm", "md", "lg"] as const)("accepts size=%s", (size) => {
    renderWithProviders(
      <PageContainer size={size}>
        <div data-testid="content">Hello</div>
      </PageContainer>
    );
    expect(screen.getByTestId("content")).toBeInTheDocument();
  });
});
