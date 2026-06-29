import { z } from "zod";

export const schema = z.object({
  name: z.string().min(1, "Required"),
  slug: z.string().min(1, "Required"),
  price: z
    .string()
    .min(1, "Required")
    .refine((v) => !isNaN(parseFloat(v)) && parseFloat(v) > 0, "Must be a positive number"),
  description: z.string(),
  imageUrl: z.string(),
  publisherId: z.string().min(1, "Required"),
  gameId: z.string().min(1, "Required"),
  teamId: z.string(),
  characterId: z.string(),
});

export type FormValues = z.infer<typeof schema>;

export const DEFAULTS: FormValues = {
  name: "",
  slug: "",
  price: "",
  description: "",
  imageUrl: "",
  publisherId: "",
  gameId: "",
  teamId: "",
  characterId: "",
};
