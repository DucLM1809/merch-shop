# REST + OpenAPI instead of tRPC

The API contract between frontend and backend uses REST with an OpenAPI spec, not tRPC.

## Considered Options

- tRPC — type-safe RPC, zero codegen, native to TanStack ecosystem
- REST + OpenAPI ✓

tRPC requires both sides to be TypeScript and share a single monorepo (or published type package). With the backend in a separate repo and potentially a different language, tRPC's core benefit disappears. REST + OpenAPI gives the same typed client experience (via codegen) while keeping the backend unconstrained.

## Consequences

A typed API client must be generated from the OpenAPI spec (e.g. `openapi-typescript` + `openapi-fetch`). The spec is the source of truth — changes to the backend API must update the spec before the frontend can consume them.
