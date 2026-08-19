import { expect, test } from "../fixtures";
import { AdminPublishersPage } from "../pages/AdminPublishers.page";

test.describe("Admin publisher CRUD", () => {
  // This test walks the full CRUD lifecycle, so each step below is its own
  // Act/Assert pair, chained off the state the previous step's Assert just confirmed.
  test("admin can create, edit, and delete a publisher", async ({ adminPage }) => {
    // Arrange
    const admin = new AdminPublishersPage(adminPage);
    const publisherName = `E2E Publisher ${Date.now()}`;
    const publisherSlug = `e2e-publisher-${Date.now()}`;
    const updatedName = `${publisherName} Updated`;
    await adminPage.goto("/en-US/admin/publishers");
    await expect(admin.heading).toBeVisible();

    // Act: create
    await admin.createPublisher(publisherName, publisherSlug);

    // Assert: create
    await expect(admin.rowByName(publisherName)).toBeVisible();
    const publisherId = await admin.idFor(publisherName);

    // Act: edit
    await admin.startEdit(publisherId);
    await admin.nameInput.fill(updatedName);
    await admin.saveButton.click();

    // Assert: edit
    await expect(admin.rowById(publisherId)).toContainText(updatedName);

    // Act: delete
    await admin.startDelete(publisherId);
    await admin.confirmDelete(publisherId);

    // Assert: delete
    await expect(admin.rowById(publisherId)).toBeHidden();
  });

  // Uses the default (buyer) storageState, which is authenticated but not admin — this
  // covers the AdminGuard component's role check, not just the guest-redirect case
  // already covered by auth-redirect.spec.ts.
  test("redirects a non-admin signed-in user away from /admin", async ({ page }) => {
    // Act
    await page.goto("/en-US/admin/publishers");

    // Assert
    await expect(page).toHaveURL("/en-US/");
  });
});
