import { describe, it, expect } from "vitest";

import { dateLocaleOf, formatDate } from "./formatDate";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "./locales";

// Same stance as `formatPrice.test.ts`: CLDR revises date patterns between ICU versions, so
// what's asserted is the promise — a date each locale can read unambiguously — rather than a
// literal string that would turn this into a report on the Node build.

const ORDER_PLACED = "2024-01-15T10:00:00Z";

describe("formatDate", () => {
  it("spells the month out rather than leaving a bare number", () => {
    const formatted = formatDate(ORDER_PLACED, "en-US");

    expect(formatted).toContain("2024");
    expect(formatted).toContain("15");
    // A purely numeric date would read as 1/15 to one locale and 15/1 to another.
    expect(formatted).toMatch(/\p{L}/u);
  });

  it("names the month in the locale's own language", () => {
    const french = formatDate(ORDER_PLACED, "fr-FR");
    const american = formatDate(ORDER_PLACED, "en-US");

    expect(french).toContain("2024");
    expect(french).not.toBe(american);
  });

  it("orders the parts the way each locale does", () => {
    const american = formatDate(ORDER_PLACED, "en-US");
    const british = formatDate(ORDER_PLACED, "en-GB");

    // Both English, but the US leads with the month and the UK leads with the day.
    expect(american).not.toBe(british);
    expect(british.indexOf("15")).toBeLessThan(british.indexOf("2024"));
  });

  it("renders every supported locale without throwing", () => {
    for (const locale of SUPPORTED_LOCALES) {
      expect(formatDate(ORDER_PLACED, locale)).toBeTruthy();
    }
  });
});

describe("dateLocaleOf", () => {
  it("passes a supported language through", () => {
    expect(dateLocaleOf("fr-FR")).toBe("fr-FR");
  });

  it("falls back to the default locale for a language we don't serve", () => {
    expect(dateLocaleOf("fr")).toBe(DEFAULT_LOCALE);
    expect(dateLocaleOf("de-DE")).toBe(DEFAULT_LOCALE);
    expect(dateLocaleOf("")).toBe(DEFAULT_LOCALE);
  });
});
