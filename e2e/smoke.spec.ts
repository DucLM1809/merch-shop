import { expect, test } from "playwright/test";

test("home page loads for an authenticated session", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("link", { name: /sign in/i })).toHaveCount(0);
});
