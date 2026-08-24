import { screen, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";

import enUSCart from "@/i18n/locales/en-US/cart.json";
import enGBCart from "@/i18n/locales/en-GB/cart.json";
import frFRCart from "@/i18n/locales/fr-FR/cart.json";
import { priceText, renderRoute } from "@/test-utils";
import { addToCart, clearCart } from "@/store/cart";

// The cart draws the same Phase 1 line the catalog does: the chrome around a line item is
// translated, the product in it is not, and the money is formatted per locale without being
// converted. These tests hold that line from the route down, including the en-GB copy that
// says "basket" where en-US says "cart".

const JERSEY = {
  skuId: "fj-s-black",
  productId: "1",
  productName: "Faker Jersey",
  variant: "S / Black",
  price: 59.99,
};

beforeEach(() => clearCart());

describe("Cart chrome across locales", () => {
  it("renders the empty state in French under the fr-FR prefix", async () => {
    renderRoute("/fr-FR/cart");

    await screen.findByText(frFRCart.empty.title);

    expect(screen.getByText(frFRCart.empty.hint)).toBeInTheDocument();
    expect(screen.queryByText(enUSCart.empty.title)).not.toBeInTheDocument();
  });

  it("translates the line item controls and totals", async () => {
    addToCart(JERSEY);

    renderRoute("/fr-FR/cart");

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: frFRCart.title })).toBeInTheDocument();
    });

    expect(screen.getByText(frFRCart.subtotal)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: frFRCart.item.decreaseQuantity })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: frFRCart.item.increaseQuantity })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: frFRCart.item.remove })).toBeInTheDocument();
  });

  it("counts items using the active locale's plural rule", async () => {
    addToCart(JERSEY);
    addToCart({ ...JERSEY, skuId: "fj-m-white", variant: "M / White", price: 62.99 });

    renderRoute("/fr-FR/cart");

    const expected = frFRCart.itemCount_other.replace("{{count}}", "2");

    expect(await screen.findByText(expected)).toBeInTheDocument();
  });

  it("calls the cart a basket under en-GB", async () => {
    addToCart(JERSEY);

    renderRoute("/en-GB/cart");

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: enGBCart.title })).toBeInTheDocument();
    });

    // The word that separates the two English locales.
    expect(enGBCart.title).not.toBe(enUSCart.title);
    expect(screen.queryByRole("heading", { name: enUSCart.title })).not.toBeInTheDocument();
  });

  it("leaves the product name and variant untranslated", async () => {
    addToCart(JERSEY);

    renderRoute("/fr-FR/cart");

    expect(await screen.findByText("Faker Jersey")).toBeInTheDocument();
    expect(screen.getByText(JERSEY.variant)).toBeInTheDocument();
  });
});

describe("Cart prices across locales", () => {
  it("formats the subtotal for the locale in the URL", async () => {
    addToCart(JERSEY);

    renderRoute("/fr-FR/cart");

    const subtotal = await screen.findByTestId("cart-subtotal");

    expect(priceText(JERSEY.price, "fr-FR")(subtotal.textContent ?? "")).toBe(true);
  });

  it("formats the same subtotal differently per locale, without converting it", async () => {
    addToCart(JERSEY);

    const { unmount } = renderRoute("/en-US/cart");

    const usSubtotal = await screen.findByTestId("cart-subtotal");

    expect(priceText(JERSEY.price, "en-US")(usSubtotal.textContent ?? "")).toBe(true);

    unmount();

    renderRoute("/fr-FR/cart");

    const frenchSubtotal = await screen.findByTestId("cart-subtotal");

    // Same 59.99 either way — French just writes the decimal with a comma.
    expect(frenchSubtotal).toHaveTextContent("59,99");
    expect(frenchSubtotal).not.toHaveTextContent("59.99");
  });

  it("formats the per-line total for a multi-quantity item", async () => {
    addToCart(JERSEY);
    addToCart(JERSEY);
    // A second line keeps the subtotal (182.97) off the line total the assertion looks for,
    // so this can only match the line itself.
    addToCart({ ...JERSEY, skuId: "fj-m-white", variant: "M / White", price: 62.99 });

    renderRoute("/fr-FR/cart");

    // 59.99 × 2 = 119.98, formatted the French way.
    expect(await screen.findByText(priceText(119.98, "fr-FR"))).toBeInTheDocument();
  });
});
