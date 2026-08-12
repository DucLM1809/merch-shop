import { http, HttpResponse } from "msw";

import { BASE_URL } from "../api/client";
import type { Account } from "../api/types";
import { envelope } from "./handlers";
import { server } from "./server";

export const adminAccount: Account = {
  id: "acc_admin",
  email: "admin@test.com",
  role: "admin",
  createdAt: "2026-01-01T00:00:00Z",
};

export const buyerAccount: Account = {
  id: "acc_buyer",
  email: "buyer@test.com",
  role: "customer",
  createdAt: "2026-01-01T00:00:00Z",
};

/** Override the auth MSW handlers so bootstrapAuth() resolves as signed in with the given account. */
export function mockSignedIn(account: Account = buyerAccount): void {
  server.use(
    http.post(`${BASE_URL}/auth/refresh`, () =>
      HttpResponse.json(envelope({ accessToken: "mock-access-token" }))
    ),
    http.get(`${BASE_URL}/account/me`, () => HttpResponse.json(envelope(account)))
  );
}
