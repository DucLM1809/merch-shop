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
    await page.getByRole("button", { name: "Sign in" }).click();

    try {
      await page.waitForURL((url) => url.pathname !== "/sign-in" && !url.search, {
        timeout: 3000,
      });
      return;
    } catch {
      if (attempt === 5) throw new Error("Sign-in form never hydrated after 5 attempts.");
    }
  }
}
