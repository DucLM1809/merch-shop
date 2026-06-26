import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { renderRoute } from "../../test-utils";

// Mock Clerk — provide both signed-in and signed-out states
vi.mock("@clerk/react", () => ({
  ClerkProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useAuth: vi.fn(),
  useUser: vi.fn(),
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

import { useAuth, useUser } from "@clerk/react";

const mockUseAuth = useAuth as ReturnType<typeof vi.fn>;
const mockUseUser = useUser as ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GlobalNav auth state", () => {
  it("shows sign-in and sign-up links when guest", async () => {
    mockUseAuth.mockReturnValue({ isLoaded: true, isSignedIn: false });
    mockUseUser.mockReturnValue({ user: null });

    renderRoute("/");

    expect(await screen.findByTestId("nav-guest-links")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /sign up/i })).toBeInTheDocument();
    expect(screen.queryByTestId("nav-account-menu")).not.toBeInTheDocument();
  });

  it("shows account menu and hides guest links when signed in", async () => {
    mockUseAuth.mockReturnValue({ isLoaded: true, isSignedIn: true });
    mockUseUser.mockReturnValue({
      user: {
        firstName: "Faker",
        emailAddresses: [{ emailAddress: "faker@t1.gg" }],
      },
    });

    renderRoute("/");

    expect(await screen.findByTestId("nav-account-menu")).toBeInTheDocument();
    expect(screen.getByText("Faker")).toBeInTheDocument();
    expect(screen.queryByTestId("nav-guest-links")).not.toBeInTheDocument();
  });
});

describe("/sign-in route", () => {
  it("renders Clerk SignIn component", async () => {
    mockUseAuth.mockReturnValue({ isLoaded: true, isSignedIn: false });
    mockUseUser.mockReturnValue({ user: null });

    renderRoute("/sign-in");

    expect(await screen.findByTestId("clerk-sign-in")).toBeInTheDocument();
  });

  it("passes fallbackRedirectUrl=/ to SignIn", async () => {
    mockUseAuth.mockReturnValue({ isLoaded: true, isSignedIn: false });
    mockUseUser.mockReturnValue({ user: null });

    renderRoute("/sign-in");

    expect(await screen.findByTestId("clerk-sign-in")).toHaveAttribute("data-redirect-url", "/");
  });

  it("redirects to / when already signed in", async () => {
    mockUseAuth.mockReturnValue({ isLoaded: true, isSignedIn: true });
    mockUseUser.mockReturnValue({
      user: { firstName: "Faker", emailAddresses: [{ emailAddress: "faker@t1.gg" }] },
    });

    const { router } = renderRoute("/sign-in");

    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/");
    });
  });
});

describe("/sign-up route", () => {
  it("renders Clerk SignUp component", async () => {
    mockUseAuth.mockReturnValue({ isLoaded: true, isSignedIn: false });
    mockUseUser.mockReturnValue({ user: null });

    renderRoute("/sign-up");

    expect(await screen.findByTestId("clerk-sign-up")).toBeInTheDocument();
  });

  it("passes fallbackRedirectUrl=/ to SignUp", async () => {
    mockUseAuth.mockReturnValue({ isLoaded: true, isSignedIn: false });
    mockUseUser.mockReturnValue({ user: null });

    renderRoute("/sign-up");

    expect(await screen.findByTestId("clerk-sign-up")).toHaveAttribute("data-redirect-url", "/");
  });

  it("redirects to / when already signed in", async () => {
    mockUseAuth.mockReturnValue({ isLoaded: true, isSignedIn: true });
    mockUseUser.mockReturnValue({
      user: { firstName: "Faker", emailAddresses: [{ emailAddress: "faker@t1.gg" }] },
    });

    const { router } = renderRoute("/sign-up");

    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/");
    });
  });
});
