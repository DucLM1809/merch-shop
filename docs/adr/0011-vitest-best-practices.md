# Vitest best practices

This document records the testing conventions agreed for this codebase. It extends ADR-0009 (Vitest-only, no browser automation).

## Rules

### Use `userEvent` over `fireEvent`

All user interactions use `@testing-library/user-event` (`userEvent.setup()` inside each `it()`). `fireEvent` is banned except where `userEvent` genuinely cannot express the interaction.

`userEvent` fires the full pointer/focus/keyboard event chain the browser would, catching bugs `fireEvent` silently passes (disabled buttons, focus traps, event propagation).

```ts
it("saves the form", async () => {
  const user = userEvent.setup();
  await user.click(screen.getByRole("button", { name: "Save" }));
});
```

### Prefer role-based queries

Query priority: `getByRole` → `getByLabelText` → `getByPlaceholderText` → `getByDisplayValue` → `getByText`. `getByText` is a last resort for non-interactive elements.

Role queries catch accessibility regressions (a button that loses its accessible name breaks the test).

```ts
// preferred
screen.getByRole("button", { name: "Cancel" });
screen.findAllByRole("button", { name: "Delete" });

// last resort (non-interactive text)
screen.getByText(/no orders yet/i);
```

### Centralize the Clerk mock

`vi.mock('@clerk/react', ...)` lives in `src/test-setup.ts` and applies globally. Test files import and wrap with `vi.mocked()`:

```ts
import { useAuth, useUser } from "@clerk/react";
const mockUseAuth = vi.mocked(useAuth);
const mockUseUser = vi.mocked(useUser);
```

No per-file `vi.mock('@clerk/react', ...)` blocks.

### Shared fixtures

Common user shapes live in `src/mocks/fixtures.ts` (`adminUser`, `buyerUser`, `fakerUser`). Import them instead of defining inline per file.

### Coverage

Provider: `v8`. Thresholds enforced in CI: `branches: 80`, `lines: 80`. Run with `vitest run --coverage`.

### Hook unit tests

Custom hooks (TanStack Query wrappers) do not need dedicated `renderHook` tests. Component-level `renderRoute` coverage is sufficient unless a hook contains non-trivial logic (transforms, derived state, multi-step side effects).

## Rationale

- `userEvent` has caught real bugs in this codebase class (disabled-button clicks that `fireEvent` passed silently).
- Role queries enforce the accessible name contract at no extra cost.
- Centralizing the Clerk mock means one edit when Clerk's API changes, not nine.
- `v8` coverage is zero-dep and fast enough for this repo size; `istanbul` branch accuracy gap is immaterial here.

## Considered alternatives

`istanbul` for coverage — ruled out; no measurable accuracy benefit at this scale, adds a dev dependency.

Per-file Clerk mocks — current state before this ADR; ruled out due to maintenance cost and copy-paste drift risk.
