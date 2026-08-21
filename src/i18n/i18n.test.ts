import { describe, expect, it } from "vitest";

import enUS from "./locales/en-US/common.json";
import frFR from "./locales/fr-FR/common.json";
import { getI18n } from "./i18n";

function interpolate(template: string, count: number): string {
  return template.replace("{{count}}", String(count));
}

describe("getI18n", () => {
  it("resolves a key against the requested locale's resources", () => {
    expect(getI18n("fr-FR").t("nav.cart")).toBe(frFR.nav.cart);
    expect(getI18n("en-US").t("nav.cart")).toBe(enUS.nav.cart);
  });

  it("hands out one instance per locale", () => {
    expect(getI18n("fr-FR")).toBe(getI18n("fr-FR"));
    expect(getI18n("fr-FR")).not.toBe(getI18n("en-GB"));
  });

  it("keeps every instance pinned to its own language", () => {
    // What makes sharing instances across SSR requests safe: asking for one locale can't
    // move another locale's instance off its language.
    const french = getI18n("fr-FR");

    expect(getI18n("en-GB").language).toBe("en-GB");
    expect(french.language).toBe("fr-FR");
  });

  it("picks the plural form the locale's own rules call for", () => {
    // French counts 0 as singular, English doesn't — the rule comes from the locale, not
    // from a hand-written branch at the call site.
    expect(getI18n("fr-FR").t("nav.cartItems", { count: 0 })).toBe(
      interpolate(frFR.nav.cartItems_one, 0)
    );
    expect(getI18n("en-US").t("nav.cartItems", { count: 0 })).toBe(
      interpolate(enUS.nav.cartItems_other, 0)
    );
    expect(getI18n("fr-FR").t("nav.cartItems", { count: 3 })).toBe(
      interpolate(frFR.nav.cartItems_other, 3)
    );
  });
});

// These assert against the type checker, not the runtime: `@ts-expect-error` fails
// `tsc --noEmit` if the line it guards ever stops being an error. The expectations below
// only pin down what happens if such a call slips through at runtime.
describe("translation key types", () => {
  const { t } = getI18n("en-US");

  it("rejects a key no locale file declares", () => {
    // @ts-expect-error -- "nav.basket" is not a key in en-US/common.json
    expect(t("nav.basket")).toBe("nav.basket");
  });

  it("rejects interpolation data that doesn't match the copy", () => {
    // A non-numeric count picks no plural form at all, so this degrades to the same bare
    // key an unknown lookup gives — invisible without the compile error below.
    // @ts-expect-error -- the `{{count}}` placeholder interpolates a number
    expect(t("nav.cartItems", { count: "three" })).toBe("nav.cartItems");
  });
});
