import { z } from "zod";

export const schema = z.object({
  productId: z.string().min(1, "Required"),
  price: z
    .string()
    .min(1, "Required")
    .refine((v) => !isNaN(parseFloat(v)) && parseFloat(v) > 0, "Must be a positive number"),
  size: z.string(),
  color: z.string(),
  edition: z.string(),
});

export type FormValues = z.infer<typeof schema>;

export const DEFAULTS: FormValues = {
  productId: "",
  price: "",
  size: "",
  color: "",
  edition: "",
};
