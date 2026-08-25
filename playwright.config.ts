import { defineConfig, devices } from "@playwright/test";
import { config } from "dotenv";

config();

export default defineConfig({
  testDir: "./e2e/test",
  globalSetup: "./e2e/global-setup.ts",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: "list",
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL,
    // Authenticated by default so most flows can skip login. Specs that need to start
    // unauthenticated (e.g. the auth redirect flow) must override with
    // test.use({ storageState: { cookies: [], origins: [] } }).
    //
    // WARNING: this snapshot's refresh_token cookie is single-use and rotates on every
    // /auth/refresh call (ADR-0015, see global-setup.ts), so it is only valid for the
    // first authenticated bootstrap that consumes it in a run — every later consumer
    // replays a spent cookie, gets a 401 on refresh, and is treated as signed out. Don't
    // rely on the default `page` fixture for anything that asserts on authenticated
    // identity; use the worker-scoped `authenticatedPage`/`adminPage` fixtures in
    // fixtures.ts instead, which sign in fresh once per worker.
    storageState: "./e2e/.auth/user.json",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
