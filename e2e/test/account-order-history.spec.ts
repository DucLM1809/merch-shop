import { expect, test } from "../fixtures";
import { AccountOrdersPage } from "../pages/AccountOrders.page";

// The guest-redirect case for /account/orders is already covered by
// auth-redirect.spec.ts — this suite only covers order-history-specific behavior.
test.describe("Account order history", () => {
  test("renders order history for the authenticated buyer", async ({ authenticatedPage }) => {
    // Arrange
    const orders = new AccountOrdersPage(authenticatedPage);

    // Act
    await authenticatedPage.goto("/en-US/account/orders");

    // Assert
    await expect(orders.heading).toBeVisible();

    const rowCount = await orders.orderRows.count();
    if (rowCount === 0) {
      // No orders seeded for the test buyer yet (e.g. before a checkout E2E run has
      // ever completed against this environment) — the empty state is still a valid,
      // testable outcome of this page.
      await expect(orders.emptyState).toBeVisible();
      return;
    }

    const firstRow = orders.orderRows.first();
    const orderId = (await firstRow.getAttribute("data-testid"))?.replace("order-row-", "");
    if (!orderId) throw new Error("Order row is missing its data-testid.");
    await expect(orders.statusBadge(orderId)).toBeVisible();

    // Act: open the order detail page.
    await firstRow.click();

    // Assert
    await expect(authenticatedPage).toHaveURL(`/en-US/account/orders/${orderId}`);
    await expect(
      authenticatedPage.getByRole("heading", { name: `Order #${orderId}` })
    ).toBeVisible();
    await expect(orders.detailStatus).toBeVisible();
    await expect(orders.detailTotal).toBeVisible();

    // Act: navigate back to the order list.
    await orders.detailBackLink.click();

    // Assert
    await expect(authenticatedPage).toHaveURL("/en-US/account/orders");
  });

  test("shows a not-found message for an order id that doesn't exist", async ({
    authenticatedPage,
  }) => {
    // Arrange
    const orders = new AccountOrdersPage(authenticatedPage);

    // Act
    await authenticatedPage.goto("/en-US/account/orders/does-not-exist");

    // Assert
    await expect(authenticatedPage.getByText(/order not found/i)).toBeVisible({ timeout: 10_000 });
    await expect(orders.detailStatus).toBeHidden();
  });
});
