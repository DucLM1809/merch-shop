import "@testing-library/jest-dom/vitest";
import { vi, afterAll, afterEach, beforeAll } from "vitest";
import { cleanup, configure } from "@testing-library/react";
import { server } from "./mocks/server";

configure({ asyncUtilTimeout: 5000 });

vi.mock("@clerk/react", () => ({
  ClerkProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useAuth: vi.fn(() => ({ isLoaded: true, isSignedIn: false })),
  useUser: vi.fn(() => ({ user: null })),
  useClerk: vi.fn(() => ({ signOut: vi.fn() })),
  SignIn: ({ fallbackRedirectUrl }: { fallbackRedirectUrl?: string }) => (
    <div data-testid="clerk-sign-in" data-redirect-url={fallbackRedirectUrl ?? ""}>
      Sign In Form
    </div>
  ),
  SignUp: ({ fallbackRedirectUrl }: { fallbackRedirectUrl?: string }) => (
    <div data-testid="clerk-sign-up" data-redirect-url={fallbackRedirectUrl ?? ""}>
      Sign Up Form
    </div>
  ),
}));

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => {
  server.resetHandlers();
  cleanup();
});
afterAll(() => server.close());
