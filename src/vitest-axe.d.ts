import type { AxeMatchers } from "vitest-axe";

// vitest-axe@0.1.0 ships its "extend-expect" typings against vitest 3's
// `Vi.Assertion` namespace; vitest 4 augments the `vitest` module's
// `Assertion` interface directly (see @testing-library/jest-dom's own
// vitest.d.ts for the same pattern), so that package's typings don't merge.
// Augment the matcher manually instead.
declare module "vitest" {
  interface Assertion<T> extends AxeMatchers {}
}
