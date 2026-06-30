import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "../mocks/server";
import { client, BASE_URL } from "./client";
import type { PaginationMeta } from "./types";

const META: PaginationMeta = { total: 6, page: 1, limit: 20 };
const envelope = <T>(data: T, total = 6) => ({ success: true, data, meta: { ...META, total } });

const MOCK_PRODUCTS = [
  {
    id: "1",
    slug: "faker-jersey",
    name: "Faker Jersey",
    teamId: "t1",
    gameId: "lol",
    publisherId: "riot",
    price: 49,
  },
  { id: "2", slug: "product-2", name: "Product 2", gameId: "lol", publisherId: "riot", price: 29 },
  { id: "3", slug: "product-3", name: "Product 3", gameId: "lol", publisherId: "riot", price: 29 },
  { id: "4", slug: "product-4", name: "Product 4", gameId: "val", publisherId: "riot", price: 29 },
  { id: "5", slug: "product-5", name: "Product 5", gameId: "cs2", publisherId: "valve", price: 29 },
  { id: "6", slug: "product-6", name: "Product 6", gameId: "cs2", publisherId: "valve", price: 29 },
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
        const product = MOCK_PRODUCTS.find((p) => p.id === params.id || p.slug === params.id);
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

  it("fetches a single product by slug", async () => {
    const res = await client.getProduct("faker-jersey");
    expect(res.data).toMatchObject({ id: "1", slug: "faker-jersey", name: "Faker Jersey" });
  });

  it("throws ApiError on server error", async () => {
    server.use(http.get(`${BASE_URL}/products`, () => new HttpResponse(null, { status: 500 })));
    await expect(client.getProducts()).rejects.toMatchObject({
      name: "ApiError",
      status: 500,
    });
  });
});

describe("API client - Bearer token", () => {
  afterEach(() => {
    delete (window as any).Clerk;
  });

  it("attaches Bearer token when window.Clerk session is active", async () => {
    const mockToken = "test-clerk-token-xyz";
    let capturedAuth: string | null = null;

    (window as any).Clerk = {
      session: { getToken: vi.fn().mockResolvedValue(mockToken) },
    };

    server.use(
      http.get(`${BASE_URL}/products`, ({ request }) => {
        capturedAuth = request.headers.get("Authorization");
        return HttpResponse.json(envelope([]));
      })
    );

    await client.getProducts();

    expect(capturedAuth).toBe(`Bearer ${mockToken}`);
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
