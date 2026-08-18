import { type Locator, type Page } from "@playwright/test";

export class AccountOrdersPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly emptyState: Locator;
  readonly orderRows: Locator;

  readonly detailStatus: Locator;
  readonly detailTotal: Locator;
  readonly detailBackLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole("heading", { name: "Order History" });
    this.emptyState = page.getByText("No orders yet.");
    this.orderRows = page.locator('[data-testid^="order-row-"]');

    this.detailStatus = page.getByTestId("order-status");
    this.detailTotal = page.getByTestId("order-total");
    this.detailBackLink = page.getByRole("link", { name: /back to order history/i });
  }

  statusBadge(orderId: string): Locator {
    return this.page.getByTestId(`order-status-${orderId}`);
  }
}
