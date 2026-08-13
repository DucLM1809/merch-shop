import { test, expect } from "@playwright/test";

import { signIn } from "./auth";
import { GUEST_STORAGE_STATE } from "./fixtures";

// Guaranteed non-empty: global-setup.ts validates these before any test runs.
const email = process.env.E2E_TEST_EMAIL as string;
const password = process.env.E2E_TEST_PASSWORD as string;

// The shared storageState.json refresh token is single-use and rotates on every
// /auth/refresh call (ADR-0015), so this test signs in fresh rather than relying on it
// — see nav-drawer.spec.ts's "with a freshly authenticated session" describe block.
test.use({ storageState: GUEST_STORAGE_STATE });

test("signing in produces an authenticated session", async ({ page }) => {
  await signIn(page, email, password);

  await expect(page.getByTestId("nav-account-menu")).toBeVisible();
});
