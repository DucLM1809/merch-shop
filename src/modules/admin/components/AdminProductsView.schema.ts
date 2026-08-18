import { z } from "zod";

export const schema = z.object({
  name: z.string().min(1, "Required"),
  description: z.string(),
  imageUrl: z.string(),
  gameId: z.string().min(1, "Required"),
  teamId: z.string(),
  characterId: z.string(),
});

export type FormValues = z.infer<typeof schema>;

export const DEFAULTS: FormValues = {
  name: "",
  description: "",
  imageUrl: "",
  gameId: "",
  teamId: "",
  characterId: "",
};
