import { http, HttpResponse } from "msw";
import type {
  Account,
  Game,
  Publisher,
  Team,
  Character,
  Order,
  ServerCart,
  SyncCartItem,
  SyncCartResponse,
  PaymentIntentResponse,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
  VerifyEmailDto,
  RawPublisher,
  RawProduct,
  RawProductMutationResponse,
  RawSku,
  RawOrder,
} from "../api/types";
import { BASE_URL } from "../api/client";

export const VALID_TOKEN = "valid-token";

// Internal storage shape. The real backend only prices/attributes SKUs (not
// products) and doesn't return a product slug — see merch-shop-11d.
interface RawSkuRecord {
  id: string;
  size?: string;
  color?: string;
  edition?: string;
  price: number;
  available: boolean;
}

interface ProductRecord {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  gameId: string;
  teamId?: string;
  characterId?: string;
  skus?: RawSkuRecord[];
}

function toWireSku(sku: RawSkuRecord): RawSku {
  return {
    id: sku.id,
    price: sku.price,
    available: sku.available,
    attributes: { size: sku.size, color: sku.color, edition: sku.edition },
  };
}

function toWireProduct(
  p: ProductRecord,
  { includeUnavailable }: { includeUnavailable: boolean }
): RawProduct {
  const game = games.find((g) => g.id === p.gameId)!;
  const skus = (p.skus ?? []).filter((s) => includeUnavailable || s.available);
  return {
    id: p.id,
    name: p.name,
    ...(p.description && { description: p.description }),
    ...(p.imageUrl && { images: [p.imageUrl] }),
    game: { id: game.id, name: game.name, slug: game.slug },
    ...(p.teamId && { teamId: p.teamId }),
    ...(p.characterId && { characterId: p.characterId }),
    skus: skus.map(toWireSku),
  };
}

// POST/PATCH /products return a flatter shape than GET /products — a flat gameId
// instead of a nested game ref, and no skus — see merch-shop-485 and
// RawProductMutationResponse in api/types.ts.
function toWireProductMutationResponse(p: ProductRecord): RawProductMutationResponse {
  return {
    id: p.id,
    name: p.name,
    description: p.description ?? null,
    ...(p.imageUrl && { images: [p.imageUrl] }),
    gameId: p.gameId,
    teamId: p.teamId ?? null,
    characterId: p.characterId ?? null,
  };
}

export function envelope<T>(data: T) {
  return {
    success: true,
    data,
    meta: { total: Array.isArray(data) ? data.length : 1, page: 1, limit: 20 },
  };
}

const games: Game[] = [
  { id: "lol", slug: "league-of-legends", name: "League of Legends", publisherId: "riot" },
  { id: "val", slug: "valorant", name: "Valorant", publisherId: "riot" },
  { id: "cs2", slug: "cs2", name: "CS2", publisherId: "valve" },
];

// The real backend doesn't return an accent color or embedded games list on
// publishers (client.ts derives `games` via a join against /games).
export const publishers: RawPublisher[] = [
  { id: "riot", slug: "riot", name: "Riot Games" },
  { id: "valve", slug: "valve", name: "Valve" },
];

const PUBLISHER_ACCENT_COLORS: Record<string, string> = { riot: "#d13639", valve: "#1a9fff" };

// Domain-shaped (not wire-shaped) publishers, for stories/tests that render
// View components directly with props instead of going through MSW/client.ts
// normalization. Includes a demo accentColor since that's purely client-side
// visual polish, not real backend data — see Publisher.accentColor in
// api/types.ts.
export const mockPublishers: Publisher[] = publishers.map((p) => ({
  ...p,
  accentColor: PUBLISHER_ACCENT_COLORS[p.id],
  games: games.filter((g) => g.publisherId === p.id),
}));

export const teams: Team[] = [
  { id: "t1", slug: "t1", name: "T1", gameId: "lol" },
  { id: "c9", slug: "cloud9", name: "Cloud9", gameId: "lol" },
  { id: "navi", slug: "navi", name: "NAVI", gameId: "cs2" },
];

