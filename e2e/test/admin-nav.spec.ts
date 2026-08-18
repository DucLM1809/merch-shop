import { expect, test } from "../fixtures";
import { ADMIN_NAV_ITEMS, AdminLayoutPage } from "../pages/AdminLayout.page";

test.describe("Admin sidebar navigation", () => {
  // Walks every sidebar item in turn, so each step's Act/Assert pair checks both that the
  // click landed on the right route and that the active-state marker moved off the
  // previous item — chained off the state the previous step's Assert just confirmed.
  test("clicking each sidebar nav item navigates there and moves the active state", async ({
    adminPage,
  }) => {
    // Arrange
    const layout = new AdminLayoutPage(adminPage);
    const [start, ...rest] = ADMIN_NAV_ITEMS;
    await adminPage.goto(start.to);
    await expect(layout.navLink(start.label)).toHaveAttribute("aria-current", "page");

    // Act & Assert
    let previousLabel: string = start.label;
    for (const { label, to } of rest) {
      await layout.navLink(label).click();

      await expect(adminPage).toHaveURL(to);
      await expect(layout.navLink(label)).toHaveAttribute("aria-current", "page");
      await expect(layout.navLink(previousLabel)).not.toHaveAttribute("aria-current", "page");

      previousLabel = label;
    }
  });
});
