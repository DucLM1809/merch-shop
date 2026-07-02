import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const searchSchema = z.object({
  orderId: z.string(),
  items: z.string(),
});

export const Route = createFileRoute("/(checkout)/order-confirmation")({
  ssr: false,
  validateSearch: searchSchema,
});
