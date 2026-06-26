import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor, fireEvent } from "@testing-library/react";
import { http, HttpResponse } from "msw";

import { renderRoute } from "../../test-utils";
import { server } from "../../mocks/server";
import { BASE_URL } from "../../api/client";

import type { Game, Team } from "../../api/types";

vi.mock("@clerk/react", () => ({
  ClerkProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useAuth: vi.fn(),
  useUser: vi.fn(),
  useClerk: vi.fn(() => ({ signOut: vi.fn() })),
  SignIn: () => <div data-testid="clerk-sign-in">Sign In Form</div>,
  SignUp: () => <div data-testid="clerk-sign-up">Sign Up Form</div>,
}));

import { useAuth, useUser } from "@clerk/react";
const mockUseAuth = useAuth as ReturnType<typeof vi.fn>;
const mockUseUser = useUser as ReturnType<typeof vi.fn>;

const adminUser = {
  firstName: "Admin",
  emailAddresses: [{ emailAddress: "admin@test.com" }],
  publicMetadata: { role: "admin" },
};

const buyerUser = {
  firstName: "Buyer",
  emailAddresses: [{ emailAddress: "buyer@test.com" }],
  publicMetadata: { role: "buyer" },
};

const mockGames: Game[] = [
  { id: "lol", slug: "league-of-legends", name: "League of Legends", publisherId: "riot" },
];

const twoTeams: Team[] = [
  { id: "t1", slug: "t1", name: "T1", gameId: "lol" },
  { id: "c9", slug: "cloud9", name: "Cloud9", gameId: "lol" },
];

beforeEach(() => {
  vi.clearAllMocks();
  server.use(http.get(`${BASE_URL}/games`, () => HttpResponse.json(mockGames)));
});

describe("/admin/teams", () => {
  it("redirects unauthenticated user to /sign-in", async () => {
    mockUseAuth.mockReturnValue({ isLoaded: true, isSignedIn: false });
    mockUseUser.mockReturnValue({ user: null });
    const { router } = renderRoute("/admin/teams");
    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/sign-in");
    });
  });

  it("redirects signed-in non-admin to /", async () => {
    mockUseAuth.mockReturnValue({ isLoaded: true, isSignedIn: true });
    mockUseUser.mockReturnValue({ user: buyerUser });
    const { router } = renderRoute("/admin/teams");
    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/");
    });
  });

  it("renders team rows for admin user", async () => {
    mockUseAuth.mockReturnValue({ isLoaded: true, isSignedIn: true });
    mockUseUser.mockReturnValue({ user: adminUser });
    server.use(http.get(`${BASE_URL}/teams`, () => HttpResponse.json(twoTeams)));

    renderRoute("/admin/teams");

    expect(await screen.findByText("T1")).toBeInTheDocument();
    expect(screen.getByText("cloud9")).toBeInTheDocument();
  });

  it("shows empty state when no teams", async () => {
    mockUseAuth.mockReturnValue({ isLoaded: true, isSignedIn: true });
    mockUseUser.mockReturnValue({ user: adminUser });
    server.use(http.get(`${BASE_URL}/teams`, () => HttpResponse.json([])));

    renderRoute("/admin/teams");

    expect(await screen.findByText(/no teams yet/i)).toBeInTheDocument();
  });

  it("create form fires POST /teams", async () => {
    mockUseAuth.mockReturnValue({ isLoaded: true, isSignedIn: true });
    mockUseUser.mockReturnValue({ user: adminUser });
    server.use(http.get(`${BASE_URL}/teams`, () => HttpResponse.json([])));

    let posted = false;
    server.use(
      http.post(`${BASE_URL}/teams`, async () => {
        posted = true;
        const created: Team = { id: "new", slug: "new-team", name: "New Team", gameId: "lol" };
        return HttpResponse.json(created, { status: 201 });
      })
    );

    renderRoute("/admin/teams");

    fireEvent.click(await screen.findByText("+ New Team"));
    fireEvent.change(screen.getByPlaceholderText("Name"), { target: { value: "New Team" } });
    fireEvent.change(screen.getByPlaceholderText("Slug (e.g. cloud9)"), {
      target: { value: "new-team" },
    });
    fireEvent.change(screen.getByDisplayValue("Game…"), { target: { value: "lol" } });
    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => expect(posted).toBe(true));
  });

  it("edit form fires PATCH /teams/:id", async () => {
    mockUseAuth.mockReturnValue({ isLoaded: true, isSignedIn: true });
    mockUseUser.mockReturnValue({ user: adminUser });
    server.use(http.get(`${BASE_URL}/teams`, () => HttpResponse.json(twoTeams)));

    let patched = false;
    server.use(
      http.patch(`${BASE_URL}/teams/:id`, async () => {
        patched = true;
        return HttpResponse.json(twoTeams[0]);
      })
    );

    renderRoute("/admin/teams");

    const editBtns = await screen.findAllByText("Edit");
    fireEvent.click(editBtns[0]);
    fireEvent.change(screen.getByDisplayValue("T1"), { target: { value: "T1 Updated" } });
    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => expect(patched).toBe(true));
  });

  it("delete fires DELETE /teams/:id", async () => {
    mockUseAuth.mockReturnValue({ isLoaded: true, isSignedIn: true });
    mockUseUser.mockReturnValue({ user: adminUser });
    server.use(http.get(`${BASE_URL}/teams`, () => HttpResponse.json(twoTeams)));

    let deleted = false;
    server.use(
      http.delete(`${BASE_URL}/teams/:id`, () => {
        deleted = true;
        return HttpResponse.json({ ok: true });
      })
    );

    renderRoute("/admin/teams");

    const deleteBtns = await screen.findAllByText("Delete");
    fireEvent.click(deleteBtns[0]);
    fireEvent.click(screen.getByText("Confirm"));

    await waitFor(() => expect(deleted).toBe(true));
  });
});
