import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const filterSearch = z.object({
  game: z.string().optional(),
  team: z.string().optional(),
  character: z.string().optional(),
});

export const Route = createFileRoute("/")({
  validateSearch: filterSearch,
});
