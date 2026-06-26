import { http, HttpResponse } from "msw";
import type {
  Publisher,
  Game,
  Team,
  Character,
  CreateOrderResponse,
  Order,
  OrderStatus,
  ServerCart,
  PaymentIntentResponse,
} from "../api/types";
import { BASE_URL } from "../api/client";

interface RawProduct {
  id: string;
  slug: string;
  name: string;
  description?: string;
  imageUrl?: string;
  price: number;
  publisherId: string;
  gameId: string;
  teamId?: string;
  characterId?: string;
  skus?: {
    id: string;
    size?: string;
    color?: string;
    edition?: string;
    price: number;
    available: boolean;
  }[];
}

function enrich(p: RawProduct) {
  const game = games.find((g) => g.id === p.gameId)!;
  const publisher = publishers.find((pub) => pub.id === p.publisherId)!;
  return {
    ...p,
    gameSlug: game.slug,
    publisherSlug: publisher.slug,
    accentColor: publisher.accentColor,
  };
}

const games: Game[] = [
  { id: "lol", slug: "league-of-legends", name: "League of Legends", publisherId: "riot" },
  { id: "val", slug: "valorant", name: "Valorant", publisherId: "riot" },
  { id: "cs2", slug: "cs2", name: "CS2", publisherId: "valve" },
];

export const publishers: Publisher[] = [
  {
    id: "riot",
    slug: "riot",
    name: "Riot Games",
    accentColor: "#d13639",
    games: games.filter((g) => g.publisherId === "riot"),
  },
  {
    id: "valve",
    slug: "valve",
    name: "Valve",
    accentColor: "#1a9fff",
    games: games.filter((g) => g.publisherId === "valve"),
  },
];

export const teams: Team[] = [
  { id: "t1", slug: "t1", name: "T1", gameId: "lol" },
  { id: "c9", slug: "cloud9", name: "Cloud9", gameId: "lol" },
  { id: "navi", slug: "navi", name: "NAVI", gameId: "cs2" },
];

export const characters: Character[] = [
  { id: "azir", slug: "azir", name: "Azir", gameId: "lol" },
  { id: "jett", slug: "jett", name: "Jett", gameId: "val" },
];

const products: RawProduct[] = [
  {
    id: "1",
    slug: "faker-jersey",
    name: "Faker Jersey",
    description: "Official T1 Faker jersey — lightweight performance fabric.",
    price: 59.99,
    publisherId: "riot",
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
    slug: "lol-hoodie",
    name: "League of Legends Hoodie",
    price: 79.99,
    publisherId: "riot",
    gameId: "lol",
    imageUrl: "https://picsum.photos/seed/lol-hoodie/400/400",
  },
  {
    id: "3",
    slug: "valorant-team-jersey",
    name: "Valorant Team Jersey",
    price: 54.99,
    publisherId: "riot",
    gameId: "val",
    imageUrl: "https://picsum.photos/seed/valorant-jersey/400/400",
  },
  {
    id: "4",
    slug: "cs2-team-jersey",
    name: "CS2 Team Jersey",
    price: 49.99,
    publisherId: "valve",
    gameId: "cs2",
    teamId: "navi",
    imageUrl: "https://picsum.photos/seed/cs2-jersey/400/400",
  },
  {
    id: "5",
    slug: "c9-jersey",
    name: "Cloud9 Jersey",
    price: 54.99,
    publisherId: "riot",
    gameId: "lol",
    teamId: "c9",
    imageUrl: "https://picsum.photos/seed/c9-jersey/400/400",
  },
  {
    id: "6",
    slug: "jett-hoodie",
    name: "Jett Hoodie",
    price: 69.99,
    publisherId: "riot",
    gameId: "val",
    characterId: "jett",
    imageUrl: "https://picsum.photos/seed/jett-hoodie/400/400",
  },
];

