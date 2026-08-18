# E2E pipeline implementation: Playwright infra + CI wiring for the needs-e2e backlog

Status: proposed

ADR-0009 established Vitest as mandatory and Playwright as an opt-in supplement, gated by human triage applying the `needs-e2e` label. Seven issues already carry that label in the tracker — this ADR does not revisit that policy, it stays inside ADR-0009's exception path, but records the shape of executing that backlog in one pass: standalone Playwright infra, six flow-level tests, and CI wiring for both Playwright and (previously missing) Vitest.

## Scope

`merch-shop-c25` (Playwright infra: config, auth fixture, CI step) blocks everything else. Delivery order:

1. `c25` — infra
2. `5gi` — catalog browse → add to cart (no auth)
3. `7bd` — auth redirect flow (establishes the `storageState` fixture)
4. `0zj` — mobile nav drawer open/close
5. `u4j`, `dm4`, `1ig` — checkout, admin CRUD, order history (all depend on `7bd`'s fixture)

## Stale spec correction

`c25`, `7bd`, `u4j`, `dm4`, and `1ig` were written before ADR-0015 (Clerk → homegrown `/auth/*` auth) and describe a Clerk sign-in form, Clerk error copy, and `E2E_CLERK_*` env vars that no longer exist in the codebase. Their Beads descriptions will be rewritten to target the real login form and `/auth/login` before implementation starts, with env vars renamed to `E2E_TEST_EMAIL`/`E2E_TEST_PASSWORD` and `E2E_ADMIN_EMAIL`/`E2E_ADMIN_PASSWORD`. `5gi` (no auth) and `0zj` (already uses the post-migration `useAuth`/`isSignedIn`/`isLoaded` API) need no changes.

## Infra design (`c25`)

- A standalone `playwright.config.ts` at the repo root, distinct from the existing `@vitest/browser-playwright` provider used for Storybook interaction tests — the two are different Playwright usages and should stay named distinctly (`test:e2e` vs `test:storybook`) to avoid confusion.
- `globalSetup.ts` logs in via `POST /auth/login` and saves `storageState`.
- This still works under the in-memory-access-token model from ADR-0015: `storageState` captures the HttpOnly refresh cookie, and `__root.tsx`'s blocking bootstrap (`/auth/refresh` → `/account/me`) re-mints the in-memory access token from that cookie on load — no Playwright-side handling of the access token itself is needed.

## Testing conventions

Decided while implementing `0zj` — the first flow-level suite, and the only one not blocked on the staging test account. The remaining five (`5gi`, `7bd`, `u4j`, `dm4`, `1ig`) follow the same conventions once `c25`'s staging dependency clears.

- **Locators**: `getByRole`/`getByLabel`/`getByText` first — resilient to markup changes and doubles as an accessibility check. `data-testid` only as a fallback for elements with no meaningful accessible role/label: dynamic text (usernames, prices, order statuses) or purely decorative containers (e.g. the nav drawer's click-outside overlay, which has no role of its own). `AdminProductsView.tsx`'s CRUD buttons currently have no scoping attributes at all (repeated "Add"/"Save"/"Cancel" text per table row) — `dm4` will need row-scoped locators or a few added `data-testid`s; not addressed here since it's unrelated to `0zj`.
- **Page Object Model**: fixture-based, not manually instantiated per test. Each flow gets a POM class under `e2e/pages/*.page.ts` (e.g. `GlobalNav.page.ts`), wired into a single shared `e2e/fixtures.ts` that extends Playwright's `test`/`expect`. Spec files import `test`/`expect` from `../fixtures`, never `@playwright/test` directly, so every spec gets the same fixtures without re-wiring.
- **File layout**: spec files live under `e2e/test/*.spec.ts`; shared helpers (`e2e/pages/`, `e2e/fixtures.ts`, `e2e/auth.ts`, `e2e/global-setup.ts`) stay at the `e2e/` root. `playwright.config.ts`'s `testDir` points at `./e2e/test`.
- **Auth state**: the default `storageState` (see Infra design above) covers "authenticated" tests with no extra setup. Guest/unauthenticated tests override per-`describe` block with `test.use({ storageState: GUEST_STORAGE_STATE })`, using the `GUEST_STORAGE_STATE` constant exported from `e2e/fixtures.ts` — this is the shared piece `7bd` is expected to build on rather than reinvent.
- **Mobile viewport**: no dedicated Playwright `project` for mobile — `c25` fixed the config to a single `chromium` (desktop) project. Suites needing a narrow viewport (currently just `0zj`) set `test.use({ viewport: {...} })` locally. Revisit as a config-level project only if multiple suites need mobile width.
- **Assertion style**: web-first only (`expect(locator).toBeVisible()`/`toBeHidden()`, auto-retrying) — no `waitForTimeout` or manual polling. Interaction-implementation details (e.g. `0zj`'s drawer focus trap) are intentionally not asserted; that's better suited to a dedicated accessibility-audit tool than hand-rolled flow-level E2E.

## Target environment

- E2E runs against a deployed staging/preview environment, not a backend spun up locally or in CI — this repo has no backend, docker, or seed script to make a self-contained local backend practical.
- Buyer test account, admin test account, and a Stripe test-mode key do not exist yet and need to be created as part of this work. This is backend/infra-side provisioning outside this repo's control — `c25`, `7bd`, `dm4`, and `u4j` are blocked on it being available, not just on frontend code being written.
- Secrets (test credentials, Stripe key, base URL) live in GitHub Actions repo secrets.

## CI wiring

- New required workflow running `pnpm test` (unit) and `pnpm test:storybook` — closes an existing gap, since no current workflow (`lint.yml`, `lighthouse.yml`) runs Vitest at all despite it being mandatory per ADR-0009.
- New e2e workflow, per `c25`'s own acceptance criteria, running `test:e2e` against the deployed environment on PRs — **non-blocking/informational**, not a required check. This keeps ADR-0009's "Playwright is not part of the done criteria" intact and avoids gating merges on a brand-new suite hitting a real backend before it's proven stable.

## Delivery

One PR per issue (7 total), in the dependency order above, rather than a single combined PR — matches the existing Beads granularity and keeps each change independently reviewable and revertable.

## Consequences

- Playwright now serves two distinct purposes in this repo (Storybook browser provider, standalone e2e runner) — naming and docs need to keep them clearly separated.
- CI gains one required job (Vitest) that closes a real coverage gap, and one non-required job (e2e) whose flake tolerance is intentionally loose.
- Five Beads issue descriptions get rewritten to drop Clerk-era details before their implementation begins.
- Work on `c25` and its dependents cannot complete until staging test accounts and a Stripe test key exist — this is an open dependency on whoever owns the staging backend, not resolved by this ADR.

## Considered alternatives

- **Blocking e2e CI check**: rejected for now. ADR-0009 explicitly excludes Playwright from "done" criteria, and a new suite against a real backend is likely to flake before it's hardened. Revisit once the suite has run stably for a while.
- **Local backend in CI**: rejected. No backend, docker-compose, or seed tooling lives in this repo, so a self-contained local backend isn't currently practical; deployed staging is the pragmatic choice given existing infra.
- **Single combined PR for all 7 issues**: rejected. The issues already exist as 7 discrete, dependency-ordered Beads tasks; matching that split in PRs keeps review scope small and bisectable if one flow proves flaky.

## Open follow-ups (tracked outside this ADR)

- Provisioning staging buyer/admin test accounts and a Stripe test-mode key — owner TBD, backend/infra side.
