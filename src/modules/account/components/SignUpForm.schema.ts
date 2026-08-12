import { z } from "zod";

export const schema = z.object({
  email: z.string().min(1, "Email is required"),
  password: z.string().min(12, "Password must be at least 12 characters"),
});

export type FormValues = z.infer<typeof schema>;

export const DEFAULTS: FormValues = {
  email: "",
  password: "",
};
