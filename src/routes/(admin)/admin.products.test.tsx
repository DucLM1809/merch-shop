import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";

import { renderRoute } from "../../test-utils";
import { server } from "../../mocks/server";
import { BASE_URL } from "../../api/client";

import type { Product, Publisher, Game } from "../../api/types";

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
  { id: "riot", slug: "riot-games", name: "Riot Games", accentColor: "#C89B3C", games: [] },
];

const mockGames: Game[] = [
  { id: "lol", slug: "league-of-legends", name: "League of Legends", publisherId: "riot" },
];

const twoProducts: Product[] = [
  {
    id: "p1",
    slug: "jinx-hoodie",
    name: "Jinx Hoodie",
    price: 49.99,
    publisherId: "riot",
    publisherSlug: "riot-games",
    gameId: "lol",
    gameSlug: "league-of-legends",
  },
  {
    id: "p2",
    slug: "azir-tee",
    name: "Azir Tee",
    price: 29.99,
    publisherId: "riot",
    publisherSlug: "riot-games",
    gameId: "lol",
    gameSlug: "league-of-legends",
  },
];

beforeEach(() => {
  vi.clearAllMocks();
  server.use(
    http.get(`${BASE_URL}/publishers`, () => HttpResponse.json(mockPublishers)),
    http.get(`${BASE_URL}/games`, () => HttpResponse.json(mockGames)),
    http.get(`${BASE_URL}/teams`, () => HttpResponse.json([])),
    http.get(`${BASE_URL}/characters`, () => HttpResponse.json([]))
  );
});

describe("/admin/products", () => {
  it("redirects unauthenticated user to /sign-in", async () => {
    mockUseAuth.mockReturnValue(AUTH_SIGNED_OUT);
    mockUseUser.mockReturnValue(USER_SIGNED_OUT);
    const { router } = renderRoute("/admin/products");
    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/sign-in");
    });
  });

  it("redirects signed-in non-admin to /", async () => {
    mockUseAuth.mockReturnValue(AUTH_SIGNED_IN);
    mockUseUser.mockReturnValue(userCtx(buyerUser));
    const { router } = renderRoute("/admin/products");
    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/");
    });
  });

  it("renders product rows for admin user", async () => {
    mockUseAuth.mockReturnValue(AUTH_SIGNED_IN);
    mockUseUser.mockReturnValue(userCtx(adminUser));
    server.use(http.get(`${BASE_URL}/products`, () => HttpResponse.json(twoProducts)));

    renderRoute("/admin/products");

    expect(await screen.findByText("Jinx Hoodie")).toBeInTheDocument();
    expect(screen.getByText("Azir Tee")).toBeInTheDocument();
  });

  it("shows empty state when no products", async () => {
    mockUseAuth.mockReturnValue(AUTH_SIGNED_IN);
    mockUseUser.mockReturnValue(userCtx(adminUser));
    server.use(http.get(`${BASE_URL}/products`, () => HttpResponse.json([])));

    renderRoute("/admin/products");

    expect(await screen.findByText(/no products yet/i)).toBeInTheDocument();
  });

  it("create form fires POST /products", async () => {
    mockUseAuth.mockReturnValue(AUTH_SIGNED_IN);
    mockUseUser.mockReturnValue(userCtx(adminUser));
    server.use(http.get(`${BASE_URL}/products`, () => HttpResponse.json([])));

    let posted = false;
    server.use(
      http.post(`${BASE_URL}/products`, async () => {
        posted = true;
        const created: Product = {
          id: "new",
          slug: "jinx-hoodie",
          name: "Jinx Hoodie",
          price: 49.99,
          publisherId: "riot",
          publisherSlug: "riot-games",
          gameId: "lol",
          gameSlug: "league-of-legends",
        };
        return HttpResponse.json(created, { status: 201 });
      })
    );

    renderRoute("/admin/products");

    const user = userEvent.setup();
    await user.click(await screen.findByRole("button", { name: /\+ new product/i }));
    await user.type(screen.getByPlaceholderText("Name"), "Jinx Hoodie");
    await user.type(screen.getByPlaceholderText("Slug (e.g. jinx-hoodie)"), "jinx-hoodie");
    await user.type(screen.getByPlaceholderText("Price (e.g. 29.99)"), "49.99");
    await user.selectOptions(screen.getByDisplayValue("Publisher…"), "riot");
    await user.selectOptions(screen.getByDisplayValue("Game…"), "lol");
    await user.click(screen.getByRole("button", { name: /^save$/i }));

    await waitFor(() => expect(posted).toBe(true));
  });

  it("edit form fires PATCH /products/:id", async () => {
    mockUseAuth.mockReturnValue(AUTH_SIGNED_IN);
    mockUseUser.mockReturnValue(userCtx(adminUser));
    server.use(http.get(`${BASE_URL}/products`, () => HttpResponse.json(twoProducts)));

    let patched = false;
    server.use(
      http.patch(`${BASE_URL}/products/:id`, async () => {
        patched = true;
        return HttpResponse.json(twoProducts[0]);
      })
    );

    renderRoute("/admin/products");

    const user = userEvent.setup();
    const editBtns = await screen.findAllByRole("button", { name: /^edit$/i });
    await user.click(editBtns[0]);
    const nameInput = screen.getByDisplayValue("Jinx Hoodie");
    await user.clear(nameInput);
    await user.type(nameInput, "Jinx Hoodie Updated");
    await user.click(screen.getByRole("button", { name: /^save$/i }));

    await waitFor(() => expect(patched).toBe(true));
  });

  it("delete fires DELETE /products/:id", async () => {
    mockUseAuth.mockReturnValue(AUTH_SIGNED_IN);
    mockUseUser.mockReturnValue(userCtx(adminUser));
    server.use(http.get(`${BASE_URL}/products`, () => HttpResponse.json(twoProducts)));

    let deleted = false;
    server.use(
      http.delete(`${BASE_URL}/products/:id`, () => {
        deleted = true;
        return HttpResponse.json({ ok: true });
      })
    );

    renderRoute("/admin/products");

    const user = userEvent.setup();
    const deleteBtns = await screen.findAllByRole("button", { name: /^delete$/i });
    await user.click(deleteBtns[0]);
    await user.click(screen.getByRole("button", { name: /^confirm$/i }));

    await waitFor(() => expect(deleted).toBe(true));
  });
});
