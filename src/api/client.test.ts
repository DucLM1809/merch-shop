import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "../mocks/server";
import { client, BASE_URL } from "./client";
import { clearSession, setSession } from "../store/authToken";
import type { Order, PaginationMeta, RawProduct } from "./types";

const META: PaginationMeta = { total: 6, page: 1, limit: 20 };
const envelope = <T>(data: T, total = 6) => ({ success: true, data, meta: { ...META, total } });

// Nested `game` ref (no flat gameId/publisherSlug/price/slug) matches the
// real backend's wire shape — see the Raw* types in api/types.ts and
// merch-shop-11d.
const MOCK_PRODUCTS: RawProduct[] = [
  {
    id: "1",
    name: "Faker Jersey",
    teamId: "t1",
    game: { id: "lol", name: "League of Legends", slug: "league-of-legends" },
    skus: [{ id: "sku-1", price: 49, attributes: {} }],
  },
  {
    id: "2",
    name: "Product 2",
    game: { id: "lol", name: "League of Legends", slug: "league-of-legends" },
    skus: [{ id: "sku-2", price: 29, attributes: {} }],
  },
  {
    id: "3",
    name: "Product 3",
    game: { id: "lol", name: "League of Legends", slug: "league-of-legends" },
    skus: [{ id: "sku-3", price: 29, attributes: {} }],
  },
  {
    id: "4",
    name: "Product 4",
    game: { id: "val", name: "Valorant", slug: "valorant" },
    skus: [{ id: "sku-4", price: 29, attributes: {} }],
  },
  {
    id: "5",
    name: "Product 5",
    game: { id: "cs2", name: "CS2", slug: "cs2" },
    skus: [{ id: "sku-5", price: 29, attributes: {} }],
  },
  {
    id: "6",
    name: "Product 6",
    game: { id: "cs2", name: "CS2", slug: "cs2" },
    skus: [{ id: "sku-6", price: 29, attributes: {} }],
  },
];

