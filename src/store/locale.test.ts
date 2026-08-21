import { describe, it, expect, afterEach, vi } from "vitest";

import { LOCALE_COOKIE_NAME } from "../i18n/localeCookie";

/**
 * The store reads the cookie once, at module load, so each case here re-imports it with a
 * cookie already in place rather than mutating an instance that has settled.
 */
async function loadStore(cookie?: string) {
  if (cookie !== undefined) document.cookie = `${LOCALE_COOKIE_NAME}=${cookie}`;
  vi.resetModules();

  return import("./locale");
}

afterEach(() => {
  document.cookie = `${LOCALE_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
});

describe("localeStore", () => {
  it("starts with no preference when nothing has been chosen", async () => {
    const { localeStore } = await loadStore();

    expect(localeStore.state.preferred).toBeUndefined();
  });

  it("picks up a preference left by an earlier visit", async () => {
    const { localeStore } = await loadStore("fr-FR");

    expect(localeStore.state.preferred).toBe("fr-FR");
  });

  it("treats a locale it no longer serves as no preference at all", async () => {
    // A dropped locale, or a hand-edited cookie — better to re-detect than to hold a
    // value nothing downstream can use.
    const { localeStore } = await loadStore("de-DE");

    expect(localeStore.state.preferred).toBeUndefined();
  });

  it("writes the choice back to the cookie the server reads", async () => {
    const { localeStore, setPreferredLocale } = await loadStore();

    setPreferredLocale("en-GB");

    expect(localeStore.state.preferred).toBe("en-GB");
    expect(document.cookie).toContain(`${LOCALE_COOKIE_NAME}=en-GB`);
  });
});
