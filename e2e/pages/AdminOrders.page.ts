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
  }

  statusBadge(orderId: string): Locator {
    return this.page.getByTestId(`order-status-${orderId}`);
  }

  // The row container carries no data-testid of its own — clicking the status badge
  // bubbles up to the row's onClick, which is what actually toggles expand/collapse.
  async toggleRow(orderId: string): Promise<void> {
    await this.statusBadge(orderId).click();
  }

  async firstOrderId(): Promise<string | null> {
    const badge = this.page.locator('[data-testid^="order-status-"]').first();
    if ((await badge.count()) === 0) return null;
    const testId = await badge.getAttribute("data-testid");
    return testId?.replace("order-status-", "") ?? null;
  }
}
