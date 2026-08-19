export type SKU = {
  id: string;
  price: number;
  available: boolean;
  size?: string;
  color?: string;
  edition?: string;
};

// --- Wire-format types (merch-shop-11d) ---
//
// What the real backend actually returns for products/SKUs/publishers, which
// differs from the domain shapes above: products nest a minimal `game` ref
// instead of flat publisher/game slugs, SKU prices are serialized decimal.js
// internals instead of numbers, SKU variant fields nest under `attributes`,
// and publishers don't embed their games. src/api/client.ts normalizes these
// into the domain types at the API boundary; exported here so MSW mocks and
// tests can build fixtures against the real contract instead of the frontend's
// own (previously wrong) assumptions.
export type RawDecimal = { s: number; e: number; d: number[] };

export type RawSkuAttributes = { size?: string; color?: string; edition?: string };

export type RawSku = {
  id: string;
  price: RawDecimal | number;
  available: boolean;
  attributes: RawSkuAttributes;
};

// PATCH /skus/:id/availability returns only this slice, not a full RawSku —
// normalizeSku() would crash on the missing price/attributes if applied here.
export type RawSkuAvailability = { id: string; available: boolean };

export type RawGameRef = { id: string; name: string; slug: string };

export type RawProduct = {
  id: string;
  name: string;
  description?: string;
  images?: string[];
  game: RawGameRef;
  // Sent as explicit null when absent, not omitted.
  teamId?: string | null;
  characterId?: string | null;
  skus?: RawSku[];
};

export type RawPublisher = { id: string; name: string; slug: string; logoUrl?: string };

// POST/PATCH /products return a flatter shape than GET /products: a flat gameId
// instead of a nested game ref, and no skus (a freshly created/updated product has
// none yet). See client.ts's normalizeProductMutationResponse.
export type RawProductMutationResponse = {
  id: string;
  name: string;
  description?: string | null;
  images?: string[];
  gameId: string;
  teamId?: string | null;
  characterId?: string | null;
};

export type Product = {
  id: string;
  // The real backend doesn't return a distinct product slug (and /products/:id
  // expects the DB id), so this is always equal to `id` — kept as its own field
  // so routing/SEO code doesn't need to special-case it.
  slug: string;
  name: string;
  description?: string;
  imageUrl?: string;
  // The backend only prices SKUs, not products — this is the lowest SKU price,
  // used for catalog display before a variant is selected.
  price: number;
  publisherId: string;
  publisherSlug: string;
  accentColor?: string;
  gameId: string;
  gameSlug: string;
  teamId?: string;
  characterId?: string;
  skus?: SKU[];
};

export type Game = {
  id: string;
  slug: string;
  name: string;
  publisherId: string;
};

export type CreateGameDto = {
  name: string;
  slug: string;
  publisherId: string;
};

export type Publisher = {
  id: string;
  slug: string;
  name: string;
  logoUrl?: string;
  // The real backend doesn't return a publisher accent color — always undefined
  // until product/theming data adds one. Consumers already fall back when unset.
  accentColor?: string;
  games: Game[];
};

export type Team = {
  id: string;
  slug: string;
  name: string;
  gameId: string;
};

export type Character = {
  id: string;
  slug: string;
  name: string;
  gameId: string;
};

export type CreateSkuDto = {
  productId: string;
  price: number;
  available?: boolean;
  attributes?: {
    size?: string;
    color?: string;
    edition?: string;
  };
};

export type SkuFacet = "game" | "team" | "character";

export type BulkAvailabilityDto = {
  facet: SkuFacet;
  facetId: string;
  available: boolean;
};

export type CreateProductDto = {
  name: string;
  description?: string;
  images?: string[];
  gameId?: string;
  teamId?: string;
  characterId?: string;
};

export type ProductFilters = {
  publisher?: string;
  game?: string;
  gameSlug?: string;
  team?: string;
  character?: string;
  // Admin-only: includes skus with available: false. Silently ignored by the
  // backend for non-admin callers.
  includeUnavailable?: boolean;
};

export type ShippingAddress = {
  fullName: string;
  email: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export type OrderLine = {
  skuId: string;
  productName: string;
  variant: string;
  price: number;
  quantity: number;
};

export const ORDER_STATUSES = ["PENDING", "CONFIRMED", "FORWARDED", "CANCELLED"] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export type AdminOrdersFilters = {
  page?: number;
  limit?: number;
  status?: OrderStatus;
};

export type Order = {
  id: string;
  status: OrderStatus;
  lines: OrderLine[];
  shipping: ShippingAddress;
  total: number;
  createdAt: string;
  stripePaymentIntentId: string;
};

export type ServerCartItem = {
  skuId: string;
  quantity: number;
};

export type ServerCart = {
  id: string;
  items: ServerCartItem[];
};

export type SyncCartItem = {
  skuId: string;
  productId: string;
  productName: string;
  variant: string;
  price: number;
  quantity: number;
};

export type SyncCartResponse = {
  items: SyncCartItem[];
};

export type PaymentIntentResponse = {
  clientSecret: string;
};

export type CreatePublisherDto = {
  name: string;
  slug: string;
  logoUrl?: string;
};

export type CreateTeamDto = {
  name: string;
  slug: string;
  gameId: string;
};

export type CreateCharacterDto = {
  name: string;
  slug: string;
  gameId: string;
};

export type PaginationMeta = { total: number; page: number; limit: number };

export type AccountRole = "customer" | "admin";

// --- Wire-format type (merch-shop-a0f) ---
//
// The real backend returns the role as SCREAMING_SNAKE_CASE ("ADMIN"/"CUSTOMER"),
// not the lowercase AccountRole the rest of the app expects. client.ts normalizes
// this case-insensitively at the API boundary (see normalizeAccount) so existing
// lowercase MSW fixtures (src/mocks/fixtures.ts, src/mocks/handlers.ts) keep working
// unchanged alongside the real backend's casing.
export type RawAccount = {
  id: string;
  email: string;
  role: string;
  createdAt: string;
};

export type Account = {
  id: string;
  email: string;
  role: AccountRole;
  createdAt: string;
};

export type ApiResponse<T> = { success: boolean; data: T; meta: PaginationMeta };

export type RegisterDto = { email: string; password: string };

export type LoginDto = { email: string; password: string };

export type ForgotPasswordDto = { email: string };

export type ResetPasswordDto = { token: string; newPassword: string };

export type VerifyEmailDto = { token: string };

export type AuthTokenResponse = { accessToken: string };
