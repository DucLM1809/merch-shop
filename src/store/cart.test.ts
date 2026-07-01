import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  cartStore,
  addToCart,
  updateQuantity,
  removeFromCart,
  getSubtotal,
  clearCart,
  mergeItems,
} from "./cart";

const sku1 = {
  skuId: "fj-s-black",
  productId: "1",
  productName: "Faker Jersey",
  variant: "S / Black",
  price: 59.99,
};
const sku2 = {
  skuId: "fj-m-white",
  productId: "1",
  productName: "Faker Jersey",
  variant: "M / White",
  price: 62.99,
};

beforeEach(() => clearCart());

describe("cart store", () => {
  it("adds item with quantity 1", () => {
    addToCart(sku1);
    expect(cartStore.state.items).toHaveLength(1);
    expect(cartStore.state.items[0].quantity).toBe(1);
  });

  it("increments quantity on duplicate sku", () => {
    addToCart(sku1);
    addToCart(sku1);
    expect(cartStore.state.items).toHaveLength(1);
    expect(cartStore.state.items[0].quantity).toBe(2);
  });

  it("updates quantity", () => {
    addToCart(sku1);
    updateQuantity("fj-s-black", 3);
    expect(cartStore.state.items[0].quantity).toBe(3);
  });

  it("removes item when quantity set to 0", () => {
    addToCart(sku1);
    updateQuantity("fj-s-black", 0);
    expect(cartStore.state.items).toHaveLength(0);
  });

  it("removes item by skuId", () => {
    addToCart(sku1);
    addToCart(sku2);
    removeFromCart("fj-s-black");
    expect(cartStore.state.items).toHaveLength(1);
    expect(cartStore.state.items[0].skuId).toBe("fj-m-white");
  });

  it("computes subtotal", () => {
    addToCart(sku1);
    addToCart(sku2);
    updateQuantity("fj-s-black", 2);
    expect(getSubtotal(cartStore.state.items)).toBeCloseTo(59.99 * 2 + 62.99);
  });

  it("total item count sums quantities", () => {
    addToCart(sku1);
    addToCart(sku2);
    updateQuantity("fj-s-black", 3);
    const total = cartStore.state.items.reduce((s, i) => s + i.quantity, 0);
    expect(total).toBe(4);
  });
});

describe("cart store SSR safety", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  it("imports without throwing and starts empty when sessionStorage is undefined", async () => {
    vi.stubGlobal("sessionStorage", undefined);
    vi.resetModules();

    const { cartStore: ssrCartStore } = await import("./cart");

    expect(ssrCartStore.state.items).toEqual([]);
  });
});

describe("mergeItems", () => {
  const item1 = { ...sku1, quantity: 2 };
  const item2 = { ...sku2, quantity: 1 };

  it("sums quantities for duplicate SKU", () => {
    const result = mergeItems([item1], [{ ...item1, quantity: 3 }]);
    expect(result).toHaveLength(1);
    expect(result[0].quantity).toBe(5);
  });

  it("keeps guest-only item unchanged", () => {
    const result = mergeItems([item1], []);
    expect(result).toEqual([item1]);
  });

  it("adds server-only item", () => {
    const result = mergeItems([], [item2]);
    expect(result).toHaveLength(1);
    expect(result[0].skuId).toBe(sku2.skuId);
  });

  it("merges distinct SKUs from both carts", () => {
    const result = mergeItems([item1], [item2]);
    expect(result).toHaveLength(2);
    expect(result.find((i) => i.skuId === sku1.skuId)?.quantity).toBe(2);
    expect(result.find((i) => i.skuId === sku2.skuId)?.quantity).toBe(1);
  });
});