export const characters: Character[] = [
  { id: "azir", slug: "azir", name: "Azir", gameId: "lol" },
  { id: "jett", slug: "jett", name: "Jett", gameId: "val" },
];

const products: ProductRecord[] = [
  {
    id: "1",
    name: "Faker Jersey",
    description: "Official T1 Faker jersey — lightweight performance fabric.",
    gameId: "lol",
    teamId: "t1",
    characterId: "azir",
    imageUrl: "https://picsum.photos/seed/faker-jersey/400/400",
    skus: [
      { id: "fj-s-black", size: "S", color: "Black", price: 59.99, available: true },
      { id: "fj-m-black", size: "M", color: "Black", price: 59.99, available: true },
      { id: "fj-l-black", size: "L", color: "Black", price: 59.99, available: false },
      { id: "fj-s-white", size: "S", color: "White", price: 62.99, available: true },
      { id: "fj-m-white", size: "M", color: "White", price: 62.99, available: false },
    ],
  },
  {
    id: "2",
    name: "League of Legends Hoodie",
    gameId: "lol",
    imageUrl: "https://picsum.photos/seed/lol-hoodie/400/400",
    skus: [{ id: "lol-hoodie", price: 79.99, available: true }],
  },
  {
    id: "3",
    name: "Valorant Team Jersey",
    gameId: "val",
    imageUrl: "https://picsum.photos/seed/valorant-jersey/400/400",
    skus: [{ id: "valorant-jersey", price: 54.99, available: true }],
  },
  {
    id: "4",
    name: "CS2 Team Jersey",
    gameId: "cs2",
    teamId: "navi",
    imageUrl: "https://picsum.photos/seed/cs2-jersey/400/400",
    skus: [{ id: "cs2-jersey", price: 49.99, available: true }],
  },
  {
    id: "5",
    name: "Cloud9 Jersey",
    gameId: "lol",
    teamId: "c9",
    imageUrl: "https://picsum.photos/seed/c9-jersey/400/400",
    skus: [{ id: "c9-jersey", price: 54.99, available: true }],
  },
  {
    id: "6",
    name: "Jett Hoodie",
    gameId: "val",
    characterId: "jett",
    imageUrl: "https://picsum.photos/seed/jett-hoodie/400/400",
    skus: [{ id: "jett-hoodie", price: 69.99, available: true }],
  },
];

export const mockOrders: Order[] = [
  {
    id: "ord_001",
    status: "PENDING",
    total: 59.99,
    createdAt: "2026-06-20T10:00:00Z",
    stripePaymentIntentId: "pi_test_001",
    shipping: {
      fullName: "Alex Kim",
      email: "alex@example.com",
      line1: "123 Main St",
      city: "Seoul",
      state: "Seoul",
      postalCode: "04524",
      country: "KR",
    },
    lines: [
      {
        skuId: "fj-m-black",
        productName: "Faker Jersey",
        variant: "M / Black",
        price: 59.99,
        quantity: 1,
      },
    ],
  },
  {
    id: "ord_002",
    status: "CONFIRMED",
    total: 79.99,
    createdAt: "2026-06-22T14:30:00Z",
    stripePaymentIntentId: "pi_test_002",
    shipping: {
      fullName: "Jordan Park",
      email: "jordan@example.com",
      line1: "456 Oak Ave",
      city: "Los Angeles",
      state: "CA",
      postalCode: "90001",
      country: "US",
    },
    lines: [
      {
        skuId: "lol-hoodie",
        productName: "League of Legends Hoodie",
        variant: "Standard",
        price: 79.99,
        quantity: 1,
      },
    ],
  },
  {
    id: "ord_003",
    status: "FORWARDED",
    total: 109.98,
    createdAt: "2026-06-18T08:15:00Z",
    stripePaymentIntentId: "pi_test_003",
    shipping: {
      fullName: "Sam Chen",
      email: "sam@example.com",
      line1: "789 Pine Rd",
      city: "San Francisco",
      state: "CA",
      postalCode: "94102",
      country: "US",
    },
    lines: [
      {
        skuId: "fj-s-white",
        productName: "Faker Jersey",
        variant: "S / White",
        price: 62.99,
        quantity: 1,
      },
      {
        skuId: "cs2-jersey",
        productName: "CS2 Team Jersey",
        variant: "Standard",
        price: 49.99,
        quantity: 1,
      },
    ],
  },
];

