import { describe, it, expect } from "vitest";

import { DEFAULT_LOCALE } from "./locales";
import {
  isLocaleSegment,
  parseAcceptLanguage,
  resolveLocale,
  withLocalePrefix,
} from "./resolveLocale";

describe("resolveLocale", () => {
  it("prefers the cookie over the Accept-Language header", () => {
    expect(resolveLocale({ cookie: "fr-FR", acceptLanguage: "en-GB,en;q=0.9" })).toBe("fr-FR");
  });

  it("falls back to the Accept-Language header when there is no cookie", () => {
    expect(resolveLocale({ acceptLanguage: "en-GB,en;q=0.9" })).toBe("en-GB");
  });

  it("falls back to the default locale when neither hint is usable", () => {
    expect(resolveLocale({})).toBe(DEFAULT_LOCALE);
    expect(resolveLocale({ cookie: "de-DE", acceptLanguage: "de-DE,ja;q=0.8" })).toBe(
      DEFAULT_LOCALE
    );
  });

  it("takes the highest-quality supported tag from the header, not the first one", () => {
    expect(resolveLocale({ acceptLanguage: "de-DE,fr-FR;q=0.9,en-GB;q=0.4" })).toBe("fr-FR");
  });

  it("matches a language-only tag to a locale we serve", () => {
    expect(resolveLocale({ cookie: "fr" })).toBe("fr-FR");
    expect(resolveLocale({ acceptLanguage: "fr" })).toBe("fr-FR");
  });

  it("ignores casing in a tag", () => {
    expect(resolveLocale({ cookie: "FR-fr" })).toBe("fr-FR");
  });
});

describe("parseAcceptLanguage", () => {
  it("orders tags by quality, keeping header order within a quality", () => {
    expect(parseAcceptLanguage("en-US;q=0.8,fr-FR,en-GB")).toEqual(["fr-FR", "en-GB", "en-US"]);
  });

  it("drops the wildcard and zero-quality tags", () => {
    expect(parseAcceptLanguage("*,en-GB;q=0")).toEqual([]);
  });

  it("returns nothing for a missing header", () => {
    expect(parseAcceptLanguage(undefined)).toEqual([]);
  });
});

describe("isLocaleSegment", () => {
  it("recognizes tag-shaped segments", () => {
    expect(isLocaleSegment("en-US")).toBe(true);
    expect(isLocaleSegment("de-DE")).toBe(true);
    expect(isLocaleSegment("fr")).toBe(true);
  });

  it("does not mistake a short publisher slug for a locale", () => {
    expect(isLocaleSegment("ea")).toBe(false);
    expect(isLocaleSegment("cart")).toBe(false);
    expect(isLocaleSegment("t1")).toBe(false);
  });
});

describe("withLocalePrefix", () => {
  it("prefixes a path that has no locale segment", () => {
    expect(withLocalePrefix("/cart", "en-GB")).toBe("/en-GB/cart");
    expect(withLocalePrefix("/ea/apex/products/hoodie", "en-GB")).toBe(
      "/en-GB/ea/apex/products/hoodie"
    );
  });

  it("replaces a locale segment we don't serve", () => {
    expect(withLocalePrefix("/de-DE/cart", "fr-FR")).toBe("/fr-FR/cart");
  });

  it("maps the bare root onto the locale root", () => {
    expect(withLocalePrefix("/", "fr-FR")).toBe("/fr-FR");
  });
});
