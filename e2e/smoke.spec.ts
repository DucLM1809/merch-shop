import { expect, test } from "@playwright/test";

// Foundational smoke test — proves the E2E harness (config, auth fixture, web
// server) boots end to end. Feature slices land as their own specs.
test("storefront shell renders on the home page", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Merch Shop/i);
});
