import { expect, test } from "../fixtures";
import { AdminGamesPage } from "../pages/AdminGames.page";

test.describe("Admin game CRUD", () => {
  // This test walks the full CRUD lifecycle, so each step below is its own
  // Act/Assert pair, chained off the state the previous step's Assert just confirmed.
  test("admin can create, edit, and delete a game", async ({ adminPage }) => {
    // Arrange
    const admin = new AdminGamesPage(adminPage);
    const gameName = `E2E Game ${Date.now()}`;
    const gameSlug = `e2e-game-${Date.now()}`;
    const updatedName = `${gameName} Updated`;
    await adminPage.goto("/en-US/admin/games");
    await expect(admin.heading).toBeVisible();

    // Act: create
    await admin.createGame(gameName, gameSlug);

    // Assert: create
    await expect(admin.rowByName(gameName)).toBeVisible();
    const gameId = await admin.idFor(gameName);

    // Act: edit
    await admin.startEdit(gameId);
    await admin.nameInput.fill(updatedName);
    await admin.saveButton.click();

    // Assert: edit
    await expect(admin.rowById(gameId)).toContainText(updatedName);

    // Act: delete
    await admin.startDelete(gameId);
    await admin.confirmDelete(gameId);

    // Assert: delete
    await expect(admin.rowById(gameId)).toBeHidden();
  });

  // Uses the worker-scoped buyer session (authenticated but not admin) instead of the
  // default storageState — this covers the AdminGuard component's role check, not just
  // the guest-redirect case already covered by auth-redirect.spec.ts.
  test("redirects a non-admin signed-in user away from /admin", async ({ authenticatedPage }) => {
    // Act
    await authenticatedPage.goto("/en-US/admin/games");

    // Assert
    await expect(authenticatedPage).toHaveURL("/en-US");
  });
});
