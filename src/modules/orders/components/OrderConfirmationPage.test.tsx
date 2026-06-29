import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { renderWithProviders } from "@/test-utils";

import { OrderConfirmationPage } from "./OrderConfirmationPage";

const singleItem = [
  {
    skuId: "fj-s-black",
    productId: "1",
    productName: "Faker Jersey",
    variant: "S / Black",
    price: 59.99,
    quantity: 1,
  },
];

const multiItems = [
  {
    skuId: "fj-s-black",
    productId: "1",
    productName: "Faker Jersey",
    variant: "S / Black",
    price: 59.99,
    quantity: 1,
  },
  {
    skuId: "fj-m-white",
    productId: "1",
    productName: "Faker Jersey",
    variant: "M / White",
    price: 62.99,
    quantity: 2,
  },
];

describe("OrderConfirmationPage", () => {
  it("shows orderId", () => {
    renderWithProviders(<OrderConfirmationPage orderId="ORD-123" items={singleItem} />);
    expect(screen.getByText("ORD-123")).toBeInTheDocument();
  });

  it("single item: renders product name, variant, and correct line total", () => {
    renderWithProviders(<OrderConfirmationPage orderId="ORD-123" items={singleItem} />);
    expect(screen.getByText("Faker Jersey")).toBeInTheDocument();
    expect(screen.getByText(/S \/ Black/)).toBeInTheDocument();
    expect(screen.getAllByText("$59.99")).toHaveLength(2); // line total + grand total both $59.99
  });

  it("single item: total equals price × quantity", () => {
    renderWithProviders(<OrderConfirmationPage orderId="ORD-123" items={singleItem} />);
    // total row shows $59.99
    const totals = screen.getAllByText("$59.99");
    expect(totals.length).toBeGreaterThanOrEqual(1);
  });

  it("multi-item: renders all items and correct total", () => {
    renderWithProviders(<OrderConfirmationPage orderId="ORD-456" items={multiItems} />);
    // both variants visible
    expect(screen.getByText(/S \/ Black/)).toBeInTheDocument();
    expect(screen.getByText(/M \/ White/)).toBeInTheDocument();
    // 59.99×1 + 62.99×2 = 185.97
    expect(screen.getByText("$185.97")).toBeInTheDocument();
  });

  it("quantity > 1: line total = price × quantity", () => {
    renderWithProviders(<OrderConfirmationPage orderId="ORD-789" items={multiItems} />);
    // 62.99 × 2 = 125.98
    expect(screen.getByText("$125.98")).toBeInTheDocument();
  });

  it("empty items: total shows $0.00", () => {
    renderWithProviders(<OrderConfirmationPage orderId="ORD-000" items={[]} />);
    expect(screen.getByText("$0.00")).toBeInTheDocument();
  });

  it("has Continue Shopping link", () => {
    renderWithProviders(<OrderConfirmationPage orderId="ORD-123" items={singleItem} />);
    expect(screen.getByRole("link", { name: /continue shopping/i })).toBeInTheDocument();
  });
});