// GET /orders (admin list) only returns id/quantity/skuId per line, wrapped in a nested
// envelope — see normalizeOrder in ../api/client.ts. Derives that wire shape from
// mockOrders so the admin-list handler below exercises the same parsing the real
// backend requires, while /orders/:id, /orders/mine, etc. keep serving full mockOrders.
export function toRawOrder(order: Order): RawOrder {
  return {
    id: order.id,
    accountId: null,
    status: order.status,
    supplierReference: null,
    createdAt: order.createdAt,
    items: order.lines.map((line) => ({
      id: line.skuId,
      quantity: line.quantity,
      skuId: line.skuId,
    })),
  };
}

export const mockAccount: Account = {
  id: "acc_001",
  email: "alex@example.com",
  role: "customer",
  createdAt: "2026-06-01T00:00:00Z",
};

const registeredEmails = new Set<string>();

export function resetAuthMockState(): void {
  registeredEmails.clear();
}

export const handlers = [
  // --- Auth ---
  // Guest by default — tests that need a signed-in session override /auth/refresh
  // and /account/me via mocks/fixtures.ts's mockSignedIn().
  http.post(`${BASE_URL}/auth/register`, async ({ request }) => {
    const body = (await request.json()) as RegisterDto;
    if (registeredEmails.has(body.email)) return new HttpResponse(null, { status: 409 });
    registeredEmails.add(body.email);
    return new HttpResponse(null, { status: 201 });
  }),

  http.post(`${BASE_URL}/auth/login`, async ({ request }) => {
    const body = (await request.json()) as LoginDto;
    if (!body.email || !body.password) return new HttpResponse(null, { status: 401 });
    return HttpResponse.json(envelope({ accessToken: "mock-access-token" }));
  }),

  http.post(`${BASE_URL}/auth/refresh`, () => new HttpResponse(null, { status: 401 })),

  http.post(`${BASE_URL}/auth/logout`, () => HttpResponse.json({ success: true })),

  http.post(`${BASE_URL}/auth/forgot-password`, () => HttpResponse.json({ success: true })),

  http.post(`${BASE_URL}/auth/reset-password`, async ({ request }) => {
    const body = (await request.json()) as ResetPasswordDto;
    if (body.token !== VALID_TOKEN) return new HttpResponse(null, { status: 400 });
    return HttpResponse.json({ success: true });
  }),

  http.post(`${BASE_URL}/auth/verify-email`, async ({ request }) => {
    const body = (await request.json()) as VerifyEmailDto;
    // Matches the real backend's actual error envelope for this endpoint
    // (confirmed against a live backend while fixing merch-shop-bz7) rather than
    // a bare 400 with no body — the real shape is what tripped up the fix.
    if (body.token !== VALID_TOKEN) {
      return HttpResponse.json(
        {
          success: false,
          code: "INVALID_OR_EXPIRED_TOKEN",
          message: "Token is invalid or has expired",
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }
    return HttpResponse.json({ success: true });
  }),

  http.get(`${BASE_URL}/publishers`, () => HttpResponse.json(envelope(publishers))),

  http.get(`${BASE_URL}/publishers/:slug`, ({ params }) => {
    const pub = publishers.find((p) => p.slug === params.slug);
    if (!pub) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(envelope(pub));
  }),

  http.post(`${BASE_URL}/publishers`, async ({ request }) => {
    const body = (await request.json()) as { name: string; slug: string; logoUrl?: string };
    const created: RawPublisher = {
      id: `pub-${Date.now()}`,
      slug: body.slug,
      name: body.name,
      ...(body.logoUrl && { logoUrl: body.logoUrl }),
    };
    return HttpResponse.json(envelope(created), { status: 201 });
  }),

  http.patch(`${BASE_URL}/publishers/:id`, async ({ params, request }) => {
    const body = (await request.json()) as { name: string; slug: string; logoUrl?: string };
    const existing = publishers.find((p) => p.id === params.id);
    if (!existing) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(envelope({ ...existing, ...body }));
  }),

  http.delete(`${BASE_URL}/publishers/:id`, ({ params }) => {
    const exists = publishers.some((p) => p.id === params.id);
    if (!exists) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json({ ok: true });
  }),

  http.get(`${BASE_URL}/games`, () => HttpResponse.json(envelope(games))),

  http.post(`${BASE_URL}/games`, async ({ request }) => {
    const body = (await request.json()) as { name: string; slug: string; publisherId: string };
    const created: Game = {
      id: `game-${Date.now()}`,
      slug: body.slug,
      name: body.name,
      publisherId: body.publisherId,
    };
    return HttpResponse.json(envelope(created), { status: 201 });
  }),

  http.patch(`${BASE_URL}/games/:id`, async ({ params, request }) => {
    const body = (await request.json()) as { name: string; slug: string; publisherId: string };
    const existing = games.find((g) => g.id === params.id);
    if (!existing) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(envelope({ ...existing, ...body }));
  }),

  http.delete(`${BASE_URL}/games/:id`, ({ params }) => {
    const exists = games.some((g) => g.id === params.id);
    if (!exists) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json({ ok: true });
  }),

  http.get(`${BASE_URL}/teams`, ({ request }) => {
    const url = new URL(request.url);
    // accept both legacy 'game' and contract 'gameId'
    const gameId = url.searchParams.get("gameId") ?? url.searchParams.get("game");
    const filtered = gameId ? teams.filter((t) => t.gameId === gameId) : teams;
    return HttpResponse.json(envelope(filtered));
  }),

  http.post(`${BASE_URL}/teams`, async ({ request }) => {
    const body = (await request.json()) as { name: string; slug: string; gameId: string };
    const created: Team = {
      id: `team-${Date.now()}`,
      slug: body.slug,
      name: body.name,
      gameId: body.gameId,
    };
    return HttpResponse.json(envelope(created), { status: 201 });
  }),

  http.patch(`${BASE_URL}/teams/:id`, async ({ params, request }) => {
    const body = (await request.json()) as { name: string; slug: string; gameId: string };
    const existing = teams.find((t) => t.id === params.id);
    if (!existing) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(envelope({ ...existing, ...body }));
  }),

  http.delete(`${BASE_URL}/teams/:id`, ({ params }) => {
    const exists = teams.some((t) => t.id === params.id);
    if (!exists) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json({ ok: true });
  }),

  http.get(`${BASE_URL}/characters`, ({ request }) => {
    const url = new URL(request.url);
    const gameId = url.searchParams.get("gameId") ?? url.searchParams.get("game");
    const filtered = gameId ? characters.filter((c) => c.gameId === gameId) : characters;
    return HttpResponse.json(envelope(filtered));
  }),

  http.post(`${BASE_URL}/characters`, async ({ request }) => {
    const body = (await request.json()) as { name: string; slug: string; gameId: string };
    const created: Character = {
      id: `char-${Date.now()}`,
      slug: body.slug,
      name: body.name,
      gameId: body.gameId,
    };
    return HttpResponse.json(envelope(created), { status: 201 });
  }),

  http.patch(`${BASE_URL}/characters/:id`, async ({ params, request }) => {
    const body = (await request.json()) as { name: string; slug: string; gameId: string };
    const existing = characters.find((c) => c.id === params.id);
    if (!existing) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(envelope({ ...existing, ...body }));
  }),

  http.delete(`${BASE_URL}/characters/:id`, ({ params }) => {
    const exists = characters.some((c) => c.id === params.id);
    if (!exists) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json({ ok: true });
  }),

  http.get(`${BASE_URL}/products`, ({ request }) => {
    const url = new URL(request.url);
    // The real API only accepts gameId/teamId/characterId (strict param
    // validation — confirmed against a live backend, see merch-shop-11d)
    // — no gameSlug or publisher-level filter. client.ts resolves those
    // client-side, so this mock only needs to support what the client sends.
    const game = url.searchParams.get("gameId");
    const team = url.searchParams.get("teamId");
    const character = url.searchParams.get("characterId");
    const includeUnavailable = url.searchParams.get("includeUnavailable") === "true";

    const filtered = products.filter(
      (p) =>
        (!game || p.gameId === game) &&
        (!team || p.teamId === team) &&
        (!character || p.characterId === character)
    );
    return HttpResponse.json(
      envelope(filtered.map((p) => toWireProduct(p, { includeUnavailable })))
    );
  }),

  http.get(`${BASE_URL}/products/:id`, ({ params }) => {
    const product = products.find((p) => p.id === params.id);
    if (!product) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(envelope(toWireProduct(product, { includeUnavailable: true })));
  }),

  http.post(`${BASE_URL}/products`, async ({ request }) => {
    const body = (await request.json()) as {
      name: string;
      description?: string;
      images?: string[];
      gameId: string;
      teamId?: string;
      characterId?: string;
    };
    const created: ProductRecord = {
      id: `product-${Date.now()}`,
      name: body.name,
      description: body.description,
      imageUrl: body.images?.[0],
      gameId: body.gameId,
      teamId: body.teamId,
      characterId: body.characterId,
    };
    products.push(created);
    return HttpResponse.json(envelope(toWireProductMutationResponse(created)), { status: 201 });
  }),

  http.patch(`${BASE_URL}/products/:id`, async ({ params, request }) => {
    const body = (await request.json()) as Partial<{
      name: string;
      description?: string;
      images?: string[];
      gameId: string;
      teamId?: string;
      characterId?: string;
    }>;
    const existing = products.find((p) => p.id === params.id);
    if (!existing) return new HttpResponse(null, { status: 404 });
    Object.assign(existing, {
      ...body,
      ...(body.images && { imageUrl: body.images[0] }),
    });
    return HttpResponse.json(envelope(toWireProductMutationResponse(existing)));
  }),

  http.delete(`${BASE_URL}/products/:id`, ({ params }) => {
    const exists = products.some((p) => p.id === params.id);
    if (!exists) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json({ ok: true });
  }),

  http.post(`${BASE_URL}/skus`, async ({ request }) => {
    const body = (await request.json()) as {
      productId: string;
      price: number;
      available?: boolean;
      attributes?: { size?: string; color?: string; edition?: string };
    };
    const created: RawSkuRecord = {
      id: `sku-${Date.now()}`,
      price: body.price,
      available: body.available ?? true,
      size: body.attributes?.size,
      color: body.attributes?.color,
      edition: body.attributes?.edition,
    };
    const product = products.find((p) => p.id === body.productId);
    product?.skus?.push(created);
    return HttpResponse.json(envelope(toWireSku(created)), { status: 201 });
  }),

  http.patch(`${BASE_URL}/skus/:id/availability`, async ({ params, request }) => {
    const body = (await request.json()) as { available: boolean };
    for (const p of products) {
      const sku = p.skus?.find((s) => s.id === params.id);
      if (sku) {
        sku.available = body.available;
        return HttpResponse.json(envelope(toWireSku(sku)));
      }
    }
    return new HttpResponse(null, { status: 404 });
  }),

  http.delete(`${BASE_URL}/skus/:id`, () => HttpResponse.json({ ok: true })),

  http.patch(`${BASE_URL}/skus/availability/bulk`, async ({ request }) => {
    const body = (await request.json()) as {
      facet: "game" | "team" | "character";
      facetId: string;
      available: boolean;
    };
    const facetKey = { game: "gameId", team: "teamId", character: "characterId" }[body.facet];
    products
      .filter((p) => p[facetKey as keyof ProductRecord] === body.facetId)
      .forEach((p) => p.skus?.forEach((s) => (s.available = body.available)));
    return HttpResponse.json({ ok: true });
  }),

  http.get(`${BASE_URL}/skus`, ({ request }) => {
    const url = new URL(request.url);
    const productId = url.searchParams.get("productId");
    const product = productId ? products.find((p) => p.id === productId) : null;
    return HttpResponse.json(envelope((product?.skus ?? []).map(toWireSku)));
  }),

  // --- Cart ---
  http.get(`${BASE_URL}/cart`, () => {
    const cart: ServerCart = { id: "guest-cart", items: [] };
    return HttpResponse.json(envelope(cart));
  }),

  http.post(`${BASE_URL}/cart/items`, () => {
    const cart: ServerCart = { id: "guest-cart", items: [] };
    return HttpResponse.json(envelope(cart), { status: 201 });
  }),

  http.delete(`${BASE_URL}/cart/items/:skuId`, () => HttpResponse.json({ ok: true })),

  http.post(`${BASE_URL}/cart/merge`, () => {
    const cart: ServerCart = { id: "user-cart", items: [] };
    return HttpResponse.json(envelope(cart), { status: 201 });
  }),

  http.post(`${BASE_URL}/cart/sync`, async ({ request }) => {
    const { items } = (await request.json()) as { items: SyncCartItem[] };
    const response: SyncCartResponse = { items };
    return HttpResponse.json(envelope(response));
  }),

  // --- Payments ---
  http.post(`${BASE_URL}/payments/payment-intent`, () => {
    const response: PaymentIntentResponse = { clientSecret: "pi_test_secret_abc" };
    return HttpResponse.json(envelope(response), { status: 201 });
  }),

  // --- Orders ---
  http.get(`${BASE_URL}/orders/mine`, (): Response => HttpResponse.json(envelope([] as Order[]))),

  http.get(`${BASE_URL}/orders`, ({ request }): Response => {
    const url = new URL(request.url);
    const status = url.searchParams.get("status");
    const page = Number(url.searchParams.get("page") ?? 1);
    const limit = Number(url.searchParams.get("limit") ?? 20);

    const filtered = status ? mockOrders.filter((o) => o.status === status) : mockOrders;
    const start = (page - 1) * limit;
    const data = filtered.slice(start, start + limit).map(toRawOrder);

    return HttpResponse.json({
      success: true,
      data: { data, meta: { total: filtered.length, page, limit } },
    });
  }),

  http.get(`${BASE_URL}/orders/:id`, ({ params }) => {
    const order = mockOrders.find((o) => o.id === params.id);
    if (!order) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(envelope(order));
  }),

  http.get(`${BASE_URL}/orders/by-payment-intent/:paymentIntentId`, ({ params }) => {
    const order = mockOrders.find((o) => o.stripePaymentIntentId === params.paymentIntentId);
    if (!order) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(envelope(order));
  }),

  http.post(`${BASE_URL}/orders/:id/retry-fulfillment`, ({ params }) => {
    const order = mockOrders.find((o) => o.id === params.id);
    if (!order) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(envelope(order));
  }),

  // --- Account ---
  http.get(`${BASE_URL}/account/me`, () => HttpResponse.json(envelope(mockAccount))),

  http.delete(`${BASE_URL}/account/:id`, ({ params }) => {
    if (params.id !== mockAccount.id) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json({ ok: true });
  }),
];
