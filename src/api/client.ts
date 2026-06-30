import axios, { type AxiosResponse } from "axios";
import type {
  ApiResponse,
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

function wrapEnvelope<T>(promise: Promise<AxiosResponse<ApiResponse<T>>>): Promise<ApiResponse<T>> {
  return wrap(
    promise.then((r) => {
      if (!r.data.success) throw new ApiError(0, "Request failed");
      return r.data;
    })
  );
}

export const client = {
  // --- Catalog ---
  getProducts: (filters?: ProductFilters): Promise<ApiResponse<Product[]>> =>
    wrapEnvelope(
      http.get<ApiResponse<Product[]>>("/products", {
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
    ),

  getProduct: (id: string): Promise<ApiResponse<Product>> =>
    wrapEnvelope(http.get<ApiResponse<Product>>(`/products/${id}`)),

  getPublishers: (): Promise<ApiResponse<Publisher[]>> =>
    wrapEnvelope(http.get<ApiResponse<Publisher[]>>("/publishers")),

  getPublisher: (slug: string): Promise<ApiResponse<Publisher>> =>
    wrapEnvelope(http.get<ApiResponse<Publisher>>(`/publishers/${slug}`)),

  getGames: (): Promise<ApiResponse<Game[]>> =>
    wrapEnvelope(http.get<ApiResponse<Game[]>>("/games")),

  createGame: (body: CreateGameDto): Promise<ApiResponse<Game>> =>
    wrapEnvelope(http.post<ApiResponse<Game>>("/games", body)),

  updateGame: (id: string, body: CreateGameDto): Promise<ApiResponse<Game>> =>
    wrapEnvelope(http.patch<ApiResponse<Game>>(`/games/${id}`, body)),

  deleteGame: (id: string): Promise<void> =>
    wrap(http.delete(`/games/${id}`).then(() => undefined)),

  createPublisher: (body: CreatePublisherDto): Promise<ApiResponse<Publisher>> =>
    wrapEnvelope(http.post<ApiResponse<Publisher>>("/publishers", body)),

  updatePublisher: (id: string, body: CreatePublisherDto): Promise<ApiResponse<Publisher>> =>
    wrapEnvelope(http.patch<ApiResponse<Publisher>>(`/publishers/${id}`, body)),

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

  createProduct: (body: CreateProductDto): Promise<ApiResponse<Product>> =>
    wrapEnvelope(http.post<ApiResponse<Product>>("/products", body)),

  updateProduct: (id: string, body: CreateProductDto): Promise<ApiResponse<Product>> =>
    wrapEnvelope(http.patch<ApiResponse<Product>>(`/products/${id}`, body)),

  deleteProduct: (id: string): Promise<void> =>
    wrap(http.delete(`/products/${id}`).then(() => undefined)),

  getSkus: (productId: string): Promise<ApiResponse<SKU[]>> =>
    wrapEnvelope(http.get<ApiResponse<SKU[]>>("/skus", { params: { productId } })),

  createSku: (body: CreateSkuDto): Promise<ApiResponse<SKU>> =>
    wrapEnvelope(http.post<ApiResponse<SKU>>("/skus", body)),

  setSkuAvailability: (id: string, available: boolean): Promise<ApiResponse<SKU>> =>
    wrapEnvelope(http.patch<ApiResponse<SKU>>(`/skus/${id}/availability`, { available })),

  deleteSku: (id: string): Promise<void> => wrap(http.delete(`/skus/${id}`).then(() => undefined)),

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
  // ponytail: createOrder still uses legacy body shape; update when server cart replaces client cart
  createOrder: (body: CreateOrderRequest): Promise<ApiResponse<CreateOrderResponse>> =>
    wrapEnvelope(http.post<ApiResponse<CreateOrderResponse>>("/orders", body)),

  getMyOrders: (): Promise<ApiResponse<Order[]>> =>
    wrapEnvelope(http.get<ApiResponse<Order[]>>("/orders/mine")),

  getAdminOrders: (): Promise<ApiResponse<Order[]>> =>
    wrapEnvelope(http.get<ApiResponse<Order[]>>("/orders")),

  getOrder: (id: string): Promise<ApiResponse<Order>> =>
    wrapEnvelope(http.get<ApiResponse<Order>>(`/orders/${id}`)),

  updateOrderStatus: (id: string, status: OrderStatus): Promise<ApiResponse<Order>> =>
    wrapEnvelope(http.patch<ApiResponse<Order>>(`/orders/${id}/status`, { status })),
};
