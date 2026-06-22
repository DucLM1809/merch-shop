# Frontend-only repo; backend is a separate project

This repository is the frontend only. The backend (database, business logic, auth server) lives in a separate project to be built later. The two communicate over a REST API with an OpenAPI spec as the contract.

## Considered Options

- Monorepo with TanStack Start server functions + Drizzle ORM
- Frontend-only + separate backend ✓

Keeping the backend separate allows it to use a different runtime, language, and deployment target without constraining the frontend. It also lets frontend work begin before the backend is ready, using MSW to mock API responses.

## Consequences

All data access in this repo goes through `fetch` calls against the OpenAPI contract — no direct DB queries or server functions that touch a database. MSW handlers mirror the OpenAPI spec during development. When the real backend ships, removing MSW is the only change required.
