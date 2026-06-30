import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { renderRoute } from "../../test-utils";
import { server } from "../../mocks/server";
import { BASE_URL } from "../../api/client";
import { envelope } from "../../mocks/handlers";
import type { Order } from "../../api/types";

import { useAuth, useUser } from "@clerk/react";
import {
  fakerUser,
  AUTH_SIGNED_OUT,
  AUTH_SIGNED_IN,
  USER_SIGNED_OUT,
  userCtx,
} from "../../mocks/fixtures";

const mockUseAuth = vi.mocked(useAuth);
const mockUseUser = vi.mocked(useUser);

const twoOrders: Order[] = [
  {
    id: "ord-001",
    createdAt: "2024-01-15T10:00:00Z",
    status: "pending",
    total: 119.98,
    shipping: {
      fullName: "Faker",
      email: "faker@t1.gg",
      line1: "1 T1 Way",
      city: "Seoul",
      state: "Seoul",
      postalCode: "00000",
      country: "KR",
    },
    lines: [
      {
        skuId: "fj-s-black",
        productName: "Faker Jersey",
        variant: "S / Black",
        price: 59.99,
        quantity: 2,
      },
    ],
  },
  {
    id: "ord-002",
    createdAt: "2024-02-20T12:00:00Z",
    total: 79.99,
    shipping: {
      fullName: "Faker",
      email: "faker@t1.gg",
      line1: "1 T1 Way",
      city: "Seoul",
      state: "Seoul",
      postalCode: "00000",
      country: "KR",
    },
    status: "pending",
    lines: [
      {
        skuId: "lol-hoodie-m",
        productName: "League of Legends Hoodie",
        variant: "M",
        price: 79.99,
        quantity: 1,
      },
    ],
  },
];

beforeEach(() => {
  vi.clearAllMocks();
});

describe("/account/orders", () => {
  it("redirects guest to /sign-in", async () => {
    mockUseAuth.mockReturnValue(AUTH_SIGNED_OUT);
    mockUseUser.mockReturnValue(USER_SIGNED_OUT);
    const { router } = renderRoute("/account/orders");
    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/sign-in");
    });
  });

  it("renders two seeded orders for authenticated buyer", async () => {
    mockUseAuth.mockReturnValue(AUTH_SIGNED_IN);
    mockUseUser.mockReturnValue(userCtx(fakerUser));
    server.use(http.get(`${BASE_URL}/orders/mine`, () => HttpResponse.json(envelope(twoOrders))));

    renderRoute("/account/orders");

    expect(await screen.findByText(/ord-001/)).toBeInTheDocument();
    expect(screen.getByText(/Faker Jersey/)).toBeInTheDocument();
    expect(screen.getByText(/ord-002/)).toBeInTheDocument();
    expect(screen.getByText(/League of Legends Hoodie/)).toBeInTheDocument();
  });

  it("shows empty state when buyer has no orders", async () => {
    mockUseAuth.mockReturnValue(AUTH_SIGNED_IN);
    mockUseUser.mockReturnValue(userCtx(fakerUser));

    renderRoute("/account/orders");

    expect(await screen.findByText(/no orders yet/i)).toBeInTheDocument();
  });
});
