import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor, fireEvent } from "@testing-library/react";
import { http, HttpResponse } from "msw";

import { renderRoute } from "../../test-utils";
import { server } from "../../mocks/server";
import { BASE_URL } from "../../api/client";

import type { Product, Publisher, Game } from "../../api/types";

import { useAuth, useUser } from "@clerk/react";
import { adminUser, buyerUser } from "../../mocks/fixtures";

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
    mockUseAuth.mockReturnValue({ isLoaded: true, isSignedIn: false });
    mockUseUser.mockReturnValue({ user: null });
    const { router } = renderRoute("/admin/products");
    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/sign-in");
    });
  });

  it("redirects signed-in non-admin to /", async () => {
    mockUseAuth.mockReturnValue({ isLoaded: true, isSignedIn: true });
    mockUseUser.mockReturnValue({ user: buyerUser });
    const { router } = renderRoute("/admin/products");
    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/");
    });
  });

  it("renders product rows for admin user", async () => {
    mockUseAuth.mockReturnValue({ isLoaded: true, isSignedIn: true });
    mockUseUser.mockReturnValue({ user: adminUser });
    server.use(http.get(`${BASE_URL}/products`, () => HttpResponse.json(twoProducts)));

    renderRoute("/admin/products");

    expect(await screen.findByText("Jinx Hoodie")).toBeInTheDocument();
    expect(screen.getByText("Azir Tee")).toBeInTheDocument();
  });

  it("shows empty state when no products", async () => {
    mockUseAuth.mockReturnValue({ isLoaded: true, isSignedIn: true });
    mockUseUser.mockReturnValue({ user: adminUser });
    server.use(http.get(`${BASE_URL}/products`, () => HttpResponse.json([])));

    renderRoute("/admin/products");

    expect(await screen.findByText(/no products yet/i)).toBeInTheDocument();
  });

  it("create form fires POST /products", async () => {
    mockUseAuth.mockReturnValue({ isLoaded: true, isSignedIn: true });
    mockUseUser.mockReturnValue({ user: adminUser });
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

    fireEvent.click(await screen.findByText("+ New Product"));
    fireEvent.change(screen.getByPlaceholderText("Name"), { target: { value: "Jinx Hoodie" } });
    fireEvent.change(screen.getByPlaceholderText("Slug (e.g. jinx-hoodie)"), {
      target: { value: "jinx-hoodie" },
    });
    fireEvent.change(screen.getByPlaceholderText("Price (e.g. 29.99)"), {
      target: { value: "49.99" },
    });
    fireEvent.change(screen.getByDisplayValue("Publisher…"), { target: { value: "riot" } });
    fireEvent.change(screen.getByDisplayValue("Game…"), { target: { value: "lol" } });
    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => expect(posted).toBe(true));
  });

  it("edit form fires PATCH /products/:id", async () => {
    mockUseAuth.mockReturnValue({ isLoaded: true, isSignedIn: true });
    mockUseUser.mockReturnValue({ user: adminUser });
    server.use(http.get(`${BASE_URL}/products`, () => HttpResponse.json(twoProducts)));

    let patched = false;
    server.use(
      http.patch(`${BASE_URL}/products/:id`, async () => {
        patched = true;
        return HttpResponse.json(twoProducts[0]);
      })
    );

    renderRoute("/admin/products");

    const editBtns = await screen.findAllByText("Edit");
    fireEvent.click(editBtns[0]);
    fireEvent.change(screen.getByDisplayValue("Jinx Hoodie"), {
      target: { value: "Jinx Hoodie Updated" },
    });
    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => expect(patched).toBe(true));
  });

  it("delete fires DELETE /products/:id", async () => {
    mockUseAuth.mockReturnValue({ isLoaded: true, isSignedIn: true });
    mockUseUser.mockReturnValue({ user: adminUser });
    server.use(http.get(`${BASE_URL}/products`, () => HttpResponse.json(twoProducts)));

    let deleted = false;
    server.use(
      http.delete(`${BASE_URL}/products/:id`, () => {
        deleted = true;
        return HttpResponse.json({ ok: true });
      })
    );

    renderRoute("/admin/products");

    const deleteBtns = await screen.findAllByText("Delete");
    fireEvent.click(deleteBtns[0]);
    fireEvent.click(screen.getByText("Confirm"));

    await waitFor(() => expect(deleted).toBe(true));
  });
});
