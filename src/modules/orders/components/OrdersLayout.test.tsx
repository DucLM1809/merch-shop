import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { renderWithProviders } from "@/test-utils";
import { OrdersLayout } from "./OrdersLayout";

describe("OrdersLayout", () => {
  it("renders its children", () => {
    renderWithProviders(
      <OrdersLayout>
        <div data-testid="content">Hello</div>
      </OrdersLayout>
    );
    expect(screen.getByTestId("content")).toBeInTheDocument();
  });
});
