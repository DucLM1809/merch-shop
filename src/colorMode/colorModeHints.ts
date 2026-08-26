import { createIsomorphicFn } from "@tanstack/react-start";

import { COLOR_MODE_COOKIE_NAME, readColorModeCookie } from "./colorModeCookie";

import type { ColorModeHints } from "./resolveColorMode";

/**
 * The color-mode hints the current environment can offer. On the server they come off the
 * request's cookie header, so a document response already carries the right class; on the
 * client (a client-side navigation, or a test) the browser's cookie jar stands in.
 * `createIsomorphicFn` lets the Start compiler strip the server branch from the client
 * bundle entirely, mirroring `../i18n/localeHints.ts`.
 */
export const readColorModeHints = createIsomorphicFn()
  .server(async (): Promise<ColorModeHints> => {
    const { getCookie } = await import("@tanstack/react-start/server");

    return { cookie: getCookie(COLOR_MODE_COOKIE_NAME) };
  })
  .client(async (): Promise<ColorModeHints> => ({ cookie: readColorModeCookie() }));
