import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";

import { renderRoute } from "../../test-utils";
import { server } from "../../mocks/server";
import { BASE_URL } from "../../api/client";
import { envelope } from "../../mocks/handlers";

import type { Character, Game } from "../../api/types";

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

const mockGames: Game[] = [
  { id: "lol", slug: "league-of-legends", name: "League of Legends", publisherId: "riot" },
];

const twoCharacters: Character[] = [
  { id: "jinx", slug: "jinx", name: "Jinx", gameId: "lol" },
  { id: "azir", slug: "azir", name: "Azir", gameId: "lol" },
];

beforeEach(() => {
  vi.clearAllMocks();
  server.use(http.get(`${BASE_URL}/games`, () => HttpResponse.json(envelope(mockGames))));
});

describe("/admin/characters", () => {
  it("redirects unauthenticated user to /sign-in", async () => {
    mockUseAuth.mockReturnValue(AUTH_SIGNED_OUT);
    mockUseUser.mockReturnValue(USER_SIGNED_OUT);
    const { router } = renderRoute("/admin/characters");
    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/sign-in");
    });
  });

  it("redirects signed-in non-admin to /", async () => {
    mockUseAuth.mockReturnValue(AUTH_SIGNED_IN);
    mockUseUser.mockReturnValue(userCtx(buyerUser));
    const { router } = renderRoute("/admin/characters");
    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/");
    });
  });

  it("renders character rows for admin user", async () => {
    mockUseAuth.mockReturnValue(AUTH_SIGNED_IN);
    mockUseUser.mockReturnValue(userCtx(adminUser));
    server.use(
      http.get(`${BASE_URL}/characters`, () => HttpResponse.json(envelope(twoCharacters)))
    );

    renderRoute("/admin/characters");

    expect(await screen.findByText("Jinx")).toBeInTheDocument();
    expect(screen.getByText("azir")).toBeInTheDocument();
  });

  it("shows empty state when no characters", async () => {
    mockUseAuth.mockReturnValue(AUTH_SIGNED_IN);
    mockUseUser.mockReturnValue(userCtx(adminUser));
    server.use(http.get(`${BASE_URL}/characters`, () => HttpResponse.json(envelope([]))));

    renderRoute("/admin/characters");

    expect(await screen.findByText(/no characters yet/i)).toBeInTheDocument();
  });

  it("create form fires POST /characters", async () => {
    mockUseAuth.mockReturnValue(AUTH_SIGNED_IN);
    mockUseUser.mockReturnValue(userCtx(adminUser));
    server.use(http.get(`${BASE_URL}/characters`, () => HttpResponse.json(envelope([]))));

    let posted = false;
    server.use(
      http.post(`${BASE_URL}/characters`, async () => {
        posted = true;
        const created: Character = { id: "new", slug: "jinx", name: "Jinx", gameId: "lol" };
        return HttpResponse.json(envelope(created), { status: 201 });
      })
    );

    renderRoute("/admin/characters");

    const user = userEvent.setup();
    await user.click(await screen.findByRole("button", { name: /\+ new character/i }));
    await user.type(screen.getByPlaceholderText("Name"), "Jinx");
    await user.type(screen.getByPlaceholderText("Slug (e.g. jinx)"), "jinx");
    await user.selectOptions(screen.getByDisplayValue("Game…"), "lol");
    await user.click(screen.getByRole("button", { name: /^save$/i }));

    await waitFor(() => expect(posted).toBe(true));
  });

  it("edit form fires PATCH /characters/:id", async () => {
    mockUseAuth.mockReturnValue(AUTH_SIGNED_IN);
    mockUseUser.mockReturnValue(userCtx(adminUser));
    server.use(
      http.get(`${BASE_URL}/characters`, () => HttpResponse.json(envelope(twoCharacters)))
    );

    let patched = false;
    server.use(
      http.patch(`${BASE_URL}/characters/:id`, async () => {
        patched = true;
        return HttpResponse.json(envelope(twoCharacters[0]));
      })
    );

    renderRoute("/admin/characters");

    const user = userEvent.setup();
    const editBtns = await screen.findAllByRole("button", { name: /^edit$/i });
    await user.click(editBtns[0]);
    const nameInput = screen.getByDisplayValue("Jinx");
    await user.clear(nameInput);
    await user.type(nameInput, "Jinx Updated");
    await user.click(screen.getByRole("button", { name: /^save$/i }));

    await waitFor(() => expect(patched).toBe(true));
  });

  it("delete fires DELETE /characters/:id", async () => {
    mockUseAuth.mockReturnValue(AUTH_SIGNED_IN);
    mockUseUser.mockReturnValue(userCtx(adminUser));
    server.use(
      http.get(`${BASE_URL}/characters`, () => HttpResponse.json(envelope(twoCharacters)))
    );

    let deleted = false;
    server.use(
      http.delete(`${BASE_URL}/characters/:id`, () => {
        deleted = true;
        return HttpResponse.json({ ok: true });
      })
    );

    renderRoute("/admin/characters");

    const user = userEvent.setup();
    const deleteBtns = await screen.findAllByRole("button", { name: /^delete$/i });
    await user.click(deleteBtns[0]);
    await user.click(screen.getByRole("button", { name: /^confirm$/i }));

    await waitFor(() => expect(deleted).toBe(true));
  });
});
