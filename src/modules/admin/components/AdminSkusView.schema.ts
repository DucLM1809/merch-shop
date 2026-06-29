import { z } from "zod";

export const schema = z.object({
  productId: z.string().min(1, "Required"),
  price: z.coerce.number().positive("Must be a positive number"),
  size: z.string(),
  color: z.string(),
  edition: z.string(),
});

export type FormValues = z.infer<typeof schema>;

export const DEFAULTS: FormValues = {
  productId: "",
  price: "" as unknown as number,
  size: "",
  color: "",
  edition: "",
};
