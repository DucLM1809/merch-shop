# Homegrown auth replaces Clerk

Status: accepted; supersedes ADR-0006

Buyer authentication moves off Clerk onto a custom implementation against the backend's new `/auth/*` endpoints (`register`, `login`, `refresh`, `logout`, `forgot-password`, `reset-password`, `verify-email`), defined in `openapi.yaml`. The backend now issues a short-lived access token in the login response body plus a rotating refresh token as an HttpOnly cookie — a session model Clerk's SDK no longer needs to mediate.

## Considered Options

- Keep Clerk
- Homegrown auth against `/auth/*` ✓

The backend now owns credential storage, password rules, and token issuance directly, which is what made Clerk's abstraction valuable in the first place. Keeping Clerk on top of a backend that already implements its own auth would mean reconciling two identity systems (Clerk's user + the backend's Account) for no benefit — ADR-0006 explicitly flagged this migration as "meaningful lock-in," and the backend build removed the reason to pay it.

## Consequences

- The access token lives in-memory only on the frontend (never `localStorage`/`sessionStorage`); the app performs a blocking bootstrap in `__root.tsx` (`POST /auth/refresh` then `GET /account/me`) before rendering, so `isLoaded` reflects both session and role together, mirroring Clerk's `isLoaded` gate.
- `Account.role` (from `/account/me`) becomes the sole source of truth for role/admin checks, replacing Clerk's `user.publicMetadata.role`. This was already a modeled field going unused — the migration removes a duplicate-source-of-truth seam rather than creating one.
- Mid-session 401s trigger a single shared in-flight `/auth/refresh` call (not one per failed request), because the refresh token rotates on every call and concurrent un-deduped refreshes would race and fail each other.
- Auth logic lives inside the existing `account` module — no new domain. There is no external identity provider left to justify separating "auth" from "account."
- The axios client requires `withCredentials: true` globally for the refresh cookie to ride along to a cross-origin API host; the backend's CORS config must echo the exact origin with `Access-Control-Allow-Credentials: true` rather than `*`.
- Sign-up no longer returns a session (`201` with no body per spec) — the frontend auto-calls `/auth/login` with the same credentials right after register to preserve the sign-up-signs-you-in UX Clerk provided.
- The API currently exposes no `emailVerified` field anywhere, so `verify-email` ships as a standalone confirmation page with no gating banners elsewhere — reflecting a real spec gap, not a frontend choice.
