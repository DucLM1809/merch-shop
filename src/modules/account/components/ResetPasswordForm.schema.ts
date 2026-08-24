import { z } from "zod";

import { PASSWORD_MIN_LENGTH } from "../passwordPolicy";
import { ACCOUNT_VALIDATION_KEYS } from "../validationKeys";

export const schema = z.object({
  newPassword: z.string().min(PASSWORD_MIN_LENGTH, ACCOUNT_VALIDATION_KEYS.passwordMin),
});

export type FormValues = z.infer<typeof schema>;

export const DEFAULTS: FormValues = {
  newPassword: "",
};
