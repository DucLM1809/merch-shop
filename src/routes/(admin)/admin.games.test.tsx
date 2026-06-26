import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor, fireEvent } from "@testing-library/react";
import { http, HttpResponse } from "msw";

import { renderRoute } from "../../test-utils";
import { server } from "../../mocks/server";
import { BASE_URL } from "../../api/client";

import type { Game, Publisher } from "../../api/types";

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

const mockPublishers: Publisher[] = [
  { id: "riot", slug: "riot", name: "Riot Games", accentColor: "#d13639", games: [] },
];

const twoGames: Game[] = [
  { id: "lol", slug: "league-of-legends", name: "League of Legends", publisherId: "riot" },
  { id: "val", slug: "valorant", name: "Valorant", publisherId: "riot" },
];

beforeEach(() => {
  vi.clearAllMocks();
  server.use(http.get(`${BASE_URL}/publishers`, () => HttpResponse.json(mockPublishers)));
});

describe("/admin/games", () => {
  it("redirects unauthenticated user to /sign-in", async () => {
    mockUseAuth.mockReturnValue({ isLoaded: true, isSignedIn: false });
    mockUseUser.mockReturnValue({ user: null });
    const { router } = renderRoute("/admin/games");
    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/sign-in");
    });
  });

  it("redirects signed-in non-admin to /", async () => {
    mockUseAuth.mockReturnValue({ isLoaded: true, isSignedIn: true });
    mockUseUser.mockReturnValue({ user: buyerUser });
    const { router } = renderRoute("/admin/games");
    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/");
    });
  });

  it("renders game rows for admin user", async () => {
    mockUseAuth.mockReturnValue({ isLoaded: true, isSignedIn: true });
    mockUseUser.mockReturnValue({ user: adminUser });
    server.use(http.get(`${BASE_URL}/games`, () => HttpResponse.json(twoGames)));

    renderRoute("/admin/games");

    expect(await screen.findByText("League of Legends")).toBeInTheDocument();
    expect(screen.getByText("valorant")).toBeInTheDocument();
  });

  it("shows empty state when no games", async () => {
    mockUseAuth.mockReturnValue({ isLoaded: true, isSignedIn: true });
    mockUseUser.mockReturnValue({ user: adminUser });
    server.use(http.get(`${BASE_URL}/games`, () => HttpResponse.json([])));

    renderRoute("/admin/games");

    expect(await screen.findByText(/no games yet/i)).toBeInTheDocument();
  });

  it("create form fires POST /games", async () => {
    mockUseAuth.mockReturnValue({ isLoaded: true, isSignedIn: true });
    mockUseUser.mockReturnValue({ user: adminUser });
    server.use(http.get(`${BASE_URL}/games`, () => HttpResponse.json([])));

    let posted = false;
    server.use(
      http.post(`${BASE_URL}/games`, async () => {
        posted = true;
        const created: Game = {
          id: "new",
          slug: "new-game",
          name: "New Game",
          publisherId: "riot",
        };
        return HttpResponse.json(created, { status: 201 });
      })
    );

    renderRoute("/admin/games");

    fireEvent.click(await screen.findByText("+ New Game"));
    fireEvent.change(screen.getByPlaceholderText("Name"), { target: { value: "New Game" } });
    fireEvent.change(screen.getByPlaceholderText("Slug (e.g. league-of-legends)"), {
      target: { value: "new-game" },
    });
    fireEvent.change(screen.getByDisplayValue("Publisher…"), { target: { value: "riot" } });
    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => expect(posted).toBe(true));
  });

  it("edit form fires PATCH /games/:id", async () => {
    mockUseAuth.mockReturnValue({ isLoaded: true, isSignedIn: true });
    mockUseUser.mockReturnValue({ user: adminUser });
    server.use(http.get(`${BASE_URL}/games`, () => HttpResponse.json(twoGames)));

    let patched = false;
    server.use(
      http.patch(`${BASE_URL}/games/:id`, async () => {
        patched = true;
        return HttpResponse.json(twoGames[0]);
      })
    );

    renderRoute("/admin/games");

    const editBtns = await screen.findAllByText("Edit");
    fireEvent.click(editBtns[0]);
    fireEvent.change(screen.getByDisplayValue("League of Legends"), {
      target: { value: "League of Legends Updated" },
    });
    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => expect(patched).toBe(true));
  });

  it("delete fires DELETE /games/:id", async () => {
    mockUseAuth.mockReturnValue({ isLoaded: true, isSignedIn: true });
    mockUseUser.mockReturnValue({ user: adminUser });
    server.use(http.get(`${BASE_URL}/games`, () => HttpResponse.json(twoGames)));

    let deleted = false;
    server.use(
      http.delete(`${BASE_URL}/games/:id`, () => {
        deleted = true;
        return HttpResponse.json({ ok: true });
      })
    );

    renderRoute("/admin/games");

    const deleteBtns = await screen.findAllByText("Delete");
    fireEvent.click(deleteBtns[0]);
    fireEvent.click(screen.getByText("Confirm"));

    await waitFor(() => expect(deleted).toBe(true));
  });
});
