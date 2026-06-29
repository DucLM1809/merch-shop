import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor, fireEvent } from "@testing-library/react";
import { http, HttpResponse } from "msw";

import { renderRoute } from "../../test-utils";
import { server } from "../../mocks/server";
import { BASE_URL } from "../../api/client";

import type { Game, Publisher } from "../../api/types";

import { useAuth, useUser } from "@clerk/react";
import {
  adminUser,
  buyerUser,
  AUTH_SIGNED_OUT,
  AUTH_SIGNED_IN,
  USER_SIGNED_OUT,
  userCtx,
} from "../../mocks/fixtures";

const mockUseAuth = vi.mocked(useAuth);
const mockUseUser = vi.mocked(useUser);

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
    mockUseAuth.mockReturnValue(AUTH_SIGNED_OUT);
    mockUseUser.mockReturnValue(USER_SIGNED_OUT);
    const { router } = renderRoute("/admin/games");
    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/sign-in");
    });
  });

  it("redirects signed-in non-admin to /", async () => {
    mockUseAuth.mockReturnValue(AUTH_SIGNED_IN);
    mockUseUser.mockReturnValue(userCtx(buyerUser));
    const { router } = renderRoute("/admin/games");
    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/");
    });
  });

  it("renders game rows for admin user", async () => {
    mockUseAuth.mockReturnValue(AUTH_SIGNED_IN);
    mockUseUser.mockReturnValue(userCtx(adminUser));
    server.use(http.get(`${BASE_URL}/games`, () => HttpResponse.json(twoGames)));

    renderRoute("/admin/games");

    expect(await screen.findByText("League of Legends")).toBeInTheDocument();
    expect(screen.getByText("valorant")).toBeInTheDocument();
  });

  it("shows empty state when no games", async () => {
    mockUseAuth.mockReturnValue(AUTH_SIGNED_IN);
    mockUseUser.mockReturnValue(userCtx(adminUser));
    server.use(http.get(`${BASE_URL}/games`, () => HttpResponse.json([])));

    renderRoute("/admin/games");

    expect(await screen.findByText(/no games yet/i)).toBeInTheDocument();
  });

  it("create form fires POST /games", async () => {
    mockUseAuth.mockReturnValue(AUTH_SIGNED_IN);
    mockUseUser.mockReturnValue(userCtx(adminUser));
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
    mockUseAuth.mockReturnValue(AUTH_SIGNED_IN);
    mockUseUser.mockReturnValue(userCtx(adminUser));
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
    mockUseAuth.mockReturnValue(AUTH_SIGNED_IN);
    mockUseUser.mockReturnValue(userCtx(adminUser));
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
