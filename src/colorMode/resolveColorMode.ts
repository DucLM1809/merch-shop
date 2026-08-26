export type ColorMode = "light" | "dark";

const COLOR_MODES: readonly ColorMode[] = ["light", "dark"];

export function isColorMode(value: string | undefined): value is ColorMode {
  return value !== undefined && (COLOR_MODES as readonly string[]).includes(value);
}

/** What a color mode can be inferred from when nothing chose one explicitly. */
export type ColorModeHints = {
  cookie?: string;
};

/**
 * The mode a request should render in before any client-side OS-preference check can run.
 * An explicit cookie wins; otherwise dark — the same default this app rendered
 * unconditionally before light mode existed. There is no server-side equivalent of
 * `Accept-Language` here: `prefers-color-scheme` has no reliable request header in this
 * app (see `colorModeHints.ts`), so a first-ever visit always resolves dark server-side
 * and corrects client-side once `matchMedia` is available.
 */
export function resolveColorMode({ cookie }: ColorModeHints): ColorMode {
  return isColorMode(cookie) ? cookie : "dark";
}
