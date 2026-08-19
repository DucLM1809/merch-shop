import { type Locator, type Page } from "@playwright/test";

import type { OrderStatus } from "@/api/types";

export class AdminOrdersPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly retryFulfillmentButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole("heading", { name: "Orders" });
    // AdminOrdersView only ever expands one row at a time, so while a row is expanded
    // this is scoped to that row's detail panel by construction.
    this.retryFulfillmentButton = page.getByRole("button", { name: "Retry Fulfillment" });
  }

  async gotoStatus(status: OrderStatus): Promise<void> {
    await this.page.goto(`/admin/orders?status=${status}`);
    await this.waitForOrdersToSettle();
  }

  statusBadge(orderId: string): Locator {
    return this.page.getByTestId(`order-status-${orderId}`);
  }

  // The row container carries no data-testid of its own — clicking the status badge
  // bubbles up to the row's onClick, which is what actually toggles expand/collapse.
  async toggleRow(orderId: string): Promise<void> {
    await this.statusBadge(orderId).click();
  }

  // `page.goto`'s "load" event fires before the orders query resolves, so right after
  // navigation the list is still in its loading state — wait for either a row or the
  // empty state before reading rows, or firstOrderId() below races the fetch.
  private async waitForOrdersToSettle(): Promise<void> {
    await Promise.race([
      this.page.locator('[data-testid^="order-status-"]').first().waitFor({ state: "visible" }),
      this.page.getByText("No orders yet.", { exact: true }).waitFor({ state: "visible" }),
    ]).catch(() => {});
  }

  async firstOrderId(): Promise<string | null> {
    await this.waitForOrdersToSettle();
    const badge = this.page.locator('[data-testid^="order-status-"]').first();
    if ((await badge.count()) === 0) return null;
    const testId = await badge.getAttribute("data-testid");
    return testId?.replace("order-status-", "") ?? null;
  }
}
