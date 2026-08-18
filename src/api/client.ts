import axios, { type AxiosResponse, type InternalAxiosRequestConfig } from "axios";
import Decimal from "decimal.js";
import type {
  Account,
  AdminOrdersFilters,
  ApiResponse,
  AuthTokenResponse,
  BulkAvailabilityDto,
  Character,
  CreateGameDto,
  CreateProductDto,
  CreatePublisherDto,
  CreateCharacterDto,
  CreateSkuDto,
  CreateTeamDto,
  ForgotPasswordDto,
  Game,
  LoginDto,
  Order,
  PaymentIntentResponse,
  Product,
  ProductFilters,
  Publisher,
  RawAccount,
  RawDecimal,
  RawProduct,
  RawProductMutationResponse,
  RawPublisher,
  RawSku,
  RegisterDto,
  ResetPasswordDto,
  ServerCart,
  SKU,
  SyncCartItem,
  SyncCartResponse,
  Team,
  VerifyEmailDto,
} from "./types";
import { forceSignOut, getAccessToken, setSession } from "../store/authToken";

export const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

const http = axios.create({ baseURL: BASE_URL, withCredentials: true });

type RetryableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

http.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshPromise: Promise<string | null> | null = null;

function refreshAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = http
      .post<ApiResponse<AuthTokenResponse>>("/auth/refresh")
      .then((r) => {
        const token = r.data.data.accessToken;
        setSession(token);
        return token;
      })
      .catch(() => {
        forceSignOut();
        return null;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

http.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error) || error.response?.status !== 401 || !error.config) {
      return Promise.reject(error);
    }
    const config = error.config as RetryableConfig;
    const isAuthEndpoint =
      config.url?.includes("/auth/refresh") || config.url?.includes("/auth/login");
    if (config._retry || isAuthEndpoint) {
      return Promise.reject(error);
    }
    config._retry = true;
    const token = await refreshAccessToken();
    if (!token) {
      return Promise.reject(error);
    }
    config.headers.Authorization = `Bearer ${token}`;
    return http(config);
  }
);

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function wrap<T>(promise: Promise<T>): Promise<T> {
  return promise.catch((err) => {
    if (axios.isAxiosError(err) && err.response) {
      throw new ApiError(err.response.status, err.message);
    }
    throw err;
  });
}

function wrapEnvelope<T>(promise: Promise<AxiosResponse<ApiResponse<T>>>): Promise<ApiResponse<T>> {
  return wrap(
    promise.then((r) => {
      if (!r.data.success) throw new ApiError(0, "Request failed");
      return r.data;
    })
  );
}

// --- Wire-format normalization (merch-shop-11d) ---
//
// Normalizes the real backend's Product/SKU/Publisher wire shapes (see the
// Raw* types in src/api/types.ts) into the app's domain Product/SKU/Publisher
// types at this API boundary, so the rest of the app can keep working against
// one stable shape.

function parseDecimal(value: RawDecimal | number): number {
  if (typeof value === "number") return value;
  // Backend serializes SKU prices as decimal.js's raw internal {s,e,d} fields
  // rather than calling toString()/toJSON() — reattach the Decimal prototype
  // instead of hand-parsing the digit-group encoding.
  const revived = Object.assign(Object.create(Decimal.prototype) as Decimal, value);
  return revived.toNumber();
}

function normalizeSku(raw: RawSku): SKU {
  return {
    id: raw.id,
    price: parseDecimal(raw.price),
    // CreateSkuDto defaults `available` to true server-side, so treat a
    // missing value (list-endpoint skus) the same way rather than as false.
    available: raw.available ?? true,
    size: raw.attributes.size,
    color: raw.attributes.color,
    edition: raw.attributes.edition,
  };
}

// Games/publishers are cross-referenced to resolve routing slugs for products
// (the backend doesn't embed them) since neither is embedded in the product
// response itself.
function loadGames(): Promise<Game[]> {
  return wrapEnvelope(http.get<ApiResponse<Game[]>>("/games")).then((r) => r.data);
}

function loadRawPublishers(): Promise<RawPublisher[]> {
  return wrapEnvelope(http.get<ApiResponse<RawPublisher[]>>("/publishers")).then((r) => r.data);
}