export const mockOrders: Order[] = [
  {
    id: "ord_001",
    status: "pending",
    total: 59.99,
    createdAt: "2026-06-20T10:00:00Z",
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
    status: "shipped",
    total: 79.99,
    createdAt: "2026-06-22T14:30:00Z",
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
    status: "delivered",
    total: 109.98,
    createdAt: "2026-06-18T08:15:00Z",
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

export const handlers = [
  http.get(`${BASE_URL}/publishers`, () => HttpResponse.json(publishers)),

  http.get(`${BASE_URL}/publishers/:slug`, ({ params }) => {
    const pub = publishers.find((p) => p.slug === params.slug);
    if (!pub) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(pub);
  }),

  http.post(`${BASE_URL}/publishers`, async ({ request }) => {
    const body = (await request.json()) as { name: string; slug: string; logoUrl?: string };
    const created: Publisher = {
      id: `pub-${Date.now()}`,
      slug: body.slug,
      name: body.name,
      accentColor: "#888888",
      games: [],
      ...(body.logoUrl && { logoUrl: body.logoUrl }),
    };
    return HttpResponse.json(created, { status: 201 });
  }),

  http.patch(`${BASE_URL}/publishers/:id`, async ({ params, request }) => {
    const body = (await request.json()) as { name: string; slug: string; logoUrl?: string };
    const existing = publishers.find((p) => p.id === params.id);
    if (!existing) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json({ ...existing, ...body });
  }),

  http.delete(`${BASE_URL}/publishers/:id`, ({ params }) => {
    const exists = publishers.some((p) => p.id === params.id);
    if (!exists) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json({ ok: true });
  }),

  http.get(`${BASE_URL}/games`, () => HttpResponse.json(games)),

  http.post(`${BASE_URL}/games`, async ({ request }) => {
    const body = (await request.json()) as { name: string; slug: string; publisherId: string };
    const created: Game = {
      id: `game-${Date.now()}`,
      slug: body.slug,
      name: body.name,
      publisherId: body.publisherId,
    };
    return HttpResponse.json(created, { status: 201 });
  }),

  http.patch(`${BASE_URL}/games/:id`, async ({ params, request }) => {
    const body = (await request.json()) as { name: string; slug: string; publisherId: string };
    const existing = games.find((g) => g.id === params.id);
    if (!existing) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json({ ...existing, ...body });
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
    return HttpResponse.json(filtered);
  }),

  http.post(`${BASE_URL}/teams`, async ({ request }) => {
    const body = (await request.json()) as { name: string; slug: string; gameId: string };
    const created: Team = {
      id: `team-${Date.now()}`,
      slug: body.slug,
      name: body.name,
      gameId: body.gameId,
    };
    return HttpResponse.json(created, { status: 201 });
  }),

  http.patch(`${BASE_URL}/teams/:id`, async ({ params, request }) => {
    const body = (await request.json()) as { name: string; slug: string; gameId: string };
    const existing = teams.find((t) => t.id === params.id);
    if (!existing) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json({ ...existing, ...body });
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
    return HttpResponse.json(filtered);
  }),

  http.post(`${BASE_URL}/characters`, async ({ request }) => {
    const body = (await request.json()) as { name: string; slug: string; gameId: string };
    const created: Character = {
      id: `char-${Date.now()}`,
      slug: body.slug,
      name: body.name,
      gameId: body.gameId,
    };
    return HttpResponse.json(created, { status: 201 });
  }),

  http.patch(`${BASE_URL}/characters/:id`, async ({ params, request }) => {
    const body = (await request.json()) as { name: string; slug: string; gameId: string };
    const existing = characters.find((c) => c.id === params.id);
    if (!existing) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json({ ...existing, ...body });
  }),

  http.delete(`${BASE_URL}/characters/:id`, ({ params }) => {
    const exists = characters.some((c) => c.id === params.id);
    if (!exists) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json({ ok: true });
  }),

  http.get(`${BASE_URL}/products`, ({ request }) => {
    const url = new URL(request.url);
    const publisher = url.searchParams.get("publisher");
    // accept both legacy names and contract names
    const game = url.searchParams.get("gameId") ?? url.searchParams.get("game");
    const gameSlug = url.searchParams.get("gameSlug");
    const team = url.searchParams.get("teamId") ?? url.searchParams.get("team");
    const character = url.searchParams.get("characterId") ?? url.searchParams.get("character");

    const gameBySlug = gameSlug ? games.find((g) => g.slug === gameSlug) : null;

    const filtered = products.filter(
      (p) =>
        (!publisher || p.publisherId === publisher) &&
        (!game || p.gameId === game) &&
        (!gameBySlug || p.gameId === gameBySlug.id) &&
        (!team || p.teamId === team) &&
        (!character || p.characterId === character)
    );
    return HttpResponse.json(filtered.map(enrich));
  }),

  http.get(`${BASE_URL}/products/:id`, ({ params }) => {
    const product = products.find((p) => p.id === params.id || p.slug === params.id);
    if (!product) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(enrich(product));
  }),

  http.get(`${BASE_URL}/skus`, ({ request }) => {
    const url = new URL(request.url);
    const productId = url.searchParams.get("productId");
    const product = productId
      ? products.find((p) => p.id === productId || p.slug === productId)
      : null;
    return HttpResponse.json(product?.skus ?? []);
  }),

  // --- Cart ---
  http.get(`${BASE_URL}/cart`, () => {
    const cart: ServerCart = { id: "guest-cart", items: [] };
    return HttpResponse.json(cart);
  }),

  http.post(`${BASE_URL}/cart/items`, () => {
    const cart: ServerCart = { id: "guest-cart", items: [] };
    return HttpResponse.json(cart, { status: 201 });
  }),

  http.delete(`${BASE_URL}/cart/items/:skuId`, () => HttpResponse.json({ ok: true })),

  http.post(`${BASE_URL}/cart/merge`, () => {
    const cart: ServerCart = { id: "user-cart", items: [] };
    return HttpResponse.json(cart, { status: 201 });
  }),

  // --- Payments ---
  http.post(`${BASE_URL}/payments/payment-intent`, () => {
    const response: PaymentIntentResponse = { clientSecret: "pi_test_secret_abc" };
    return HttpResponse.json(response, { status: 201 });
  }),

  // --- Orders ---
  http.post(`${BASE_URL}/orders`, () => {
    const response: CreateOrderResponse = {
      orderId: "ord_test_123",
      clientSecret: "pi_test_secret_abc",
    };
    return HttpResponse.json(response, { status: 201 });
  }),

  http.get(`${BASE_URL}/orders/mine`, (): Response => HttpResponse.json([] as Order[])),

  http.get(`${BASE_URL}/orders`, (): Response => HttpResponse.json(mockOrders)),

  http.get(`${BASE_URL}/orders/:id`, ({ params }) => {
    const order = mockOrders.find((o) => o.id === params.id);
    if (!order) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(order);
  }),

  http.patch(`${BASE_URL}/orders/:id/status`, async ({ params, request }) => {
    const body = (await request.json()) as { status: OrderStatus };
    const order = mockOrders.find((o) => o.id === params.id);
    if (!order) return new HttpResponse(null, { status: 404 });
    order.status = body.status;
    return HttpResponse.json(order);
  }),
];