describe("API client", () => {
  beforeEach(() => {
    server.use(
      http.get(`${BASE_URL}/products`, ({ request }) => {
        const url = new URL(request.url);
        const team = url.searchParams.get("teamId") ?? url.searchParams.get("team");
        const filtered = team ? MOCK_PRODUCTS.filter((p) => p.teamId === team) : MOCK_PRODUCTS;
        return HttpResponse.json(envelope(filtered, filtered.length));
      }),
      http.get(`${BASE_URL}/products/:id`, ({ params }) => {
        const product = MOCK_PRODUCTS.find((p) => p.id === params.id);
        if (!product) return new HttpResponse(null, { status: 404 });
        return HttpResponse.json(envelope(product, 1));
      })
    );
  });

  it("fetches product list", async () => {
    const res = await client.getProducts();
    expect(res.data).toHaveLength(6);
    expect(res.data[0]).toMatchObject({
      id: expect.any(String),
      name: expect.any(String),
    });
  });

  it("filters products by facets", async () => {
    const res = await client.getProducts({ team: "t1" });
    expect(res.data).toHaveLength(1);
    expect(res.data[0]?.teamId).toBe("t1");
  });

  it("fetches a single product by id, resolving its game/publisher slugs", async () => {
    const res = await client.getProduct("1");
    expect(res.data).toMatchObject({
      id: "1",
      slug: "1",
      name: "Faker Jersey",
      gameSlug: "league-of-legends",
      publisherSlug: "riot",
    });
  });

  it("parses a decimal.js-serialized SKU price into a number", async () => {
    server.use(
      http.get(`${BASE_URL}/products/:id`, () =>
        HttpResponse.json(
          envelope(
            {
              id: "7",
              name: "Decimal Priced Item",
              game: { id: "lol", name: "League of Legends", slug: "league-of-legends" },
              skus: [
                {
                  id: "sku-7",
                  price: { s: 1, e: 1, d: [29, 9900000] },
                  available: true,
                  attributes: { size: "M" },
                },
              ],
            } satisfies RawProduct,
            1
          )
        )
      )
    );

    const res = await client.getProduct("7");
    expect(res.data.skus?.[0]).toMatchObject({ price: 29.99, size: "M", available: true });
  });

  it("throws ApiError on server error", async () => {
    server.use(http.get(`${BASE_URL}/products`, () => new HttpResponse(null, { status: 500 })));
    await expect(client.getProducts()).rejects.toMatchObject({
      name: "ApiError",
      status: 500,
    });
  });

  // POST/PATCH /products return a flat gameId, not the nested game ref GET /products
  // returns — normalizeProduct(raw.game.id) threw on this shape (merch-shop-485).
  it("normalizes the flat-gameId shape POST /products actually returns", async () => {
    server.use(
      http.post(`${BASE_URL}/products`, () =>
        HttpResponse.json(
          envelope(
            {
              id: "new-product",
              name: "New Product",
              description: null,
              images: [],
              gameId: "lol",
              teamId: null,
              characterId: null,
            },
            1
          )
        )
      )
    );

    const res = await client.createProduct({ name: "New Product", gameId: "lol" });
    expect(res.data).toMatchObject({
      id: "new-product",
      name: "New Product",
      gameId: "lol",
      gameSlug: "league-of-legends",
      publisherSlug: "riot",
    });
  });

  it("normalizes the flat-gameId shape PATCH /products/:id actually returns", async () => {
    server.use(
      http.patch(`${BASE_URL}/products/:id`, () =>
        HttpResponse.json(
          envelope(
            {
              id: "1",
              name: "Renamed Product",
              description: null,
              images: [],
              gameId: "val",
              teamId: null,
              characterId: null,
            },
            1
          )
        )
      )
    );

    const res = await client.updateProduct("1", { name: "Renamed Product", gameId: "val" });
    expect(res.data).toMatchObject({
      id: "1",
      name: "Renamed Product",
      gameSlug: "valorant",
      publisherSlug: "riot",
    });
  });
});

describe("API client - getOrderByPaymentIntent", () => {
  const MOCK_ORDER: Order = {
    id: "order-1",
    status: "CONFIRMED",
    lines: [],
    shipping: {
      fullName: "Faker",
      email: "faker@example.com",
      line1: "1 Rift Ave",
      city: "Seoul",
      state: "Seoul",
      postalCode: "00000",
      country: "KR",
    },
    total: 49,
    createdAt: "2026-07-03T00:00:00.000Z",
    stripePaymentIntentId: "pi_123",
  };

  it("returns the order on a success envelope", async () => {
    server.use(
      http.get(`${BASE_URL}/orders/by-payment-intent/pi_123`, () =>
        HttpResponse.json({ success: true, data: MOCK_ORDER })
      )
    );

    await expect(client.getOrderByPaymentIntent("pi_123")).resolves.toEqual(MOCK_ORDER);
  });

  it("returns null on 404 (webhook hasn't created the order yet)", async () => {
    server.use(
      http.get(
        `${BASE_URL}/orders/by-payment-intent/pi_pending`,
        () => new HttpResponse(null, { status: 404 })
      )
    );

    await expect(client.getOrderByPaymentIntent("pi_pending")).resolves.toBeNull();
  });

  it("throws instead of returning data when envelope success is false", async () => {
    server.use(
      http.get(`${BASE_URL}/orders/by-payment-intent/pi_bad`, () =>
        HttpResponse.json({ success: false, data: MOCK_ORDER })
      )
    );

    await expect(client.getOrderByPaymentIntent("pi_bad")).rejects.toMatchObject({
      name: "ApiError",
    });
  });
});

