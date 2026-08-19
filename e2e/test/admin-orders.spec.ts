import { expect, test } from "../fixtures";
import { AdminOrdersPage } from "../pages/AdminOrders.page";

test.describe("Admin order detail and fulfillment retry", () => {
  test("expanding an order row shows shipping and line-item detail, and collapsing hides it again", async ({
    adminPage,
  }) => {
    // Arrange
    const orders = new AdminOrdersPage(adminPage);
    await adminPage.goto("/en-US/admin/orders");
    await expect(orders.heading).toBeVisible();
    const orderId = await orders.firstOrderId();
    // No orders exist in this environment yet — the empty state is a valid, if
    // untestable-here, outcome of this page (see account-order-history.spec.ts).
    test.skip(orderId === null, "no orders seeded in this environment");

    // Act: expand
    await orders.toggleRow(orderId as string);

    // Assert: expand
    await expect(adminPage.getByText("Shipping", { exact: true })).toBeVisible();
    await expect(adminPage.getByText("Items", { exact: true })).toBeVisible();

    // Act: collapse
    await orders.toggleRow(orderId as string);

    // Assert: collapse
    await expect(adminPage.getByText("Shipping", { exact: true })).toBeHidden();
    await expect(adminPage.getByText("Items", { exact: true })).toBeHidden();
  });

  test("shows Retry Fulfillment for a retryable order and triggers the mutation on click", async ({
    adminPage,
  }) => {
    // Arrange: PENDING and CONFIRMED are the two retryable statuses (see
    // RETRYABLE_STATUSES in AdminOrdersView.tsx) — try each until one has an order.
    const orders = new AdminOrdersPage(adminPage);
    await orders.gotoStatus("PENDING");
    let orderId = await orders.firstOrderId();
    if (orderId === null) {
      await orders.gotoStatus("CONFIRMED");
      orderId = await orders.firstOrderId();
    }
    test.skip(orderId === null, "no retryable (PENDING/CONFIRMED) orders in this environment");

    // Act
    await orders.toggleRow(orderId as string);

    // Assert: button present before triggering the mutation
    await expect(orders.retryFulfillmentButton).toBeVisible();

    // Act: trigger the mutation
    await orders.retryFulfillmentButton.click();

    // Assert: the mutation succeeds and the row re-renders with a non-retryable status,
    // so the button unmounts. Asserting the transient data-loading=true state instead is
    // racy against a fast local backend (~16ms round-trip) — the flag can flip back to
    // false before the assertion's first poll observes it, even though the retry itself
    // succeeded. The settled outcome (button gone) is what actually matters here.
    await expect(orders.retryFulfillmentButton).toBeHidden();
  });

  test("hides Retry Fulfillment for an order that isn't retryable", async ({ adminPage }) => {
    // Arrange: FORWARDED and CANCELLED are the two non-retryable statuses.
    const orders = new AdminOrdersPage(adminPage);
    await orders.gotoStatus("FORWARDED");
    let orderId = await orders.firstOrderId();
    if (orderId === null) {
      await orders.gotoStatus("CANCELLED");
      orderId = await orders.firstOrderId();
    }
    test.skip(
      orderId === null,
      "no non-retryable (FORWARDED/CANCELLED) orders in this environment"
    );

    // Act
    await orders.toggleRow(orderId as string);

    // Assert
    await expect(adminPage.getByText("Items", { exact: true })).toBeVisible();
    await expect(orders.retryFulfillmentButton).toBeHidden();
  });
});
