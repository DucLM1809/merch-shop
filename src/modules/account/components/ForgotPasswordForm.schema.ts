import { z } from "zod";

import { ACCOUNT_VALIDATION_KEYS } from "../validationKeys";

export const schema = z.object({
  email: z.string().min(1, ACCOUNT_VALIDATION_KEYS.email),
});

export type FormValues = z.infer<typeof schema>;

export const DEFAULTS: FormValues = {
  email: "",
};
