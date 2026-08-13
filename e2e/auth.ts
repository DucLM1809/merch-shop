import type { Page } from "@playwright/test";

export async function signIn(page: Page, email: string, password: string): Promise<void> {
  await page.goto("/sign-in");

  // The SSR'd form exists in the DOM before React finishes hydrating and attaching its
  // submit handler, so a click that lands too early falls through to a native GET submit
  // (URL grows an ?email=&password= query string instead of navigating past /sign-in).
  // Retry through that window rather than guessing at a fixed hydration delay.
  for (let attempt = 1; attempt <= 5; attempt++) {
    if (page.url().includes("?email=")) {
      await page.goto("/sign-in");
    }

    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password").fill(password);

    // Attached before the click so it catches the response even if the click resolves
    // first; only settles when a POST actually fires, which a hydration-race attempt
    // (native GET submit, no handler attached yet) never produces.
    const loginResponse = page
      .waitForResponse(
        (res) => res.url().includes("/auth/login") && res.request().method() === "POST"
      )
      .catch(() => undefined);

    await page.getByRole("button", { name: "Sign in" }).click();

    try {
      await page.waitForURL((url) => url.pathname !== "/sign-in" && !url.search, {
        timeout: 3000,
      });
      return;
    } catch {
      // By now any POST /auth/login that actually fired has long since resolved, so this
      // is just draining the already-settled promise, not adding a real wait.
      const response = await Promise.race([
        loginResponse,
        new Promise<undefined>((resolve) => setTimeout(() => resolve(undefined), 50)),
      ]);
      if (response?.status() === 429) {
        throw new Error(
          "Sign-in failed: POST /auth/login returned 429 (rate limited), not a hydration timeout. " +
            "Wait for the 60s rate-limit window to clear before rerunning."
        );
      }
      if (attempt === 5) throw new Error("Sign-in form never hydrated after 5 attempts.");
    }
  }
}
