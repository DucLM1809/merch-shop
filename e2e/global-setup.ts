import path from "node:path";

import { chromium } from "@playwright/test";

import { signIn } from "./auth";

const STORAGE_STATE_PATH = path.resolve(import.meta.dirname, ".auth/user.json");

export default async function globalSetup(): Promise<void> {
  const baseURL = process.env.PLAYWRIGHT_BASE_URL;
  const email = process.env.E2E_TEST_EMAIL;
  const password = process.env.E2E_TEST_PASSWORD;
  const adminEmail = process.env.E2E_ADMIN_EMAIL;
  const adminPassword = process.env.E2E_ADMIN_PASSWORD;

  if (!baseURL || !email || !password || !adminEmail || !adminPassword) {
    throw new Error(
      "PLAYWRIGHT_BASE_URL, E2E_TEST_EMAIL, E2E_TEST_PASSWORD, E2E_ADMIN_EMAIL, and " +
        "E2E_ADMIN_PASSWORD must all be set to run e2e tests."
    );
  }

  const browser = await chromium.launch();
  // Drive the real sign-in form rather than calling /auth/login directly — the refresh-token
  // cookie's domain/CORS behavior only matches production if it's set via an actual browser
  // navigation (see ADR-0015's cross-origin cookie note).
  const page = await browser.newPage({ baseURL });

  await signIn(page, email, password);

  // NOTE: the refresh_token cookie captured here is single-use and rotates on every
  // /auth/refresh call (ADR-0015), so this snapshot only survives one authenticated
  // bootstrap. Tests that assert on authenticated identity sign in fresh instead of
  // relying on this file — see the "with a freshly authenticated session" describe
  // block in nav-drawer.spec.ts.
  await page.context().storageState({ path: STORAGE_STATE_PATH });
  await browser.close();
}
