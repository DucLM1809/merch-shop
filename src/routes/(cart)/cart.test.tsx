import { describe, it, expect, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderRoute } from "../../test-utils";
import { addToCart, clearCart, updateQuantity } from "../../store/cart";

beforeEach(() => clearCart());

describe("/cart route", () => {
  it("shows empty cart message when no items", async () => {
    renderRoute("/cart");
    await screen.findByText(/your cart is empty/i);
  });

  it("adds two SKUs, updates quantity, removes one, asserts correct subtotal", async () => {
    addToCart({
      skuId: "fj-s-black",
      productId: "1",
      productName: "Faker Jersey",
      variant: "S / Black",
      price: 59.99,
    });
    addToCart({
      skuId: "fj-m-white",
      productId: "1",
      productName: "Faker Jersey",
      variant: "M / White",
      price: 62.99,
    });
    updateQuantity("fj-s-black", 2);

    renderRoute("/cart");

    // Both items visible; subtotal 59.99×2 + 62.99 = 182.97
    const jerseyItems = await screen.findAllByText("Faker Jersey");
    expect(jerseyItems).toHaveLength(2);

    const subtotal = await screen.findByTestId("cart-subtotal");
    expect(subtotal).toHaveTextContent("$182.97");

    // Remove first item (S / Black qty 2)
    const user = userEvent.setup();
    const removeButtons = await screen.findAllByRole("button", { name: /remove/i });
    await user.click(removeButtons[0]);

    // Subtotal drops to 62.99
    await waitFor(() => {
      expect(screen.getByTestId("cart-subtotal")).toHaveTextContent("$62.99");
    });
  });

  it("decrementing quantity to 0 removes item", async () => {
    addToCart({
      skuId: "fj-s-black",
      productId: "1",
      productName: "Faker Jersey",
      variant: "S / Black",
      price: 59.99,
    });

    renderRoute("/cart");
    await screen.findByText("Faker Jersey");

    const user = userEvent.setup();
    const decrementButton = await screen.findByRole("button", { name: /decrease quantity/i });
    await user.click(decrementButton);

    await screen.findByText(/your cart is empty/i);
  });
});
