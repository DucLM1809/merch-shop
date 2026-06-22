# Clerk for frontend authentication

Buyer authentication uses Clerk. Clerk handles session management, sign-up/sign-in UI, and the guest-to-account upgrade flow. It integrates with TanStack Router via its React SDK.

## Considered Options

- Clerk ✓
- Auth0
- Custom JWT against the backend

Auth0 has comparable features but heavier configuration. Custom JWT auth would require the backend to exist first, blocking frontend-auth work. Clerk ships prebuilt UI components that match the dark gaming aesthetic with minimal theming.

## Consequences

Clerk session tokens are passed as Bearer tokens to the backend REST API. When the backend is built, it must verify Clerk JWTs. Migrating away from Clerk later requires replacing both the frontend SDK and the backend verification layer — treat it as a meaningful lock-in.
