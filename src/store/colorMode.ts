import { Store } from "@tanstack/react-store";

import {
  clearColorModeCookie,
  readColorModeCookie,
  writeColorModeCookie,
} from "../theme/colorModeCookie";
import { isColorMode } from "../theme/resolveColorMode";

import type { ColorMode } from "../theme/resolveColorMode";

type ColorModeState = {
  /** A mode the visitor explicitly chose, or `undefined` to follow the OS live ("System"). */
  preferred: ColorMode | undefined;
};

function load(): ColorModeState {
  const cookie = readColorModeCookie();

  return { preferred: isColorMode(cookie) ? cookie : undefined };
}

export const colorModeStore = new Store<ColorModeState>(load());

// Mirrored to a cookie for the same reason as locale (see `./locale.ts`) — resolved
// server-side before render, so it has to travel with the next document request. Unlike
// locale, "System" is a real, re-selectable state here, not just "never chosen yet", so
// going back to it has to actively clear the cookie rather than simply never writing one.
colorModeStore.subscribe(() => {
  const { preferred } = colorModeStore.state;

  if (preferred === undefined) {
    clearColorModeCookie();
  } else {
    writeColorModeCookie(preferred);
  }
});

export function setPreferredColorMode(mode: ColorMode): void {
  colorModeStore.setState(() => ({ preferred: mode }));
}

export function setSystemColorMode(): void {
  colorModeStore.setState(() => ({ preferred: undefined }));
}
