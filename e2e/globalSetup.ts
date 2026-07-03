import { chromium, type FullConfig } from "playwright/test";

// ponytail: Clerk sign-in selectors are UI-coupled (role/label text), not
// data-testid — if Clerk's hosted form copy changes, update selectors here.
async function globalSetup(config: FullConfig): Promise<void> {
  const baseURL = config.projects[0]?.use.baseURL ?? "http://localhost:3000";
  const email = process.env.E2E_CLERK_EMAIL;
  const password = process.env.E2E_CLERK_PASSWORD;

  if (!email || !password) {
    throw new Error("E2E_CLERK_EMAIL and E2E_CLERK_PASSWORD must be set to run E2E auth setup");
  }

  const browser = await chromium.launch();
  const page = await browser.newPage({ baseURL });

  await page.goto("/sign-in");
  await page.getByLabel("Email address").fill(email);
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Continue" }).click();
  await page.waitForURL(baseURL);

  await page.context().storageState({ path: "e2e/.auth/user.json" });
  await browser.close();
}

export default globalSetup;
