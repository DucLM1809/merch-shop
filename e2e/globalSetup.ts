import { mkdir } from "node:fs/promises";
import { dirname } from "node:path";

import { chromium } from "@playwright/test";

const STORAGE_STATE = "e2e/.auth/user.json";

// Signs in once with real Clerk test credentials and persists the authenticated
// storageState. Every spec then boots already signed in via `use.storageState`.
async function globalSetup(): Promise<void> {
  const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";
  const email = process.env.E2E_CLERK_EMAIL;
  const password = process.env.E2E_CLERK_PASSWORD;

  if (!email || !password) {
    throw new Error(
      "E2E_CLERK_EMAIL and E2E_CLERK_PASSWORD must be set to build the Playwright auth fixture."
    );
  }

  await mkdir(dirname(STORAGE_STATE), { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage({ baseURL });

  await page.goto("/sign-in");

  // Clerk's <SignIn> is a multi-step form: identifier first, then password.
  await page.getByLabel(/email address|email/i).fill(email);
  await page.getByRole("button", { name: /continue/i }).click();

  await page.getByLabel(/^password/i).fill(password);
  await page.getByRole("button", { name: /continue|sign in/i }).click();

  // fallbackRedirectUrl="/" — wait until Clerk hands control back to the app.
  await page.waitForURL((url) => !url.pathname.startsWith("/sign-in"), {
    timeout: 30_000,
  });

  await page.context().storageState({ path: STORAGE_STATE });
  await browser.close();
}

export default globalSetup;
