import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";

import { renderRoute } from "../../test-utils";
import { server } from "../../mocks/server";
import { BASE_URL } from "../../api/client";
import { envelope } from "../../mocks/handlers";

import type { Publisher, Game, RawProduct } from "../../api/types";

import { adminAccount, buyerAccount, mockSignedIn } from "../../mocks/fixtures";

const mockPublishers: Publisher[] = [
  { id: "riot", slug: "riot-games", name: "Riot Games", accentColor: "#C89B3C", games: [] },
];

const mockGames: Game[] = [
  { id: "lol", slug: "league-of-legends", name: "League of Legends", publisherId: "riot" },
];

// Nested `game` ref (no flat slug/price/publisherId) matches the real
// backend's wire shape — see the Raw* types in api/types.ts and merch-shop-11d.
const twoProducts: RawProduct[] = [
  {
    id: "p1",
    name: "Jinx Hoodie",
    game: { id: "lol", name: "League of Legends", slug: "league-of-legends" },
    skus: [{ id: "p1-sku", price: 49.99, available: true, attributes: {} }],
  },
  {
    id: "p2",
    name: "Azir Tee",
    game: { id: "lol", name: "League of Legends", slug: "league-of-legends" },
    skus: [{ id: "p2-sku", price: 29.99, available: true, attributes: {} }],
  },
];

beforeEach(() => {
  vi.clearAllMocks();
  server.use(
    http.get(`${BASE_URL}/publishers`, () => HttpResponse.json(envelope(mockPublishers))),
    http.get(`${BASE_URL}/games`, () => HttpResponse.json(envelope(mockGames))),
    http.get(`${BASE_URL}/teams`, () => HttpResponse.json(envelope([]))),
    http.get(`${BASE_URL}/characters`, () => HttpResponse.json(envelope([])))
  );
});

describe("/admin/products", () => {
  it("redirects unauthenticated user to /sign-in", async () => {
    const { router } = renderRoute("/admin/products");
    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/sign-in");
    });
  });

  it("redirects signed-in non-admin to /", async () => {
    mockSignedIn(buyerAccount);
    const { router } = renderRoute("/admin/products");
    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/");
    });
  });

  it("renders product rows for admin user", async () => {
    mockSignedIn(adminAccount);
    server.use(http.get(`${BASE_URL}/products`, () => HttpResponse.json(envelope(twoProducts))));

    renderRoute("/admin/products");

    expect(await screen.findByText("Jinx Hoodie")).toBeInTheDocument();
    expect(screen.getByText("Azir Tee")).toBeInTheDocument();
  });

  it("shows empty state when no products", async () => {
    mockSignedIn(adminAccount);
    server.use(http.get(`${BASE_URL}/products`, () => HttpResponse.json(envelope([]))));

    renderRoute("/admin/products");

    expect(await screen.findByText(/no products yet/i)).toBeInTheDocument();
  });

  it("create form fires POST /products", async () => {
    mockSignedIn(adminAccount);
    server.use(http.get(`${BASE_URL}/products`, () => HttpResponse.json(envelope([]))));

    let posted = false;
    server.use(
      http.post(`${BASE_URL}/products`, async () => {
        posted = true;
        const created: RawProduct = {
          id: "new",
          name: "Jinx Hoodie",
          game: { id: "lol", name: "League of Legends", slug: "league-of-legends" },
          skus: [],
        };
        return HttpResponse.json(envelope(created), { status: 201 });
      })
    );

    renderRoute("/admin/products");

    const user = userEvent.setup();
    await user.click(await screen.findByRole("button", { name: /\+ new product/i }));
    await user.type(screen.getByPlaceholderText("Name"), "Jinx Hoodie");
    await user.selectOptions(screen.getByDisplayValue("Game…"), "lol");
    await user.click(screen.getByRole("button", { name: /^save$/i }));

    await waitFor(() => expect(posted).toBe(true));
  });

  it("edit form fires PATCH /products/:id", async () => {
    mockSignedIn(adminAccount);
    server.use(http.get(`${BASE_URL}/products`, () => HttpResponse.json(envelope(twoProducts))));

    let patched = false;
    server.use(
      http.patch(`${BASE_URL}/products/:id`, async () => {
        patched = true;
        return HttpResponse.json(envelope(twoProducts[0]));
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
    mockSignedIn(adminAccount);
    server.use(http.get(`${BASE_URL}/products`, () => HttpResponse.json(envelope(twoProducts))));

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