describe("API client - getMyAccount", () => {
  // The real backend sends SCREAMING_SNAKE_CASE roles (merch-shop-a0f) — this
  // guards against normalizeAccount regressing back to a strict-equality check
  // that would silently redirect every real admin out of /admin again.
  it("normalizes an uppercase ADMIN role to the lowercase domain value", async () => {
    server.use(
      http.get(`${BASE_URL}/account/me`, () =>
        HttpResponse.json(
          envelope(
            {
              id: "acc-1",
              email: "admin.test@merchshop.local",
              role: "ADMIN",
              createdAt: "2026-08-13T00:00:00.000Z",
            },
            1
          )
        )
      )
    );

    const res = await client.getMyAccount();
    expect(res.data.role).toBe("admin");
  });

  it("normalizes an uppercase CUSTOMER role to the lowercase domain value", async () => {
    server.use(
      http.get(`${BASE_URL}/account/me`, () =>
        HttpResponse.json(
          envelope(
            {
              id: "acc-2",
              email: "buyer.test@merchshop.local",
              role: "CUSTOMER",
              createdAt: "2026-08-13T00:00:00.000Z",
            },
            1
          )
        )
      )
    );

    const res = await client.getMyAccount();
    expect(res.data.role).toBe("customer");
  });

  it("passes through an already-lowercase role unchanged (MSW mock fixtures)", async () => {
    server.use(
      http.get(`${BASE_URL}/account/me`, () =>
        HttpResponse.json(
          envelope(
            {
              id: "acc-3",
              email: "admin@test.com",
              role: "admin",
              createdAt: "2026-01-01T00:00:00.000Z",
            },
            1
          )
        )
      )
    );

    const res = await client.getMyAccount();
    expect(res.data.role).toBe("admin");
  });
});

describe("API client - Bearer token", () => {
  afterEach(() => {
    clearSession();
  });

  it("attaches Bearer token when a session is active", async () => {
    setSession("test-access-token-xyz");
    let capturedAuth: string | null = null;

    server.use(
      http.get(`${BASE_URL}/products`, ({ request }) => {
        capturedAuth = request.headers.get("Authorization");
        return HttpResponse.json(envelope([]));
      })
    );

    await client.getProducts();

    expect(capturedAuth).toBe("Bearer test-access-token-xyz");
  });

  it("sends request without Authorization header when not signed in", async () => {
    let capturedAuth: string | null = "not-set";

    server.use(
      http.get(`${BASE_URL}/products`, ({ request }) => {
        capturedAuth = request.headers.get("Authorization");
        return HttpResponse.json(envelope([]));
      })
    );

    await client.getProducts();

    expect(capturedAuth).toBeNull();
  });
});

describe("API client - 401 refresh-and-retry", () => {
  afterEach(() => {
    clearSession();
  });

  it("dedupes concurrent refresh calls and retries both requests once", async () => {
    setSession("stale-token");
    let refreshCalls = 0;

    server.use(
      http.post(`${BASE_URL}/auth/refresh`, () => {
        refreshCalls += 1;
        return HttpResponse.json(envelope({ accessToken: "fresh-token" }));
      }),
      http.get(`${BASE_URL}/products`, ({ request }) => {
        const auth = request.headers.get("Authorization");
        if (auth === "Bearer stale-token") return new HttpResponse(null, { status: 401 });
        return HttpResponse.json(envelope([]));
      })
    );

    const [a, b] = await Promise.all([client.getProducts(), client.getProducts()]);

    expect(refreshCalls).toBe(1);
    expect(a.data).toEqual([]);
    expect(b.data).toEqual([]);
  });

  it("clears the session when refresh itself fails", async () => {
    setSession("stale-token");

    server.use(
      http.post(`${BASE_URL}/auth/refresh`, () => new HttpResponse(null, { status: 401 })),
      http.get(`${BASE_URL}/products`, () => new HttpResponse(null, { status: 401 }))
    );

    await expect(client.getProducts()).rejects.toMatchObject({ name: "ApiError", status: 401 });
  });
});
