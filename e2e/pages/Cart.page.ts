import { type Locator, type Page } from "@playwright/test";

import { clickUntilHydrated } from "../hydration";

export class CartPage {
  readonly page: Page;
  readonly subtotal: Locator;
  readonly increaseQuantityButton: Locator;
  readonly decreaseQuantityButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.subtotal = page.getByTestId("cart-subtotal");
    this.increaseQuantityButton = page.getByRole("button", { name: "Increase quantity" });
    this.decreaseQuantityButton = page.getByRole("button", { name: "Decrease quantity" });
  }

  itemName(name: string): Locator {
    return this.page.getByText(name, { exact: true });
  }

  // Unit price and line total render as the same string ($price) while quantity is
  // 1, so callers assert on this locator's count rather than treating it as unique.
  // Excludes the subtotal, which coincidentally renders the same string as both
  // when there's exactly one item at quantity 1 and would otherwise inflate the count.
  priceText(amount: number): Locator {
    return this.page
      .getByText(`$${amount.toFixed(2)}`, { exact: true })
      .and(this.page.locator(':not([data-testid="cart-subtotal"])'));
  }

  async increaseQuantity(verifyUpdated: () => Promise<void>): Promise<void> {
    await clickUntilHydrated(this.increaseQuantityButton, verifyUpdated);
  }

  async decreaseQuantity(verifyUpdated: () => Promise<void>): Promise<void> {
    await clickUntilHydrated(this.decreaseQuantityButton, verifyUpdated);
  }
}
