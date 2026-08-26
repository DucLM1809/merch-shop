import { useEffect, useState } from "react";
import { useStore } from "@tanstack/react-store";

import { colorModeStore, setPreferredColorMode, setSystemColorMode } from "../store/colorMode";

import type { ColorMode } from "./resolveColorMode";

type UseColorModeResult = {
  /** The mode actually applied to the page right now. */
  mode: ColorMode;
  /** The visitor's explicit choice, or `undefined` while following the OS live ("System"). */
  preferred: ColorMode | undefined;
  setPreferredColorMode: typeof setPreferredColorMode;
  setSystemColorMode: typeof setSystemColorMode;
};

/**
 * The color mode to render, plus the setters that change it.
 *
 * `ssrColorMode` seeds the first client render so it matches what the server already sent
 * (an explicit cookie, or dark by default — see `resolveColorMode`). From there, while
 * following the OS ("System", `preferred === undefined`), a `matchMedia` listener keeps
 * `mode` live for as long as the visitor hasn't overridden it — this is a live subscription,
 * not a one-time check, per this app's System toggle behavior.
 */
export function useColorMode(ssrColorMode: ColorMode): UseColorModeResult {
  const preferred = useStore(colorModeStore, (state) => state.preferred);
  const [osColorMode, setOsColorMode] = useState<ColorMode>(ssrColorMode);

  useEffect(() => {
    if (preferred !== undefined) return;

    const query = window.matchMedia("(prefers-color-scheme: light)");
    const applyFromQuery = (matches: boolean): void => setOsColorMode(matches ? "light" : "dark");

    applyFromQuery(query.matches);

    const handleChange = (event: MediaQueryListEvent): void => applyFromQuery(event.matches);
    query.addEventListener("change", handleChange);

    return () => query.removeEventListener("change", handleChange);
  }, [preferred]);

  return {
    mode: preferred ?? osColorMode,
    preferred,
    setPreferredColorMode,
    setSystemColorMode,
  };
}
