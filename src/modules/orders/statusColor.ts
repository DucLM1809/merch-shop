import type { OrderStatus } from "@/api/types";

export const ORDER_STATUS_COLOR: Record<OrderStatus, string> = {
  PENDING: "orange.400",
  CONFIRMED: "blue.400",
  FORWARDED: "green.400",
  CANCELLED: "red.400",
};
