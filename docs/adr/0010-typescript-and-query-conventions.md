# TypeScript and TanStack Query conventions

This ADR records coding conventions for TypeScript and TanStack Query across the codebase, and establishes the modular monolith directory structure.

## TypeScript

### Types vs interfaces

Use `type` by default. Use `interface` only when declaration merging is required or when building complex intersections that benefit from `extends`.

### `any` is banned

`any` is a hard ban. Use `unknown` with type narrowing instead. Type assertions (`as T`) are permitted only at API/external boundaries and must include a comment explaining why inference is insufficient.

### Return types

Explicit return types are required on all exported functions and React components. Internal helpers and arrow functions inside components may rely on inference.

### Null vs undefined

`undefined` represents absence of value internally. `null` is permitted only at API boundaries where the backend contract requires it. Strip `null` to `undefined` before passing values into the application layer.

### Enums are banned

Use `as const` objects with a derived union type instead:

```ts
const ORDER_STATUS = { pending: 'pending', shipped: 'shipped' } as const
type OrderStatus = typeof ORDER_STATUS[keyof typeof ORDER_STATUS]
```

Enums produce surprising runtime reverse-mapping and cannot be tree-shaken cleanly.

### Import order

Imports must appear in this order, with one blank line between each group:

1. React / framework (`react`, `react-dom`)
2. Third-party libraries
3. Internal aliases (`@/components`, `@/store`, etc.)
4. Relative imports
5. Type-only imports (`import type ...`)

Enforce with `@trivago/prettier-plugin-sort-imports` or `eslint-plugin-import`.

## Formatting

- Maximum line length: 100 characters. Enforced by Prettier.
- One blank line between JSX sibling groups within a component.
- One blank line between top-level declarations in a file.
- Two blank lines between separate exported functions or components in the same file.

## TanStack Query

### Query key factories

Every domain uses a typed key factory. Keys are never raw strings or ad-hoc arrays.

```ts
export const orderKeys = {
  all: ['orders'] as const,
  list: () => [...orderKeys.all, 'list'] as const,
  detail: (id: string) => [...orderKeys.all, 'detail', id] as const,
}
```

### Custom hooks wrapping

`useQuery` and `useMutation` are never called directly in components. Every query or mutation is wrapped in a custom hook inside the owning module's `hooks/` directory. Components never import from `@tanstack/react-query` directly.

### `select` for shape transformation

When the raw API response shape differs from what the component needs, the custom hook must use the `select` option to transform the data. Components receive the already-transformed type; they do not reshape API data themselves.

### Default cache settings

Set on `QueryClient` globally:

```ts
defaultOptions: {
  queries: {
    staleTime: 60_000,
    gcTime: 300_000,
  },
}
```

Override per-hook only for documented exceptions:
- Real-time data (e.g. cart): `staleTime: 0`
- Static reference data (e.g. catalog facets): `staleTime: Infinity`

### Error handling

Custom hooks return `error` from the query/mutation result. The component decides how to present the error (inline state, toast, etc.). Global `QueryClient` `onError` is reserved for unrecoverable errors only (e.g. 401 auth expiry → redirect).

## Module structure

The codebase follows a modular monolith layout. The five domains are: `catalog`, `cart`, `checkout`, `orders`, `account`.

Each domain lives under `src/modules/<domain>/`:

```
src/
  modules/
    catalog/
      hooks/       ← useQuery/useMutation hooks for this domain
      components/  ← domain-specific UI components
      types.ts     ← domain types
      index.ts     ← public barrel export
    cart/
      ...
  api/             ← shared HTTP client and base types (cross-domain)
  components/      ← shared/cross-domain UI components
  routes/          ← TanStack Router route tree
  store/           ← global Zustand store
```

Cross-module imports must go through the domain's `index.ts` barrel. Deep imports (`import { x } from '@/modules/orders/hooks/useOrders'`) across module boundaries are banned.

## Considered alternatives

- `interface` as the default type keyword: rejected — `type` is more flexible and covers all cases; `interface` is additive only when merging is genuinely needed.
- Per-component colocated query hooks: rejected — two components needing the same query would duplicate the hook; shared `hooks/` inside the owning module avoids this.
- Flat `src/api/<domain>.ts` structure: rejected in favour of `src/modules/<domain>/` so that hooks, components, and types for a domain are colocated and the module boundary is explicit.
