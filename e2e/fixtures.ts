import { test as base, expect, type Page } from "@playwright/test";

import { signIn } from "./auth";
import { GlobalNavPage } from "./pages/GlobalNav.page";

export const GUEST_STORAGE_STATE = { cookies: [], origins: [] };

type Fixtures = {
  nav: GlobalNavPage;
};

type WorkerFixtures = {
  authenticatedPage: Page;
};

export const test = base.extend<Fixtures, WorkerFixtures>({
  nav: async ({ page }, use) => {
    await use(new GlobalNavPage(page));
  },

  // One real POST /auth/login per worker instead of one per test, and retries of a
  // consuming test don't add another — the backend's /auth/login rate limit
  // (10 req/60s) is shared across the whole suite, and per-test logins were tripping it
  // on rapid reruns (merch-shop-6xd). Only for tests that just need to *read*
  // authenticated state: anything that mutates the session (e.g. signing out) must sign
  // in on its own dedicated page instead, or it'll invalidate this session for whichever
  // test in the worker uses it next.
  authenticatedPage: [
    async ({ browser }, use) => {
      // Guaranteed non-empty: global-setup.ts validates these before any test runs.
      const email = process.env.E2E_TEST_EMAIL as string;
      const password = process.env.E2E_TEST_PASSWORD as string;

      const context = await browser.newContext({ storageState: GUEST_STORAGE_STATE });
      const page = await context.newPage();
      await signIn(page, email, password);

      await use(page);

      await context.close();
    },
    { scope: "worker" },
  ],
});

export { expect };
