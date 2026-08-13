import { expect, GUEST_STORAGE_STATE, test } from "./fixtures";
import { signIn } from "./auth";
import { GlobalNavPage } from "./pages/GlobalNav.page";

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
    test("opens showing authenticated account details", async ({ authenticatedPage }) => {
      // Shares one login across the worker (see fixtures.ts) instead of signing in itself
      // — this assertion only reads authenticated state, it doesn't mutate the session.
      // test.use({ viewport }) only configures the built-in page/context fixtures, which
      // this worker-scoped fixture bypasses, so the mobile viewport is set explicitly.
      await authenticatedPage.setViewportSize({ width: 375, height: 812 });
      const nav = new GlobalNavPage(authenticatedPage);
      await nav.open();

      await expect(nav.drawerUsername).toBeVisible();
      await expect(nav.drawerSignOutButton).toBeVisible();
      await expect(nav.drawerGuestLinks).toBeHidden();
    });

    test.describe("signing out", () => {
      // Signs in on its own dedicated page rather than the shared authenticatedPage
      // fixture — signing out invalidates the session, which would break whichever test
      // in this worker uses the shared fixture next. Starts from a guest storageState so
      // signIn() has a clean session to authenticate, same as the "opens..." fixture does.
      test.use({ storageState: GUEST_STORAGE_STATE });

      test("switches the drawer to guest state", async ({ page, nav }) => {
        await signIn(page, email, password);
        await nav.open();
        await nav.signOut();

        await expect(nav.drawerGuestLinks).toBeVisible();
        await expect(nav.drawerSignInLink).toBeVisible();
        await expect(nav.drawerSignUpLink).toBeVisible();
        await expect(nav.drawerUsername).toBeHidden();
      });
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
