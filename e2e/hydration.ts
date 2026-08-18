import type { Locator } from "@playwright/test";

// SSR'd interactive elements exist in the DOM before React finishes hydrating and
// attaching their handlers (see e2e/auth.ts and e2e/pages/GlobalNav.page.ts), so a
// click that lands too early is a no-op. Retry through that window instead of
// guessing at a fixed hydration delay.
export async function clickUntilHydrated(
  trigger: Locator,
  verify: () => Promise<void>,
  attempts = 5
): Promise<void> {
  for (let attempt = 1; attempt <= attempts; attempt++) {
    await trigger.click();
    try {
      await verify();
      return;
    } catch (error) {
      if (attempt === attempts) throw error;
    }
  }
}
