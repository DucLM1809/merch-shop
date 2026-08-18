import { expect, test } from "../fixtures";
import { AdminProductsPage } from "../pages/AdminProducts.page";

test.describe("Admin product CRUD", () => {
  test("admin can create, edit, and delete a product", async ({ adminPage }) => {
    const admin = new AdminProductsPage(adminPage);
    const productName = `E2E Product ${Date.now()}`;
    const updatedName = `${productName} Updated`;

    await adminPage.goto("/admin/products");
    await expect(admin.heading).toBeVisible();

    await admin.createProduct(productName);
    await expect(admin.rowByName(productName)).toBeVisible();
    const productId = await admin.idFor(productName);

    await admin.startEdit(productId);
    await admin.nameInput.fill(updatedName);
    await admin.saveButton.click();
    await expect(admin.rowById(productId)).toContainText(updatedName);

    await admin.startDelete(productId);
    await admin.confirmDelete(productId);
    await expect(admin.rowById(productId)).toBeHidden();
  });

  // Uses the default (buyer) storageState, which is authenticated but not admin — this
  // covers the AdminGuard component's role check, not just the guest-redirect case
  // already covered by auth-redirect.spec.ts.
  test("redirects a non-admin signed-in user away from /admin", async ({ page }) => {
    await page.goto("/admin/products");

    await expect(page).toHaveURL("/");
  });
});
