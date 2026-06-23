# Vitest only — no Playwright or Cypress

Browser automation tests (Playwright, Cypress) are out of scope for this project. Vitest is the full test surface, covering both unit tests and `renderRoute` integration tests.

## Rationale

The frontend is a Vite + TanStack Router SPA with MSW mocking. `renderRoute` integration tests already exercise routing, query-string state, and component interaction at a level that catches real integration bugs (as demonstrated by the facet-filtering and SPA navigation test suites). Playwright would add significant infrastructure overhead (browser binaries, CI time, flake risk) for coverage that the existing Vitest layer already provides.

## What this means

- Every new feature requires at least one Vitest test covering the new behavior before merge.
- "Done" = Vitest passes **and** the developer manually verifies the golden path in the browser (or runs `/verify`).
- `renderRoute` integration tests are first-class — they are not a substitute for "real" tests, they are the real tests.

## Considered alternatives

Playwright was the obvious alternative. It was ruled out not because browser testing is wrong, but because the cost/coverage ratio is unfavorable given how much `renderRoute` + MSW already covers. If server-side rendering, multi-tab state, or native browser APIs (clipboard, geolocation, file upload) become significant features, revisit this decision.
