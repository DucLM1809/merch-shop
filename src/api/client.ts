import axios from "axios";
import type {
  Character,
  CreateGameDto,
  CreateOrderRequest,
  CreateOrderResponse,
  CreateProductDto,
  CreatePublisherDto,
  CreateCharacterDto,
  CreateSkuDto,
  CreateTeamDto,
  Game,
  Order,
  OrderStatus,
  PaymentIntentResponse,
  Product,
  ProductFilters,
  Publisher,
  ServerCart,
  SKU,
  SyncCartItem,
  SyncCartResponse,
  Team,
} from "./types";

export const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

const http = axios.create({ baseURL: BASE_URL });

// Attach Clerk session token when available (no-op in tests / unauthenticated)
http.interceptors.request.use(async (config) => {
  // as any: Clerk injects window.Clerk at runtime; no ambient type declaration available
  if (typeof window !== "undefined" && (window as any).Clerk?.session) {
    try {
      const token = await (window as any).Clerk.session.getToken();
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch {
      // session expired or unavailable — proceed without token
    }
  }
  return config;
});

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

export const client = {
  // --- Catalog ---
  getProducts: (filters?: ProductFilters): Promise<Product[]> =>
    wrap(
      http
        .get<Product[]>("/products", {
          params: {
            // map frontend names → OpenAPI contract names
            ...(filters?.game && { gameId: filters.game }),
            ...(filters?.team && { teamId: filters.team }),
            ...(filters?.character && { characterId: filters.character }),
            // non-standard: resolved by the mock only; real API ignores them
            ...(filters?.publisher && { publisher: filters.publisher }),
            ...(filters?.gameSlug && { gameSlug: filters.gameSlug }),
          },
        })
        .then((r) => r.data)
    ),

  getProduct: (id: string): Promise<Product> =>
    wrap(http.get<Product>(`/products/${id}`).then((r) => r.data)),

  getPublishers: (): Promise<Publisher[]> =>
    wrap(http.get<Publisher[]>("/publishers").then((r) => r.data)),

  getPublisher: (slug: string): Promise<Publisher> =>
    wrap(http.get<Publisher>(`/publishers/${slug}`).then((r) => r.data)),

  getGames: (): Promise<Game[]> => wrap(http.get<Game[]>("/games").then((r) => r.data)),

  createGame: (body: CreateGameDto): Promise<Game> =>
    wrap(http.post<Game>("/games", body).then((r) => r.data)),

  updateGame: (id: string, body: CreateGameDto): Promise<Game> =>
    wrap(http.patch<Game>(`/games/${id}`, body).then((r) => r.data)),

  deleteGame: (id: string): Promise<void> =>
    wrap(http.delete(`/games/${id}`).then(() => undefined)),

  createPublisher: (body: CreatePublisherDto): Promise<Publisher> =>
    wrap(http.post<Publisher>("/publishers", body).then((r) => r.data)),

  updatePublisher: (id: string, body: CreatePublisherDto): Promise<Publisher> =>
    wrap(http.patch<Publisher>(`/publishers/${id}`, body).then((r) => r.data)),

  deletePublisher: (id: string): Promise<void> =>
    wrap(http.delete(`/publishers/${id}`).then(() => undefined)),

  getTeams: (gameId?: string): Promise<Team[]> =>
    wrap(
      http.get<Team[]>("/teams", { params: gameId ? { gameId } : undefined }).then((r) => r.data)
    ),

  createTeam: (body: CreateTeamDto): Promise<Team> =>
    wrap(http.post<Team>("/teams", body).then((r) => r.data)),

  updateTeam: (id: string, body: CreateTeamDto): Promise<Team> =>
    wrap(http.patch<Team>(`/teams/${id}`, body).then((r) => r.data)),

  deleteTeam: (id: string): Promise<void> =>
    wrap(http.delete(`/teams/${id}`).then(() => undefined)),

  getCharacters: (gameId?: string): Promise<Character[]> =>
    wrap(
      http
        .get<Character[]>("/characters", { params: gameId ? { gameId } : undefined })
        .then((r) => r.data)
    ),

  createCharacter: (body: CreateCharacterDto): Promise<Character> =>
    wrap(http.post<Character>("/characters", body).then((r) => r.data)),

  updateCharacter: (id: string, body: CreateCharacterDto): Promise<Character> =>
    wrap(http.patch<Character>(`/characters/${id}`, body).then((r) => r.data)),

  deleteCharacter: (id: string): Promise<void> =>
    wrap(http.delete(`/characters/${id}`).then(() => undefined)),

  createProduct: (body: CreateProductDto): Promise<Product> =>
    wrap(http.post<Product>("/products", body).then((r) => r.data)),

  updateProduct: (id: string, body: CreateProductDto): Promise<Product> =>
    wrap(http.patch<Product>(`/products/${id}`, body).then((r) => r.data)),

  deleteProduct: (id: string): Promise<void> =>
    wrap(http.delete(`/products/${id}`).then(() => undefined)),

  getSkus: (productId: string): Promise<SKU[]> =>
    wrap(http.get<SKU[]>("/skus", { params: { productId } }).then((r) => r.data)),

  createSku: (body: CreateSkuDto): Promise<SKU> =>
    wrap(http.post<SKU>("/skus", body).then((r) => r.data)),

  setSkuAvailability: (id: string, available: boolean): Promise<SKU> =>
    wrap(http.patch<SKU>(`/skus/${id}/availability`, { available }).then((r) => r.data)),

  deleteSku: (id: string): Promise<void> => wrap(http.delete(`/skus/${id}`).then(() => undefined)),

  // --- Cart ---
  getCart: (): Promise<ServerCart> => wrap(http.get<ServerCart>("/cart").then((r) => r.data)),

  addCartItem: (skuId: string, quantity: number): Promise<ServerCart> =>
    wrap(http.post<ServerCart>("/cart/items", { skuId, quantity }).then((r) => r.data)),

  removeCartItem: (skuId: string): Promise<void> =>
    wrap(http.delete(`/cart/items/${skuId}`).then(() => undefined)),

  mergeCart: (sessionId: string): Promise<ServerCart> =>
    wrap(http.post<ServerCart>("/cart/merge", { sessionId }).then((r) => r.data)),

  syncCart: (items: SyncCartItem[]): Promise<SyncCartResponse> =>
    wrap(http.post<SyncCartResponse>("/cart/sync", { items }).then((r) => r.data)),

  // --- Payments ---
  createPaymentIntent: (cartId: string): Promise<PaymentIntentResponse> =>
    wrap(
      http.post<PaymentIntentResponse>("/payments/payment-intent", { cartId }).then((r) => r.data)
    ),

  // --- Orders ---
  // ponytail: createOrder still uses legacy body shape; update when server cart replaces client cart
  createOrder: (body: CreateOrderRequest): Promise<CreateOrderResponse> =>
    wrap(http.post<CreateOrderResponse>("/orders", body).then((r) => r.data)),

  getMyOrders: (): Promise<Order[]> => wrap(http.get<Order[]>("/orders/mine").then((r) => r.data)),

  getAdminOrders: (): Promise<Order[]> => wrap(http.get<Order[]>("/orders").then((r) => r.data)),

  getOrder: (id: string): Promise<Order> =>
    wrap(http.get<Order>(`/orders/${id}`).then((r) => r.data)),

  updateOrderStatus: (id: string, status: OrderStatus): Promise<Order> =>
    wrap(http.patch<Order>(`/orders/${id}/status`, { status }).then((r) => r.data)),
};