async function normalizeProduct(raw: RawProduct): Promise<Product> {
  const [games, rawPublishers] = await Promise.all([loadGames(), loadRawPublishers()]);
  const game = games.find((g) => g.id === raw.game.id);
  const publisher = game ? rawPublishers.find((p) => p.id === game.publisherId) : undefined;
  const skus = (raw.skus ?? []).map(normalizeSku);

  return {
    id: raw.id,
    slug: raw.id,
    name: raw.name,
    description: raw.description,
    imageUrl: raw.images?.[0],
    price: skus.length ? Math.min(...skus.map((s) => s.price)) : 0,
    publisherId: publisher?.id ?? "",
    publisherSlug: publisher?.slug ?? "",
    accentColor: undefined,
    gameId: raw.game.id,
    gameSlug: game?.slug ?? raw.game.slug,
    teamId: raw.teamId ?? undefined,
    characterId: raw.characterId ?? undefined,
    skus,
  };
}

// POST/PATCH /products only return a flat gameId, not the nested game ref GET
// /products returns — passing a placeholder ref through to normalizeProduct is safe
// since it re-resolves the game (name/slug) from the authoritative loadGames() list by
// id anyway, it doesn't trust the ref's own name/slug fields.
async function normalizeProductMutationResponse(raw: RawProductMutationResponse): Promise<Product> {
  return normalizeProduct({
    id: raw.id,
    name: raw.name,
    description: raw.description ?? undefined,
    images: raw.images,
    teamId: raw.teamId,
    characterId: raw.characterId,
    game: { id: raw.gameId, name: "", slug: "" },
    skus: [],
  });
}

function normalizePublisher(raw: RawPublisher, games: Game[]): Publisher {
  return {
    id: raw.id,
    slug: raw.slug,
    name: raw.name,
    logoUrl: raw.logoUrl,
    accentColor: undefined,
    games: games.filter((g) => g.publisherId === raw.id),
  };
}

// Case-insensitive: the real backend sends "ADMIN"/"CUSTOMER", but MSW fixtures
// (src/mocks/fixtures.ts, src/mocks/handlers.ts) already send lowercase — this
// normalizes both without requiring every mock/story fixture to be rewritten.
function normalizeAccount(raw: RawAccount): Account {
  return {
    id: raw.id,
    email: raw.email,
    role: raw.role.toLowerCase() === "admin" ? "admin" : "customer",
    createdAt: raw.createdAt,
  };
}

