import { z } from "zod";

export const schema = z.object({
  name: z.string().min(1, "Required"),
  slug: z.string().min(1, "Required"),
  logoUrl: z.string(),
});

export type FormValues = z.infer<typeof schema>;

export const DEFAULTS: FormValues = {
  name: "",
  slug: "",
  logoUrl: "",
};
