import "@testing-library/jest-dom/vitest";
import { afterAll, afterEach, beforeAll, expect } from "vitest";
import { cleanup, configure } from "@testing-library/react";
import * as axeMatchers from "vitest-axe/matchers";
import { server } from "./mocks/server";
import { resetAuthMockState } from "./mocks/handlers";
import { authStore } from "./store/authToken";

configure({ asyncUtilTimeout: 5000 });

expect.extend(axeMatchers);

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => {
  server.resetHandlers();
  resetAuthMockState();
  authStore.setState(() => ({ accessToken: null, isLoaded: false, isSignedIn: false }));
  cleanup();
});
afterAll(() => server.close());
