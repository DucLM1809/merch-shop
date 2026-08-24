import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import enUSCart from "@/i18n/locales/en-US/cart.json";
import { priceText, renderWithProviders } from "@/test-utils";
import { CartView } from "./CartView";

const items = [
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

function itemCount(count: number): string {
  const template = count === 1 ? enUSCart.itemCount_one : enUSCart.itemCount_other;

  return template.replace("{{count}}", String(count));
}

describe("CartView", () => {
  it("shows empty state when no items", () => {
    renderWithProviders(<CartView items={[]} onUpdateQuantity={vi.fn()} onRemove={vi.fn()} />);
    expect(screen.getByText(enUSCart.empty.title)).toBeInTheDocument();
  });

  it("shows item count in heading", () => {
    renderWithProviders(<CartView items={items} onUpdateQuantity={vi.fn()} onRemove={vi.fn()} />);
    expect(screen.getByText(itemCount(2))).toBeInTheDocument();
  });

  it("renders all item names", () => {
    renderWithProviders(<CartView items={items} onUpdateQuantity={vi.fn()} onRemove={vi.fn()} />);
    const jerseyItems = screen.getAllByText("Faker Jersey");
    expect(jerseyItems).toHaveLength(2);
  });

  it("computes correct subtotal", () => {
    // 59.99×1 + 62.99×2 = 185.97
    renderWithProviders(<CartView items={items} onUpdateQuantity={vi.fn()} onRemove={vi.fn()} />);
    const subtotal = screen.getByTestId("cart-subtotal");

    expect(priceText(185.97, "en-US")(subtotal.textContent ?? "")).toBe(true);
  });

  it("calls onRemove with skuId when Remove clicked", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    renderWithProviders(
      <CartView items={[items[0]]} onUpdateQuantity={vi.fn()} onRemove={onRemove} />
    );
    await user.click(screen.getByRole("button", { name: enUSCart.item.remove }));
    expect(onRemove).toHaveBeenCalledWith("fj-s-black");
  });

  it("calls onUpdateQuantity with quantity - 1 when decrement clicked", async () => {
    const user = userEvent.setup();
    const onUpdateQuantity = vi.fn();
    renderWithProviders(
      <CartView items={[items[0]]} onUpdateQuantity={onUpdateQuantity} onRemove={vi.fn()} />
    );
    await user.click(screen.getByRole("button", { name: enUSCart.item.decreaseQuantity }));
    expect(onUpdateQuantity).toHaveBeenCalledWith("fj-s-black", 0);
  });

  it("calls onUpdateQuantity with quantity + 1 when increment clicked", async () => {
    const user = userEvent.setup();
    const onUpdateQuantity = vi.fn();
    renderWithProviders(
      <CartView items={[items[0]]} onUpdateQuantity={onUpdateQuantity} onRemove={vi.fn()} />
    );
    await user.click(screen.getByRole("button", { name: enUSCart.item.increaseQuantity }));
    expect(onUpdateQuantity).toHaveBeenCalledWith("fj-s-black", 2);
  });

  it('shows singular "item" for one item', () => {
    renderWithProviders(
      <CartView items={[items[0]]} onUpdateQuantity={vi.fn()} onRemove={vi.fn()} />
    );
    expect(screen.getByText(itemCount(1))).toBeInTheDocument();
  });
});
