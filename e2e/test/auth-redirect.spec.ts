import { expect, GUEST_STORAGE_STATE, test } from "../fixtures";
import { signIn } from "../auth";

// Guaranteed non-empty: global-setup.ts validates these before any test runs.
const email = process.env.E2E_TEST_EMAIL as string;
const password = process.env.E2E_TEST_PASSWORD as string;

test.describe("Auth redirect flow", () => {
  test.use({ storageState: GUEST_STORAGE_STATE });

  test("redirects an unauthenticated visit to /account/orders to /sign-in", async ({ page }) => {
    // Act
    await page.goto("/en-US/account/orders");

    // Assert
    await expect(page).toHaveURL(/\/sign-in(\?|$)/);
  });

  test("completes sign-in and lands back at /account/orders", async ({ page, nav }) => {
    // Arrange
    await page.goto("/en-US/account/orders");
    await expect(page).toHaveURL(/\/sign-in(\?|$)/);

    // Act
    // Picks up the redirect target the guard just attached (?redirect=/account/orders)
    // rather than hardcoding it, so this test tracks whatever the app actually redirected to.
    const { pathname, search } = new URL(page.url());
    await signIn(page, email, password, pathname + search);

    // Assert
    await expect(page).toHaveURL(/\/account\/orders$/);
    await expect(nav.desktopAccountMenu).toBeVisible();
  });

  test("shows an error and stays on /sign-in for invalid credentials", async ({ page }) => {
    // Arrange
    await page.goto("/en-US/sign-in");

    // Act
    // Same SSR-before-hydration race documented in auth.ts's signIn: a click that lands
    // before React attaches its submit handler falls through to a native GET submit
    // (URL grows an ?email=&password= query string) instead of a handled rejection.
    // Retry through that window rather than guessing at a fixed hydration delay — each
    // attempt folds in a probe assertion since hydration can only be confirmed by trying.
    for (let attempt = 1; attempt <= 5; attempt++) {
      if (page.url().includes("?email=")) {
        await page.goto("/en-US/sign-in");
      }

      await page.getByLabel("Email").fill(email);
      await page.getByLabel("Password").fill("definitely-the-wrong-password");
      await page.getByRole("button", { name: "Sign in" }).click();

      try {
        await expect(page.getByTestId("sign-in-error")).toBeVisible({ timeout: 1000 });
        break;
      } catch {
        if (attempt === 5) throw new Error("Sign-in form never hydrated after 5 attempts.");
      }
    }

    // Assert
    await expect(page.getByTestId("sign-in-error")).toHaveText("Invalid email or password");
    await expect(page).toHaveURL(/\/sign-in$/);
  });
});
