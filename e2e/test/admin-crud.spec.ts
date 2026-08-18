import { expect, test } from "../fixtures";
import { AdminProductsPage } from "../pages/AdminProducts.page";

test.describe("Admin product CRUD", () => {
  // This test walks the full CRUD lifecycle, so each step below is its own
  // Act/Assert pair, chained off the state the previous step's Assert just confirmed.
  test("admin can create, edit, and delete a product", async ({ adminPage }) => {
    // Arrange
    const admin = new AdminProductsPage(adminPage);
    const productName = `E2E Product ${Date.now()}`;
    const updatedName = `${productName} Updated`;
    await adminPage.goto("/admin/products");
    await expect(admin.heading).toBeVisible();

    // Act: create
    await admin.createProduct(productName);

    // Assert: create
    await expect(admin.rowByName(productName)).toBeVisible();
    const productId = await admin.idFor(productName);

    // Act: edit
    await admin.startEdit(productId);
    await admin.nameInput.fill(updatedName);
    await admin.saveButton.click();

    // Assert: edit
    await expect(admin.rowById(productId)).toContainText(updatedName);

    // Act: delete
    await admin.startDelete(productId);
    await admin.confirmDelete(productId);

    // Assert: delete
    await expect(admin.rowById(productId)).toBeHidden();
  });

  // Uses the default (buyer) storageState, which is authenticated but not admin — this
  // covers the AdminGuard component's role check, not just the guest-redirect case
  // already covered by auth-redirect.spec.ts.
  test("redirects a non-admin signed-in user away from /admin", async ({ page }) => {
    // Act
    await page.goto("/admin/products");

    // Assert
    await expect(page).toHaveURL("/");
  });
});
