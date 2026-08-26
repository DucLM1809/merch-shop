import "@testing-library/jest-dom/vitest";
import { afterAll, afterEach, beforeAll, expect, vi } from "vitest";
import { cleanup, configure } from "@testing-library/react";
import * as axeMatchers from "vitest-axe/matchers";
import { server } from "./mocks/server";
import { resetAuthMockState } from "./mocks/handlers";
import { authStore } from "./store/authToken";

configure({ asyncUtilTimeout: 5000 });

// The unit project runs in jsdom — a client-like environment — and skips the
// tanstackStart() Vite plugin for speed (see vite.config.ts), so createIsomorphicFn
// never gets its usual compile-time strip to a single branch. Its uncompiled fallback
// always keeps whichever `.server()` impl was registered, which would run real
// request-only code (getCookie/getRequestHeader) outside of a request. Mock it to
// resolve to the client branch, matching what jsdom represents.
vi.mock("@tanstack/react-start", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@tanstack/react-start")>();

  return {
    ...actual,
    createIsomorphicFn: () => ({
      server: () => ({
        client: (clientImpl: (...args: never[]) => unknown) => clientImpl,
      }),
    }),
  };
});

// jsdom doesn't implement `matchMedia` at all — `useColorMode`'s "System" tracking calls
// it unconditionally, which would otherwise throw inside `RootDocument` on every render.
// A fixed `matches: false` is fine for tests: it resolves to dark, the same default the
// server falls back to, so it doesn't fight the loader's own initial value.
if (typeof window !== "undefined" && !window.matchMedia) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

expect.extend(axeMatchers);

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => {
  server.resetHandlers();
  resetAuthMockState();
  authStore.setState(() => ({ accessToken: null, isLoaded: false, isSignedIn: false }));
  cleanup();
});
afterAll(() => server.close());
