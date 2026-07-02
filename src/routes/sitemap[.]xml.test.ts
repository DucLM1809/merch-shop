import { readFileSync } from "node:fs";
import path from "node:path";

import { http, HttpResponse } from "msw";
import { describe, it, expect } from "vitest";

import { BASE_URL } from "@/api/client";
import { server } from "@/mocks/server";

import { buildSitemapResponse } from "./sitemap[.]xml";

const MOCK_PRODUCTS = [
  {
    id: "1",
    slug: "faker-jersey",
    name: "Faker Jersey",
    publisherSlug: "riot",
    gameSlug: "lol",
    price: 49,
  },
  {
    id: "2",
    slug: "cs2-knife",
    name: "CS2 Knife",
    publisherSlug: "valve",
    gameSlug: "cs2",
    price: 199,
  },
];

describe("sitemap.xml route", () => {
  it("returns XML reflecting the current backend product list", async () => {
    server.use(
      http.get(`${BASE_URL}/products`, () =>
        HttpResponse.json({ success: true, data: MOCK_PRODUCTS, meta: {} })
      )
    );

    const response = await buildSitemapResponse();
    const body = await response.text();

    expect(response.headers.get("Content-Type")).toBe("application/xml");
    expect(body).toContain("<urlset");
    expect(body).toContain("/riot/lol/products/faker-jersey");
    expect(body).toContain("/valve/cs2/products/cs2-knife");
  });

  it("is cached at the CDN edge", async () => {
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
