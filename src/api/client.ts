import axios from "axios";
import type {
  Character,
  CreateOrderRequest,
  CreateOrderResponse,
  CreatePublisherDto,
  Order,
  PaymentIntentResponse,
  Product,
  ProductFilters,
  Publisher,
  ServerCart,
  SKU,
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

  getCharacters: (gameId?: string): Promise<Character[]> =>
    wrap(
      http
        .get<Character[]>("/characters", { params: gameId ? { gameId } : undefined })
        .then((r) => r.data)
    ),

  getSkus: (productId: string): Promise<SKU[]> =>
    wrap(http.get<SKU[]>("/skus", { params: { productId } }).then((r) => r.data)),

  // --- Cart ---
  getCart: (): Promise<ServerCart> => wrap(http.get<ServerCart>("/cart").then((r) => r.data)),

  addCartItem: (skuId: string, quantity: number): Promise<ServerCart> =>
    wrap(http.post<ServerCart>("/cart/items", { skuId, quantity }).then((r) => r.data)),

  removeCartItem: (skuId: string): Promise<void> =>
    wrap(http.delete(`/cart/items/${skuId}`).then(() => undefined)),

  mergeCart: (sessionId: string): Promise<ServerCart> =>
    wrap(http.post<ServerCart>("/cart/merge", { sessionId }).then((r) => r.data)),

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
};
