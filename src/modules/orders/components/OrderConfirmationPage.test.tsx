import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import enUSCheckout from "@/i18n/locales/en-US/checkout.json";
import { priceText, renderWithProviders } from "@/test-utils";

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
    // line total + grand total both 59.99
    expect(screen.getAllByText(priceText(59.99, "en-US"))).toHaveLength(2);
  });

  it("single item: total equals price × quantity", () => {
    renderWithProviders(<OrderConfirmationPage orderId="ORD-123" items={singleItem} />);
    const totals = screen.getAllByText(priceText(59.99, "en-US"));
    expect(totals.length).toBeGreaterThanOrEqual(1);
  });

  it("multi-item: renders all items and correct total", () => {
    renderWithProviders(<OrderConfirmationPage orderId="ORD-456" items={multiItems} />);
    // both variants visible
    expect(screen.getByText(/S \/ Black/)).toBeInTheDocument();
    expect(screen.getByText(/M \/ White/)).toBeInTheDocument();
    // 59.99×1 + 62.99×2 = 185.97
    expect(screen.getByText(priceText(185.97, "en-US"))).toBeInTheDocument();
  });

  it("quantity > 1: line total = price × quantity", () => {
    renderWithProviders(<OrderConfirmationPage orderId="ORD-789" items={multiItems} />);
    // 62.99 × 2 = 125.98
    expect(screen.getByText(priceText(125.98, "en-US"))).toBeInTheDocument();
  });

  it("empty items: total shows a zero amount", () => {
    renderWithProviders(<OrderConfirmationPage orderId="ORD-000" items={[]} />);
    expect(screen.getByText(priceText(0, "en-US"))).toBeInTheDocument();
  });

  it("has Continue Shopping link", () => {
    renderWithProviders(<OrderConfirmationPage orderId="ORD-123" items={singleItem} />);
    expect(
      screen.getByRole("link", { name: enUSCheckout.confirmation.continueShopping })
    ).toBeInTheDocument();
  });

  it("no orderId: shows generic confirmation message instead", () => {
    renderWithProviders(<OrderConfirmationPage items={singleItem} />);
    expect(screen.getByText(enUSCheckout.confirmation.emailSoon)).toBeInTheDocument();
  });

  it("no orderId but still resolving: says so instead of promising an email", () => {
    renderWithProviders(<OrderConfirmationPage isResolving items={singleItem} />);
    expect(screen.getByText(enUSCheckout.confirmation.resolving)).toBeInTheDocument();
    expect(screen.queryByText(enUSCheckout.confirmation.emailSoon)).not.toBeInTheDocument();
  });
});
