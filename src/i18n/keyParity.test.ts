import { describe, expect, it } from "vitest";

import { DEFAULT_LOCALE } from "./locales";
import { findKeyParityGaps, formatParityGaps } from "./keyParity";
import { resources } from "./resources";

import type { LocaleResources } from "./keyParity";

const COMPLETE: LocaleResources = {
  "en-US": {
    common: {
      brand: "Merch Shop",
      nav: { cart: "Cart", signIn: "Sign in" },
    },
  },
  "en-GB": {
    common: {
      brand: "Merch Shop",
      nav: { cart: "Basket", signIn: "Sign in" },
    },
  },
};

describe("findKeyParityGaps", () => {
  it("passes clean when every locale carries every key", () => {
    expect(findKeyParityGaps(COMPLETE, DEFAULT_LOCALE)).toEqual([]);
  });

  it("reports a key the default locale has and another locale doesn't", () => {
    const bundles: LocaleResources = {
      ...COMPLETE,
      "en-GB": { common: { brand: "Merch Shop", nav: { cart: "Basket" } } },
    };

    expect(findKeyParityGaps(bundles, DEFAULT_LOCALE)).toEqual([
      { locale: "en-GB", namespace: "common", key: "nav.signIn" },
    ]);
    expect(formatParityGaps(findKeyParityGaps(bundles, DEFAULT_LOCALE))).toContain("nav.signIn");
  });

  it("reports every key of a namespace a locale is missing entirely", () => {
    const bundles: LocaleResources = { ...COMPLETE, "en-GB": {} };

    expect(findKeyParityGaps(bundles, DEFAULT_LOCALE).map((gap) => gap.key)).toEqual([
      "brand",
      "nav.cart",
      "nav.signIn",
    ]);
  });

  it("asks each locale only for the plural forms its own rules require", () => {
    // English needs one/other; French also needs `many`. A locale is judged against its
    // own plural rules, not against the shape of the default locale's key set.
    const bundles: LocaleResources = {
      "en-US": { common: { items_one: "1 item", items_other: "{{count}} items" } },
      "fr-FR": {
        common: { items_one: "{{count}} article", items_other: "{{count}} articles" },
      },
    };

    expect(findKeyParityGaps(bundles, DEFAULT_LOCALE)).toEqual([
      { locale: "fr-FR", namespace: "common", key: "items", pluralCategory: "many" },
    ]);
  });

  it("accepts a locale that supplies every plural form it needs", () => {
    const bundles: LocaleResources = {
      "en-US": { common: { items_one: "1 item", items_other: "{{count}} items" } },
      "fr-FR": {
        common: {
          items_one: "{{count}} article",
          items_many: "{{count}} articles",
          items_other: "{{count}} articles",
        },
      },
    };

    expect(findKeyParityGaps(bundles, DEFAULT_LOCALE)).toEqual([]);
  });

  it("refuses to run without the default locale to compare against", () => {
    expect(() => findKeyParityGaps({ "fr-FR": { common: {} } }, DEFAULT_LOCALE)).toThrow(
      /default locale/
    );
  });
});

describe("the resources this app ships", () => {
  it("has no key parity gaps", () => {
    // The same check CI runs, against the bundle that actually reaches a visitor — so a
    // half-translated namespace fails here too, not only on the CI script.
    expect(formatParityGaps(findKeyParityGaps(resources, DEFAULT_LOCALE))).toBe("");
  });
});