export const client = {
  // --- Auth ---
  register: (body: RegisterDto): Promise<void> =>
    wrap(http.post("/auth/register", body).then(() => undefined)),

  login: (body: LoginDto): Promise<ApiResponse<AuthTokenResponse>> =>
    wrapEnvelope(http.post<ApiResponse<AuthTokenResponse>>("/auth/login", body)),

  refresh: (): Promise<ApiResponse<AuthTokenResponse>> =>
    wrapEnvelope(http.post<ApiResponse<AuthTokenResponse>>("/auth/refresh")),

  logout: (): Promise<void> => wrap(http.post("/auth/logout").then(() => undefined)),

  forgotPassword: (body: ForgotPasswordDto): Promise<void> =>
    wrap(http.post("/auth/forgot-password", body).then(() => undefined)),

  resetPassword: (body: ResetPasswordDto): Promise<void> =>
    wrap(http.post("/auth/reset-password", body).then(() => undefined)),

  verifyEmail: (body: VerifyEmailDto): Promise<void> =>
    wrap(http.post("/auth/verify-email", body).then(() => undefined)),

  // --- Catalog ---
  getProducts: async (filters?: ProductFilters): Promise<ApiResponse<Product[]>> => {
    // The real API strictly validates query params (whitelist) and 400s on
    // unknown ones like `gameSlug`/`publisher` — confirmed against a live
    // backend while fixing merch-shop-11d, so both need resolving to
    // supported params instead of being forwarded as-is. There's no
    // publisher-level filter param at all, so that one is applied client-side.
    const needsGamesJoin = Boolean(filters?.gameSlug || filters?.publisher);
    const games = needsGamesJoin ? await loadGames() : undefined;
    const gameIdFromSlug = filters?.gameSlug
      ? games?.find((g) => g.slug === filters.gameSlug)?.id
      : undefined;
    const publisherGameIds = filters?.publisher
      ? new Set(games?.filter((g) => g.publisherId === filters.publisher).map((g) => g.id))
      : undefined;
    const gameId = filters?.game ?? gameIdFromSlug;

    const res = await wrapEnvelope(
      http.get<ApiResponse<RawProduct[]>>("/products", {
        params: {
          ...(gameId && { gameId }),
          ...(filters?.team && { teamId: filters.team }),
          ...(filters?.character && { characterId: filters.character }),
        },
      })
    );
    const data = await Promise.all(res.data.map(normalizeProduct));
    return {
      ...res,
      data: publisherGameIds ? data.filter((p) => publisherGameIds.has(p.gameId)) : data,
    };
  },

  getProduct: async (id: string): Promise<ApiResponse<Product>> => {
    const res = await wrapEnvelope(http.get<ApiResponse<RawProduct>>(`/products/${id}`));
    return { ...res, data: await normalizeProduct(res.data) };
  },

  getPublishers: async (): Promise<ApiResponse<Publisher[]>> => {
    const [res, games] = await Promise.all([
      wrapEnvelope(http.get<ApiResponse<RawPublisher[]>>("/publishers")),
      loadGames(),
    ]);
    return { ...res, data: res.data.map((p) => normalizePublisher(p, games)) };
  },

  getPublisher: async (slug: string): Promise<ApiResponse<Publisher>> => {
    const [res, games] = await Promise.all([
      wrapEnvelope(http.get<ApiResponse<RawPublisher>>(`/publishers/${slug}`)),
      loadGames(),
    ]);
    return { ...res, data: normalizePublisher(res.data, games) };
  },

  getGames: (): Promise<ApiResponse<Game[]>> =>
    wrapEnvelope(http.get<ApiResponse<Game[]>>("/games")),

  createGame: (body: CreateGameDto): Promise<ApiResponse<Game>> =>
    wrapEnvelope(http.post<ApiResponse<Game>>("/games", body)),

  updateGame: (id: string, body: CreateGameDto): Promise<ApiResponse<Game>> =>
    wrapEnvelope(http.patch<ApiResponse<Game>>(`/games/${id}`, body)),

  deleteGame: (id: string): Promise<void> =>
    wrap(http.delete(`/games/${id}`).then(() => undefined)),

  createPublisher: async (body: CreatePublisherDto): Promise<ApiResponse<Publisher>> => {
    const [res, games] = await Promise.all([
      wrapEnvelope(http.post<ApiResponse<RawPublisher>>("/publishers", body)),
      loadGames(),
    ]);
    return { ...res, data: normalizePublisher(res.data, games) };
  },

  updatePublisher: async (
    id: string,
    body: CreatePublisherDto
  ): Promise<ApiResponse<Publisher>> => {
    const [res, games] = await Promise.all([
      wrapEnvelope(http.patch<ApiResponse<RawPublisher>>(`/publishers/${id}`, body)),
      loadGames(),
    ]);
    return { ...res, data: normalizePublisher(res.data, games) };
  },

  deletePublisher: (id: string): Promise<void> =>
    wrap(http.delete(`/publishers/${id}`).then(() => undefined)),

  getTeams: (gameId?: string): Promise<ApiResponse<Team[]>> =>
    wrapEnvelope(
      http.get<ApiResponse<Team[]>>("/teams", { params: gameId ? { gameId } : undefined })
    ),

  createTeam: (body: CreateTeamDto): Promise<ApiResponse<Team>> =>
    wrapEnvelope(http.post<ApiResponse<Team>>("/teams", body)),

  updateTeam: (id: string, body: CreateTeamDto): Promise<ApiResponse<Team>> =>
    wrapEnvelope(http.patch<ApiResponse<Team>>(`/teams/${id}`, body)),

  deleteTeam: (id: string): Promise<void> =>
    wrap(http.delete(`/teams/${id}`).then(() => undefined)),

  getCharacters: (gameId?: string): Promise<ApiResponse<Character[]>> =>
    wrapEnvelope(
      http.get<ApiResponse<Character[]>>("/characters", {
        params: gameId ? { gameId } : undefined,
      })
    ),

  createCharacter: (body: CreateCharacterDto): Promise<ApiResponse<Character>> =>
    wrapEnvelope(http.post<ApiResponse<Character>>("/characters", body)),

  updateCharacter: (id: string, body: CreateCharacterDto): Promise<ApiResponse<Character>> =>
    wrapEnvelope(http.patch<ApiResponse<Character>>(`/characters/${id}`, body)),

  deleteCharacter: (id: string): Promise<void> =>
    wrap(http.delete(`/characters/${id}`).then(() => undefined)),

  createProduct: async (body: CreateProductDto): Promise<ApiResponse<Product>> => {
    const res = await wrapEnvelope(
      http.post<ApiResponse<RawProductMutationResponse>>("/products", body)
    );
    return { ...res, data: await normalizeProductMutationResponse(res.data) };
  },

  updateProduct: async (id: string, body: CreateProductDto): Promise<ApiResponse<Product>> => {
    const res = await wrapEnvelope(
      http.patch<ApiResponse<RawProductMutationResponse>>(`/products/${id}`, body)
    );
    return { ...res, data: await normalizeProductMutationResponse(res.data) };
  },

  deleteProduct: (id: string): Promise<void> =>
    wrap(http.delete(`/products/${id}`).then(() => undefined)),

  getSkus: async (productId: string): Promise<ApiResponse<SKU[]>> => {
    const res = await wrapEnvelope(
      http.get<ApiResponse<RawSku[]>>("/skus", { params: { productId } })
    );
    return { ...res, data: res.data.map(normalizeSku) };
  },

  createSku: async (body: CreateSkuDto): Promise<ApiResponse<SKU>> => {
    const res = await wrapEnvelope(http.post<ApiResponse<RawSku>>("/skus", body));
    return { ...res, data: normalizeSku(res.data) };
  },

  setSkuAvailability: async (id: string, available: boolean): Promise<ApiResponse<SKU>> => {
    const res = await wrapEnvelope(
      http.patch<ApiResponse<RawSku>>(`/skus/${id}/availability`, { available })
    );
    return { ...res, data: normalizeSku(res.data) };
  },

  deleteSku: (id: string): Promise<void> => wrap(http.delete(`/skus/${id}`).then(() => undefined)),

  bulkSetSkuAvailability: (body: BulkAvailabilityDto): Promise<void> =>
    wrap(http.patch(`/skus/availability/bulk`, body).then(() => undefined)),

  // --- Cart ---
  getCart: (): Promise<ApiResponse<ServerCart>> =>
    wrapEnvelope(http.get<ApiResponse<ServerCart>>("/cart")),

  addCartItem: (skuId: string, quantity: number): Promise<ApiResponse<ServerCart>> =>
    wrapEnvelope(http.post<ApiResponse<ServerCart>>("/cart/items", { skuId, quantity })),

  removeCartItem: (skuId: string): Promise<void> =>
    wrap(http.delete(`/cart/items/${skuId}`).then(() => undefined)),

  mergeCart: (sessionId: string): Promise<ApiResponse<ServerCart>> =>
    wrapEnvelope(http.post<ApiResponse<ServerCart>>("/cart/merge", { sessionId })),

  syncCart: (items: SyncCartItem[]): Promise<ApiResponse<SyncCartResponse>> =>
    wrapEnvelope(http.post<ApiResponse<SyncCartResponse>>("/cart/sync", { items })),

  // --- Payments ---
  createPaymentIntent: (cartId: string): Promise<ApiResponse<PaymentIntentResponse>> =>
    wrapEnvelope(
      http.post<ApiResponse<PaymentIntentResponse>>("/payments/payment-intent", { cartId })
    ),

  // --- Orders ---
  getMyOrders: (): Promise<ApiResponse<Order[]>> =>
    wrapEnvelope(http.get<ApiResponse<Order[]>>("/orders/mine")),

  getAdminOrders: (filters?: AdminOrdersFilters): Promise<ApiResponse<Order[]>> =>
    wrapEnvelope(
      http.get<ApiResponse<Order[]>>("/orders", {
        params: {
          ...(filters?.page && { page: filters.page }),
          ...(filters?.limit && { limit: filters.limit }),
          ...(filters?.status && { status: filters.status }),
        },
      })
    ),

  getOrder: (id: string): Promise<ApiResponse<Order>> =>
    wrapEnvelope(http.get<ApiResponse<Order>>(`/orders/${id}`)),

  // 404 means the webhook hasn't created the order yet.
  getOrderByPaymentIntent: (paymentIntentId: string): Promise<Order | null> =>
    wrapEnvelope(http.get<ApiResponse<Order>>(`/orders/by-payment-intent/${paymentIntentId}`))
      .then((envelope) => envelope.data)
      .catch((err) => {
        if (err instanceof ApiError && err.status === 404) return null;
        throw err;
      }),

  retryFulfillment: (id: string): Promise<ApiResponse<Order>> =>
    wrapEnvelope(http.post<ApiResponse<Order>>(`/orders/${id}/retry-fulfillment`)),

  // --- Account ---
  getMyAccount: async (): Promise<ApiResponse<Account>> => {
    const res = await wrapEnvelope(http.get<ApiResponse<RawAccount>>("/account/me"));
    return { ...res, data: normalizeAccount(res.data) };
  },

  deleteAccount: (id: string): Promise<void> =>
    wrap(http.delete(`/account/${id}`).then(() => undefined)),
};
