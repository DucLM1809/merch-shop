import { expect, test } from "./fixtures";

// Shares one login across the worker (see fixtures.ts) instead of signing in itself —
// the fixture's own setup performs the real POST /auth/login this test is verifying.
test("signing in produces an authenticated session", async ({ authenticatedPage }) => {
  await expect(authenticatedPage.getByTestId("nav-account-menu")).toBeVisible();
});
