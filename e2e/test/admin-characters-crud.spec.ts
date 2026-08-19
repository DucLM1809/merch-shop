import { expect, test } from "../fixtures";
import { AdminCharactersPage } from "../pages/AdminCharacters.page";

test.describe("Admin character CRUD", () => {
  // This test walks the full CRUD lifecycle, so each step below is its own
  // Act/Assert pair, chained off the state the previous step's Assert just confirmed.
  test("admin can create, edit, and delete a character", async ({ adminPage }) => {
    // Arrange
    const admin = new AdminCharactersPage(adminPage);
    const characterName = `E2E Character ${Date.now()}`;
    const characterSlug = `e2e-character-${Date.now()}`;
    const updatedName = `${characterName} Updated`;
    await adminPage.goto("/en-US/admin/characters");
    await expect(admin.heading).toBeVisible();

    // Act: create
    await admin.createCharacter(characterName, characterSlug);

    // Assert: create
    await expect(admin.rowByName(characterName)).toBeVisible();
    const characterId = await admin.idFor(characterName);

    // Act: edit
    await admin.startEdit(characterId);
    await admin.nameInput.fill(updatedName);
    await admin.saveButton.click();

    // Assert: edit
    await expect(admin.rowById(characterId)).toContainText(updatedName);

    // Act: delete
    await admin.startDelete(characterId);
    await admin.confirmDelete(characterId);

    // Assert: delete
    await expect(admin.rowById(characterId)).toBeHidden();
  });

  // Uses the default (buyer) storageState, which is authenticated but not admin — this
  // covers the AdminGuard component's role check, not just the guest-redirect case
  // already covered by auth-redirect.spec.ts.
  test("redirects a non-admin signed-in user away from /admin", async ({ page }) => {
    // Act
    await page.goto("/en-US/admin/characters");

    // Assert
    await expect(page).toHaveURL("/en-US/");
  });
});
