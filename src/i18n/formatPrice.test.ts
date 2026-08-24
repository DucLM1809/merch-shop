import { describe, it, expect } from "vitest";

import { formatPrice, priceLocaleOf, PRICE_CURRENCY } from "./formatPrice";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "./locales";

// The expected strings aren't spelled out literally: CLDR revises currency spacing and
// symbol choices between ICU versions, and pinning `"59,99 $US"` would make this test a
// report on the Node build rather than on our formatting. What's asserted instead is what
// we actually promise — a per-locale rendering of an amount that stays in USD.

describe("formatPrice", () => {
  it("formats the default locale with a leading dollar sign and a dot decimal", () => {
    expect(formatPrice(59.99, "en-US")).toBe("$59.99");
  });

  it("keeps two decimal places for a whole amount", () => {
    expect(formatPrice(60, "en-US")).toBe("$60.00");
  });

  it("groups thousands the way each locale does", () => {
    expect(formatPrice(1234.5, "en-US")).toBe("$1,234.50");
    expect(formatPrice(1234.5, "en-GB")).toBe("US$1,234.50");
  });

  it("gives French a comma decimal separator and a trailing symbol", () => {
    const formatted = formatPrice(59.99, "fr-FR");

    expect(formatted).toContain("59,99");
    expect(formatted).not.toContain("59.99");
    expect(formatted.indexOf("59,99")).toBeLessThan(formatted.length - "59,99".length);
  });

  it("stays USD-denominated in every locale — it formats, it does not convert", () => {
    for (const locale of SUPPORTED_LOCALES) {
      const parts = new Intl.NumberFormat(locale, {
        style: "currency",
        currency: PRICE_CURRENCY,
      }).formatToParts(59.99);

      expect(parts.find((part) => part.type === "integer")?.value).toBe("59");
      expect(formatPrice(59.99, locale)).toContain(
        parts.find((part) => part.type === "currency")?.value ?? ""
      );
    }
  });

  it("renders every supported locale without throwing", () => {
    for (const locale of SUPPORTED_LOCALES) {
      expect(formatPrice(0, locale)).toBeTruthy();
    }
  });
});

describe("priceLocaleOf", () => {
  it("passes a supported language through", () => {
    expect(priceLocaleOf("fr-FR")).toBe("fr-FR");
  });

  it("falls back to the default locale for a language we don't serve", () => {
    // i18next hands back whatever it resolved, including a bare `fr` or a locale that only
    // exists as a fallback — none of which should reach `Intl` as our formatting locale.
    expect(priceLocaleOf("fr")).toBe(DEFAULT_LOCALE);
    expect(priceLocaleOf("de-DE")).toBe(DEFAULT_LOCALE);
    expect(priceLocaleOf("")).toBe(DEFAULT_LOCALE);
  });
});
