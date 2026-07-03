import axios from "axios";
import { chromium, type FullConfig } from "playwright/test";

// ponytail: app's only configured Clerk strategy is Google OAuth, which can't be
// driven headlessly in CI. Mint a sign-in token via Clerk's Backend API instead —
// bypasses the UI/strategy entirely. https://clerk.com/docs/reference/backend-api/tag/Sign-in-Tokens
async function globalSetup(config: FullConfig): Promise<void> {
  const baseURL = config.projects[0]?.use.baseURL ?? "http://localhost:3000";
  const secretKey = process.env.CLERK_SECRET_KEY;
  const userId = process.env.E2E_CLERK_TEST_USER_ID;

  if (!secretKey || !userId) {
    throw new Error(
      "CLERK_SECRET_KEY and E2E_CLERK_TEST_USER_ID must be set to run E2E auth setup"
    );
  }

  const { data } = await axios.post(
    "https://api.clerk.com/v1/sign_in_tokens",
    { user_id: userId },
    { headers: { Authorization: `Bearer ${secretKey}` } }
  );

  const browser = await chromium.launch();
  const page = await browser.newPage({ baseURL });

  await page.goto(`/sign-in?__clerk_ticket=${data.token}`);
  await page.waitForURL(baseURL);

  await page.context().storageState({ path: "e2e/.auth/user.json" });
  await browser.close();
}

export default globalSetup;
