---
name: refactor
description: >
  Audit and fix TypeScript, TanStack Query, and module-structure violations
  following this project's coding conventions (docs/adr/0010). Use when the user
  says "refactor", "clean up", "check conventions", "fix TypeScript", or mentions
  any of: `any` type, import order, `interface` vs `type`, query key factories,
  direct `useQuery`/`useMutation` in components, cross-module deep imports, enums,
  missing return types, or `null` used internally. Also invoked by other skills
  needing TypeScript or module-structure validation.
---

# Convention Refactor

Audit and fix TypeScript, TanStack Query, and module-structure violations.
Full rules live in `docs/adr/0010-typescript-and-query-conventions.md`.

Chakra UI violations → `/chakra-ui-refactor` (separate skill, not covered here).

---

## Step 1 — Orient

Establish scope before reading any code:

- **File** — user names or shares a file → audit that file only
- **Module** — user names a domain (`catalog`, `cart`, `checkout`, `orders`, `account`) → audit all files under `src/modules/<domain>/`
- **Codebase** — no scope given → ask which module to start with; never audit everything blindly

Determine mode: **audit** (report only), **fix** (apply changes), or **both**.

State scope and mode at the top of your response.

---

## Step 2 — Audit

Check every file in scope against all rules. Record each violation as:

```
<file>:<line>  [ERROR|WARN|INFO]  <rule>  →  <fix>
```

### TypeScript

| Signal | Rule | Fix |
|--------|------|-----|
| `interface Foo {` without declaration merging | `type` by default | `type Foo =` |
| `: any` or `as any` | `any` banned | `: unknown` + narrowing; `as T` only at API boundary with comment |
| Exported function or component with no return type annotation | Explicit return types required on exports | add `: ReturnType` |
| `null` used internally (not stripping at API boundary) | `undefined` for absence; `null` only at API boundary | strip `null` to `undefined` at the ingest point |
| `enum` keyword | Enums banned | `as const` object + derived union |
| Import groups misordered or missing blank-line separators | Order: React → third-party → aliases (`@/`) → relative → `import type` | reorder with blank lines between groups |

### TanStack Query

| Signal | Rule | Fix |
|--------|------|-----|
| Raw string or inline array as query key | Typed key factory per domain | extract to `<domain>Keys` factory in `src/modules/<domain>/hooks/` |
| Component imports from `@tanstack/react-query` | No direct `useQuery`/`useMutation` in components | move into a custom hook under `src/modules/<domain>/hooks/` |
| Hook returns raw API shape; component reshapes the data | `select` required when component shape differs from API shape | add `select` option to the hook |
| Hook swallows `error` without returning it | Return `error` from every hook | expose `error` in the hook's return value |

### Module structure

| Signal | Rule | Fix |
|--------|------|-----|
| `import { x } from '@/modules/<domain>/hooks/...'` used across module boundary | Cross-module imports through barrel only | `import { x } from '@/modules/<domain>'` |
| Domain file placed outside its domain directory | Each domain's files stay inside `src/modules/<domain>/` | move file to the correct subdirectory |

**Completion criterion:** every exported symbol and every import path in scope checked against every rule above — no line skipped.

---

## Step 3 — Fix

Apply ERRORs first, then WARNs, then INFOs.

Show a minimal before/after for each change. Change only what the violation requires — do not rewrite logic.

If a fix cascades to callers (e.g. type change propagates), list every affected caller rather than silently leaving them broken.

**Completion criterion:** every violation from Step 2 resolved with no new violations introduced.

---

## Step 4 — Verify

```bash
npx tsc --noEmit
npx eslint src --ext .ts,.tsx --max-warnings 0
```

Fix any remaining errors before reporting done.

**Completion criterion:** zero TypeScript errors, zero ESLint errors or warnings in changed files.
