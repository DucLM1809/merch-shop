import { expect, type Locator, type Page } from "@playwright/test";
import Decimal from "decimal.js";

import { clickUntilHydrated } from "../hydration";

// This reads the raw GET /products/:id response directly (see open() below), so it
// describes the real backend's wire shape (see api/types.ts's Raw* types and
// merch-shop-11d), not the frontend's normalized Product/SKU — SKU prices come back
// as serialized decimal.js internals and variant fields nest under `attributes`.
type RawSku = {
  price: { s: number; e: number; d: number[] } | number;
  available: boolean;
  attributes: { size?: string; color?: string; edition?: string };
};

type RawProduct = {
  name: string;
  skus?: RawSku[];
};

export type SKU = {
  price: number;
  available: boolean;
  size?: string;
  color?: string;
  edition?: string;
};

export type Product = {
  name: string;
  skus?: SKU[];
};

function parseDecimal(value: RawSku["price"]): number {
  if (typeof value === "number") return value;
  // Same rehydration client.ts uses: the backend serializes prices as decimal.js's
  // raw internal {s,e,d} fields rather than calling toString()/toJSON().
  const revived = Object.assign(Object.create(Decimal.prototype) as Decimal, value);
  return revived.toNumber();
}

function normalizeSku(raw: RawSku): SKU {
  return {
    price: parseDecimal(raw.price),
    available: raw.available,
    size: raw.attributes.size,
    color: raw.attributes.color,
    edition: raw.attributes.edition,
  };
}

const SKU_DIMENSIONS = ["size", "color", "edition"] as const;

export class ProductDetailPage {
  readonly page: Page;
  readonly price: Locator;
  readonly addToCartButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.price = page.getByTestId("product-price");
    this.addToCartButton = page.getByRole("button", { name: "Add to Cart" });
  }

  heading(name: string): Locator {
    return this.page.getByRole("heading", { name, level: 1 });
  }

  // Navigates via the given trigger and reads the GET /products/:slug response it
  // fires, instead of re-fetching separately — keeps the returned data guaranteed in
  // sync with whatever the trigger actually navigated to.
  async open(trigger: () => Promise<void>): Promise<Product> {
    const [response] = await Promise.all([
      this.page.waitForResponse(
        (res) =>
          /\/products\/[^/]+$/.test(new URL(res.url()).pathname) && res.request().method() === "GET"
      ),
      trigger(),
    ]);
    const body = (await response.json()) as { data: RawProduct };
    return { name: body.data.name, skus: body.data.skus?.map(normalizeSku) };
  }

  async selectSku(sku: SKU): Promise<void> {
    for (const dimension of SKU_DIMENSIONS) {
      const value = sku[dimension];
      if (!value) continue;
      const option = this.page.getByRole("button", { name: value, exact: true });
      await clickUntilHydrated(option, () =>
        expect(option).toHaveAttribute("aria-pressed", "true")
      );
    }
  }

  async addToCart(verifyAdded: () => Promise<void>): Promise<void> {
    await clickUntilHydrated(this.addToCartButton, verifyAdded);
  }
}
