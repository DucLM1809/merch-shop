import type { GeneratedResources } from "./resources.generated";

// Teaches i18next the exact shape of our resources, so `t()` rejects a key we don't ship
// and rejects interpolation data that doesn't match the placeholders in the default
// locale's copy. Regenerate `resources.generated.ts` with `pnpm i18n:types` after editing
// any `en-US` namespace file.
declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "common";
    resources: GeneratedResources;
    // Without this, `t("missing.key", "some default")` type-checks. We want the key.
    strictKeyChecks: true;
  }
}
