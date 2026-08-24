/**
 * The keys the account schemas report instead of sentences.
 *
 * Same reasoning as checkout's `VALIDATION_KEYS`: Zod fixes its messages when the schema
 * module loads, long before a locale is resolved, so copy written there would pin every
 * locale to English. The forms resolve these through `t` at render.
 */
export const ACCOUNT_VALIDATION_KEYS = {
  email: "validation.email",
  password: "validation.password",
  passwordMin: "validation.passwordMin",
} as const;

export type AccountValidationKey =
  (typeof ACCOUNT_VALIDATION_KEYS)[keyof typeof ACCOUNT_VALIDATION_KEYS];
