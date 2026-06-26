import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor, fireEvent } from "@testing-library/react";
import { http, HttpResponse } from "msw";

import { renderRoute } from "../../test-utils";
import { server } from "../../mocks/server";
import { BASE_URL } from "../../api/client";

import type { Character, Game } from "../../api/types";

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

const twoCharacters: Character[] = [
  { id: "jinx", slug: "jinx", name: "Jinx", gameId: "lol" },
  { id: "azir", slug: "azir", name: "Azir", gameId: "lol" },
];

beforeEach(() => {
  vi.clearAllMocks();
  server.use(http.get(`${BASE_URL}/games`, () => HttpResponse.json(mockGames)));
});

describe("/admin/characters", () => {
  it("redirects unauthenticated user to /sign-in", async () => {
    mockUseAuth.mockReturnValue({ isLoaded: true, isSignedIn: false });
    mockUseUser.mockReturnValue({ user: null });
    const { router } = renderRoute("/admin/characters");
    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/sign-in");
    });
  });

  it("redirects signed-in non-admin to /", async () => {
    mockUseAuth.mockReturnValue({ isLoaded: true, isSignedIn: true });
    mockUseUser.mockReturnValue({ user: buyerUser });
    const { router } = renderRoute("/admin/characters");
    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/");
    });
  });

  it("renders character rows for admin user", async () => {
    mockUseAuth.mockReturnValue({ isLoaded: true, isSignedIn: true });
    mockUseUser.mockReturnValue({ user: adminUser });
    server.use(http.get(`${BASE_URL}/characters`, () => HttpResponse.json(twoCharacters)));

    renderRoute("/admin/characters");

    expect(await screen.findByText("Jinx")).toBeInTheDocument();
    expect(screen.getByText("azir")).toBeInTheDocument();
  });

  it("shows empty state when no characters", async () => {
    mockUseAuth.mockReturnValue({ isLoaded: true, isSignedIn: true });
    mockUseUser.mockReturnValue({ user: adminUser });
    server.use(http.get(`${BASE_URL}/characters`, () => HttpResponse.json([])));

    renderRoute("/admin/characters");

    expect(await screen.findByText(/no characters yet/i)).toBeInTheDocument();
  });

  it("create form fires POST /characters", async () => {
    mockUseAuth.mockReturnValue({ isLoaded: true, isSignedIn: true });
    mockUseUser.mockReturnValue({ user: adminUser });
    server.use(http.get(`${BASE_URL}/characters`, () => HttpResponse.json([])));

    let posted = false;
    server.use(
      http.post(`${BASE_URL}/characters`, async () => {
        posted = true;
        const created: Character = { id: "new", slug: "jinx", name: "Jinx", gameId: "lol" };
        return HttpResponse.json(created, { status: 201 });
      })
    );

    renderRoute("/admin/characters");

    fireEvent.click(await screen.findByText("+ New Character"));
    fireEvent.change(screen.getByPlaceholderText("Name"), { target: { value: "Jinx" } });
    fireEvent.change(screen.getByPlaceholderText("Slug (e.g. jinx)"), {
      target: { value: "jinx" },
    });
    fireEvent.change(screen.getByDisplayValue("Game…"), { target: { value: "lol" } });
    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => expect(posted).toBe(true));
  });

  it("edit form fires PATCH /characters/:id", async () => {
    mockUseAuth.mockReturnValue({ isLoaded: true, isSignedIn: true });
    mockUseUser.mockReturnValue({ user: adminUser });
    server.use(http.get(`${BASE_URL}/characters`, () => HttpResponse.json(twoCharacters)));

    let patched = false;
    server.use(
      http.patch(`${BASE_URL}/characters/:id`, async () => {
        patched = true;
        return HttpResponse.json(twoCharacters[0]);
      })
    );

    renderRoute("/admin/characters");

    const editBtns = await screen.findAllByText("Edit");
    fireEvent.click(editBtns[0]);
    fireEvent.change(screen.getByDisplayValue("Jinx"), { target: { value: "Jinx Updated" } });
    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => expect(patched).toBe(true));
  });

  it("delete fires DELETE /characters/:id", async () => {
    mockUseAuth.mockReturnValue({ isLoaded: true, isSignedIn: true });
    mockUseUser.mockReturnValue({ user: adminUser });
    server.use(http.get(`${BASE_URL}/characters`, () => HttpResponse.json(twoCharacters)));

    let deleted = false;
    server.use(
      http.delete(`${BASE_URL}/characters/:id`, () => {
        deleted = true;
        return HttpResponse.json({ ok: true });
      })
    );

    renderRoute("/admin/characters");

    const deleteBtns = await screen.findAllByText("Delete");
    fireEvent.click(deleteBtns[0]);
    fireEvent.click(screen.getByText("Confirm"));

    await waitFor(() => expect(deleted).toBe(true));
  });
});
