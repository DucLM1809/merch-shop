import { expect, test } from "../fixtures";
import { AdminTeamsPage } from "../pages/AdminTeams.page";

test.describe("Admin team CRUD", () => {
  // This test walks the full CRUD lifecycle, so each step below is its own
  // Act/Assert pair, chained off the state the previous step's Assert just confirmed.
  test("admin can create, edit, and delete a team", async ({ adminPage }) => {
    // Arrange
    const admin = new AdminTeamsPage(adminPage);
    const teamName = `E2E Team ${Date.now()}`;
    const teamSlug = `e2e-team-${Date.now()}`;
    const updatedName = `${teamName} Updated`;
    await adminPage.goto("/en-US/admin/teams");
    await expect(admin.heading).toBeVisible();

    // Act: create
    await admin.createTeam(teamName, teamSlug);

    // Assert: create
    await expect(admin.rowByName(teamName)).toBeVisible();
    const teamId = await admin.idFor(teamName);

    // Act: edit
    await admin.startEdit(teamId);
    await admin.nameInput.fill(updatedName);
    await admin.saveButton.click();

    // Assert: edit
    await expect(admin.rowById(teamId)).toContainText(updatedName);

    // Act: delete
    await admin.startDelete(teamId);
    await admin.confirmDelete(teamId);

    // Assert: delete
    await expect(admin.rowById(teamId)).toBeHidden();
  });

  // Uses the default (buyer) storageState, which is authenticated but not admin — this
  // covers the AdminGuard component's role check, not just the guest-redirect case
  // already covered by auth-redirect.spec.ts.
  test("redirects a non-admin signed-in user away from /admin", async ({ page }) => {
    // Act
    await page.goto("/en-US/admin/teams");

    // Assert
    await expect(page).toHaveURL("/en-US/");
  });
});
