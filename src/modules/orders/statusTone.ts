import type { OrderStatus } from "@/api/types";
import type { BadgeTone } from "@/components/Badge";

/**
 * Mirrors `ORDER_STATUS_COLOR`'s color choice (orange/blue/green/red) through the
 * shared Badge primitive's tone vocabulary instead of a raw color token.
 */
export const ORDER_STATUS_TONE: Record<OrderStatus, BadgeTone> = {
  PENDING: "warning",
  CONFIRMED: "accent",
  FORWARDED: "success",
  CANCELLED: "danger",
};
