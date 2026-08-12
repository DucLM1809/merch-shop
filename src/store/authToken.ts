import { Store } from "@tanstack/react-store";

type AuthState = {
  accessToken: string | null;
  isLoaded: boolean;
  isSignedIn: boolean;
};

export const authStore = new Store<AuthState>({
  accessToken: null,
  isLoaded: false,
  isSignedIn: false,
});

let hardSignOutHandler: (() => void) | null = null;

export function registerHardSignOutHandler(fn: () => void): void {
  hardSignOutHandler = fn;
}

export function getAccessToken(): string | null {
  return authStore.state.accessToken;
}

export function setSession(accessToken: string): void {
  authStore.setState((s) => ({ ...s, accessToken, isSignedIn: true }));
}

// Plain state reset — used when there was never a session to begin with
// (e.g. bootstrapAuth's guest path on cold boot). Does not touch the query
// cache, since there's nothing session-scoped to clear.
export function clearSession(): void {
  authStore.setState((s) => ({ ...s, accessToken: null, isSignedIn: false, isLoaded: true }));
}

// Ends an actual session (explicit logout, or a mid-session refresh that
// failed after previously succeeding) — also clears the query cache so no
// stale account-scoped data lingers, per docs/adr/0015.
export function forceSignOut(): void {
  clearSession();
  hardSignOutHandler?.();
}

export function setLoaded(isLoaded: boolean): void {
  authStore.setState((s) => ({ ...s, isLoaded }));
}
