import { describe, it, expect } from "vitest";

import { isColorMode, resolveColorMode } from "./resolveColorMode";

describe("resolveColorMode", () => {
  it("uses the cookie when it names a real color mode", () => {
    expect(resolveColorMode({ cookie: "light" })).toBe("light");
    expect(resolveColorMode({ cookie: "dark" })).toBe("dark");
  });

  it("falls back to dark when there is no cookie", () => {
    expect(resolveColorMode({})).toBe("dark");
  });

  it("falls back to dark when the cookie names something we don't serve", () => {
    expect(resolveColorMode({ cookie: "system" })).toBe("dark");
    expect(resolveColorMode({ cookie: "blue" })).toBe("dark");
    expect(resolveColorMode({ cookie: "" })).toBe("dark");
  });
});

describe("isColorMode", () => {
  it("recognizes the two real modes", () => {
    expect(isColorMode("light")).toBe(true);
    expect(isColorMode("dark")).toBe(true);
  });

  it("rejects everything else, including the System sentinel and undefined", () => {
    expect(isColorMode("system")).toBe(false);
    expect(isColorMode(undefined)).toBe(false);
    expect(isColorMode("")).toBe(false);
  });
});
