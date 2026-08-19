import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const searchSchema = z.object({
  paymentIntentId: z.string().optional(),
  items: z.string(),
});

export const Route = createFileRoute("/$locale/(checkout)/order-confirmation")({
  ssr: false,
  validateSearch: searchSchema,
});
