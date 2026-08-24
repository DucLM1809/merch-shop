import { z } from "zod";

/**
 * The keys the schema reports instead of sentences.
 *
 * Zod fixes its messages when this module loads, which is long before a locale is resolved
 * — copy written here would pin every locale to English. So the schema names a translation
 * key and the view resolves it through `t` at render, the first moment the active locale is
 * actually known. Keeping the keys in one object is what lets the view translate them
 * without stringly-typing the lookup.
 */
export const VALIDATION_KEYS = {
  fullName: "validation.fullName",
  email: "validation.email",
  line1: "validation.line1",
  city: "validation.city",
  state: "validation.state",
  postalCode: "validation.postalCode",
  country: "validation.country",
} as const;

export type ValidationKey = (typeof VALIDATION_KEYS)[keyof typeof VALIDATION_KEYS];

export const schema = z.object({
  fullName: z.string().min(1, VALIDATION_KEYS.fullName),
  email: z.string().min(1, VALIDATION_KEYS.email),
  line1: z.string().min(1, VALIDATION_KEYS.line1),
  line2: z.string(),
  city: z.string().min(1, VALIDATION_KEYS.city),
  state: z.string().min(1, VALIDATION_KEYS.state),
  postalCode: z.string().min(1, VALIDATION_KEYS.postalCode),
  country: z.string().min(1, VALIDATION_KEYS.country),
});

export type FormValues = z.infer<typeof schema>;

export const DEFAULTS: FormValues = {
  fullName: "",
  email: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
};
