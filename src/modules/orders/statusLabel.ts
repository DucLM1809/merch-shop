import type { OrderStatus } from "@/api/types";

/**
 * The `orders` namespace key naming each status, for the buyer-facing views.
 *
 * The API's status is a closed vocabulary we control the wording of, so it is chrome and
 * gets translated — unlike a product name, which Phase 1 leaves alone. The admin views
 * deliberately keep rendering the raw `PENDING`/`FORWARDED` value: the back office is
 * English-only (ADR-0017), and staff there are reading the API's own vocabulary.
 */
export const ORDER_STATUS_KEY = {
  PENDING: "status.PENDING",
  CONFIRMED: "status.CONFIRMED",
  FORWARDED: "status.FORWARDED",
  CANCELLED: "status.CANCELLED",
} as const satisfies Record<OrderStatus, string>;

export type OrderStatusKey = (typeof ORDER_STATUS_KEY)[OrderStatus];
