import { expect, GUEST_STORAGE_STATE, test } from "./fixtures";
import { signIn } from "./auth";

// Guaranteed non-empty: global-setup.ts validates these before any test runs.
const email = process.env.E2E_TEST_EMAIL as string;
const password = process.env.E2E_TEST_PASSWORD as string;

test.describe("Mobile nav drawer", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("hides desktop-only nav and shows the mobile trigger", async ({ page, nav }) => {
    await page.goto("/");

    await expect(nav.desktopAccountMenu).toBeHidden();
    await expect(nav.openDrawerButton).toBeVisible();
  });

  test.describe("with a freshly authenticated session", () => {
    // The shared storageState.json refresh token is single-use and rotates on every
    // /auth/refresh call (ADR-0015). Every fresh browser context triggers one on load,
    // so tests asserting on authenticated identity would race each other over that one
    // token. Signing in here gives each of these tests its own untouched token.
    test.use({ storageState: GUEST_STORAGE_STATE });

    test("opens showing authenticated account details", async ({ page, nav }) => {
      await signIn(page, email, password);
      await nav.open();

      await expect(nav.drawerUsername).toBeVisible();
      await expect(nav.drawerSignOutButton).toBeVisible();
      await expect(nav.drawerGuestLinks).toBeHidden();
    });

    test("signing out from the drawer switches it to guest state", async ({ page, nav }) => {
      await signIn(page, email, password);
      await nav.open();
      await nav.signOut();

      await expect(nav.drawerGuestLinks).toBeVisible();
      await expect(nav.drawerSignInLink).toBeVisible();
      await expect(nav.drawerSignUpLink).toBeVisible();
      await expect(nav.drawerUsername).toBeHidden();
    });
  });

  test("closes via the close button", async ({ page, nav }) => {
    await page.goto("/");
    await nav.open();

    await nav.closeViaCloseButton();
  });

  test("closes via clicking the overlay", async ({ page, nav }) => {
    await page.goto("/");
    await nav.open();

    await nav.closeViaOverlay();
  });

  test("closes via the Escape key", async ({ page, nav }) => {
    await page.goto("/");
    await nav.open();

    await nav.closeViaEscape();
  });

  test("closes when a link inside the drawer is clicked", async ({ page, nav }) => {
    await page.goto("/");
    await nav.open();
    await nav.drawerCartLink.click();

    await expect(nav.drawer).toBeHidden();
    await expect(page).toHaveURL(/\/cart$/);
  });

  test.describe("as a guest", () => {
    test.use({ storageState: GUEST_STORAGE_STATE });

    test("opens showing guest links instead of an account", async ({ page, nav }) => {
      await page.goto("/");
      await nav.open();

      await expect(nav.drawerGuestLinks).toBeVisible();
      await expect(nav.drawerSignInLink).toBeVisible();
      await expect(nav.drawerSignUpLink).toBeVisible();
      await expect(nav.drawerUsername).toBeHidden();
    });
  });
});
