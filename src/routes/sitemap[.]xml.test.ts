import { readFileSync } from "node:fs";
import path from "node:path";

import { http, HttpResponse } from "msw";
import { describe, it, expect } from "vitest";

import { BASE_URL } from "@/api/client";
import { server } from "@/mocks/server";

import type { Game, RawProduct, RawPublisher } from "@/api/types";

import { buildSitemapResponse } from "./sitemap[.]xml";

const MOCK_GAMES: Game[] = [
  { id: "lol", slug: "lol", name: "League of Legends", publisherId: "riot" },
  { id: "cs2", slug: "cs2", name: "CS2", publisherId: "valve" },
];

const MOCK_PUBLISHERS: RawPublisher[] = [
  { id: "riot", slug: "riot", name: "Riot Games" },
  { id: "valve", slug: "valve", name: "Valve" },
];

const MOCK_PRODUCTS: RawProduct[] = [
  {
    id: "1",
    name: "Faker Jersey",
    game: { id: "lol", name: "League of Legends", slug: "lol" },
    skus: [{ id: "sku-1", price: 49, available: true, attributes: {} }],
  },
  {
    id: "2",
    name: "CS2 Knife",
    game: { id: "cs2", name: "CS2", slug: "cs2" },
    skus: [{ id: "sku-2", price: 199, available: true, attributes: {} }],
  },
];

function mockGamesAndPublishers(): void {
  server.use(
    http.get(`${BASE_URL}/games`, () =>
      HttpResponse.json({ success: true, data: MOCK_GAMES, meta: {} })
    ),
    http.get(`${BASE_URL}/publishers`, () =>
      HttpResponse.json({ success: true, data: MOCK_PUBLISHERS, meta: {} })
    )
  );
}

describe("sitemap.xml route", () => {
  it("returns XML reflecting the current backend product list", async () => {
    mockGamesAndPublishers();
    server.use(
      http.get(`${BASE_URL}/products`, () =>
        HttpResponse.json({ success: true, data: MOCK_PRODUCTS, meta: {} })
      )
    );

    const response = await buildSitemapResponse();
    const body = await response.text();

    expect(response.headers.get("Content-Type")).toBe("application/xml");
    expect(body).toContain("<urlset");
    // The real backend doesn't return a distinct product slug — /products/:id
    // expects the DB id, so the URL segment is the product's id.
    expect(body).toContain("/en-US/riot/lol/products/1");
    expect(body).toContain("/en-US/valve/cs2/products/2");
  });

  it("is cached at the CDN edge", async () => {
    mockGamesAndPublishers();
    server.use(
      http.get(`${BASE_URL}/products`, () =>
        HttpResponse.json({ success: true, data: [], meta: {} })
      )
    );

    const response = await buildSitemapResponse();

    expect(response.headers.get("Cache-Control")).toBe(
      "public, s-maxage=3600, stale-while-revalidate"
    );
  });
});

describe("robots.txt", () => {
  it("disallows cart, checkout, and account", () => {
    const content = readFileSync(path.resolve(__dirname, "../../public/robots.txt"), "utf-8");

    expect(content).toContain("Disallow: /cart");
    expect(content).toContain("Disallow: /checkout");
    expect(content).toContain("Disallow: /account");
  });
});
