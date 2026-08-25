import { expect, test } from "../fixtures";
import { AdminProductsPage } from "../pages/AdminProducts.page";
import { AdminSkusPage } from "../pages/AdminSkus.page";

test.describe("Admin SKU CRUD", () => {
  // SKUs have no edit flow — coverage here is create, single-row availability toggle,
  // bulk availability by facet, and delete. Each step is its own Act/Assert pair,
  // chained off the state the previous step's Assert just confirmed.
  test("admin can create a SKU, toggle availability, apply bulk availability, and delete it", async ({
    adminPage,
  }) => {
    // Arrange: create a fresh product to attach the SKU to, so this test doesn't
    // depend on (or collide with) catalog data owned by other specs.
    const products = new AdminProductsPage(adminPage);
    const productName = `E2E SKU Product ${Date.now()}`;
    await adminPage.goto("/en-US/admin/products");
    await expect(products.heading).toBeVisible();

    // Not using AdminProductsPage.createProduct() directly — the bulk-by-facet step
    // needs to target the exact game this product belongs to, so the "Game" select's
    // chosen option (index 1, "any real game") must be read back out before Save
    // closes the form.
    await products.newProductButton.click();
    await products.nameInput.fill(productName);
    await products.gameSelect.selectOption({ index: 1 });
    const gameName = await products.gameSelect.locator("option").nth(1).textContent();
    if (!gameName) throw new Error("Could not read the game option used for product creation.");
    await products.saveButton.click();

    await expect(products.rowByName(productName)).toBeVisible();

    const admin = new AdminSkusPage(adminPage);
    await adminPage.goto("/en-US/admin/skus");
    await expect(admin.heading).toBeVisible();

    // Act: create
    await admin.createSku(productName, "29.99");

    // Assert: create
    await expect(admin.rowByProductName(productName)).toBeVisible();
    const skuId = await admin.idFor(productName);

    // Act: toggle availability
    await expect(admin.availabilityButton(skuId)).toHaveText("Available");
    await admin.toggleAvailability(skuId);

    // Assert: toggle availability
    await expect(admin.availabilityButton(skuId)).toHaveText("Unavailable");

    // Act: bulk availability by facet
    await admin.applyBulkAvailability("game", gameName, true);

    // Assert: bulk availability by facet
    await expect(admin.availabilityButton(skuId)).toHaveText("Available");

    // Act: delete
    await admin.startDelete(skuId);
    await admin.confirmDelete(skuId);

    // Assert: delete
    await expect(admin.rowById(skuId)).toBeHidden();
  });

  // Uses the worker-scoped buyer session (authenticated but not admin) instead of the
  // default storageState — this covers the AdminGuard component's role check, not just
  // the guest-redirect case already covered by auth-redirect.spec.ts.
  test("redirects a non-admin signed-in user away from /admin", async ({ authenticatedPage }) => {
    // Act
    await authenticatedPage.goto("/en-US/admin/skus");

    // Assert
    await expect(authenticatedPage).toHaveURL("/en-US");
  });
});
