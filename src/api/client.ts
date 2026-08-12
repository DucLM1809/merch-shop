import axios, { type AxiosResponse, type InternalAxiosRequestConfig } from "axios";
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
  getMyAccount: (): Promise<ApiResponse<Account>> =>
    wrapEnvelope(http.get<ApiResponse<Account>>("/account/me")),

  deleteAccount: (id: string): Promise<void> =>
    wrap(http.delete(`/account/${id}`).then(() => undefined)),
};
