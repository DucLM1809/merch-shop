import { useAuth, useUser } from "@clerk/react";

// ponytail: as unknown casts valid at test mock boundary — Clerk types require full objects not needed in tests
export const adminUser = {
  firstName: "Admin",
  emailAddresses: [{ emailAddress: "admin@test.com" }],
  publicMetadata: { role: "admin" },
};

export const buyerUser = {
  firstName: "Buyer",
  emailAddresses: [{ emailAddress: "buyer@test.com" }],
  publicMetadata: { role: "buyer" },
};

export const fakerUser = {
  firstName: "Faker",
  emailAddresses: [{ emailAddress: "faker@t1.gg" }],
};

export const AUTH_SIGNED_OUT = {
  isLoaded: true,
  isSignedIn: false,
} as unknown as ReturnType<typeof useAuth>;

export const AUTH_SIGNED_IN = {
  isLoaded: true,
  isSignedIn: true,
} as unknown as ReturnType<typeof useAuth>;

export const USER_SIGNED_OUT = {
  isLoaded: true,
  isSignedIn: false,
  user: null,
} as unknown as ReturnType<typeof useUser>;

export const userCtx = (user: object) =>
  ({ isLoaded: true, isSignedIn: true, user }) as unknown as ReturnType<typeof useUser>;
