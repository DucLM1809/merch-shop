# Vitest primary — Playwright optional supplement

Vitest is the primary and mandatory test surface, covering unit tests and `renderRoute` integration tests. Playwright is an optional, lowest-priority supplement for full end-to-end flows that Vitest cannot cover.

## Rationale

The frontend is a Vite + TanStack Router SPA with MSW mocking. `renderRoute` integration tests already exercise routing, query-string state, and component interaction at a level that catches real integration bugs (as demonstrated by the facet-filtering and SPA navigation test suites). Vitest + MSW cannot catch real backend contract mismatches, multi-step cross-page flows, or full auth redirects against a live server — Playwright fills that gap selectively.

## What this means

- Every new feature requires at least one Vitest test covering the new behavior before merge.
- "Done" = Vitest passes **and** the developer manually verifies the golden path in the browser (or runs `/verify`). Playwright is **not** part of the done criteria.
- The unit suite (`pnpm test`) runs in CI (`.github/workflows/test.yml`) on every PR and fails the check on a red test — this is the gate that can't be bypassed by a skipped or `--no-verify`'d pre-commit hook. The `test:storybook` project and the `vite.config.ts` coverage thresholds are not enforced in CI yet.
- The `.husky/pre-commit` hook still runs `pnpm test` locally, unchanged — it gives fast feedback before a push; CI is the backstop that can't be skipped.
- `renderRoute` integration tests are first-class — they are not a substitute for "real" tests, they are the real tests.
- Playwright tests are written manually, at lowest priority, only when an issue is explicitly labeled `needs-e2e` by human triage.
- Playwright tests are never auto-generated as part of issue resolution loops.

## Considered alternatives

Playwright as the primary E2E layer was ruled out: the cost/coverage ratio is unfavorable given how much `renderRoute` + MSW already covers, and the infra overhead (browser binaries, CI time, flake risk) is not justified for routine feature work. The hybrid approach — Vitest mandatory, Playwright opt-in via `needs-e2e` label — keeps infra lean while leaving room for flows that genuinely require a real browser.
