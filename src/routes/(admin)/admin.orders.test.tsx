import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";

import { renderRoute } from "../../test-utils";
import { server } from "../../mocks/server";
import { BASE_URL } from "../../api/client";
import { envelope } from "../../mocks/handlers";

import type { Order } from "../../api/types";

import { useAuth, useUser } from "@clerk/react";
import { adminUser, AUTH_SIGNED_IN, userCtx } from "../../mocks/fixtures";

const mockUseAuth = vi.mocked(useAuth);
const mockUseUser = vi.mocked(useUser);

const testOrders: Order[] = [
  {
    id: "ord_001",
    status: "PENDING",
    total: 59.99,
    createdAt: "2026-06-20T10:00:00Z",
    shipping: {
      fullName: "Alex Kim",
      email: "alex@example.com",
      line1: "123 Main St",
      city: "Seoul",
      state: "Seoul",
      postalCode: "04524",
      country: "KR",
    },
    lines: [
      {
        skuId: "fj-m-black",
        productName: "Faker Jersey",
        variant: "M / Black",
        price: 59.99,
        quantity: 1,
      },
    ],
  },
  {
    id: "ord_002",
    status: "FORWARDED",
    total: 79.99,
    createdAt: "2026-06-22T14:30:00Z",
    shipping: {
      fullName: "Jordan Park",
      email: "jordan@example.com",
      line1: "456 Oak Ave",
      city: "Los Angeles",
      state: "CA",
      postalCode: "90001",
      country: "US",
    },
    lines: [
      {
        skuId: "lol-hoodie",
        productName: "League of Legends Hoodie",
        variant: "Standard",
        price: 79.99,
        quantity: 1,
      },
    ],
  },
];

beforeEach(() => {
  vi.clearAllMocks();
  mockUseAuth.mockReturnValue(AUTH_SIGNED_IN);
  mockUseUser.mockReturnValue(userCtx(adminUser));
});

describe("/admin/orders", () => {
  it("renders order rows with status badges", async () => {
    server.use(http.get(`${BASE_URL}/orders`, () => HttpResponse.json(envelope(testOrders))));

    renderRoute("/admin/orders");

    expect(await screen.findByText("#ord_001")).toBeInTheDocument();
    expect(screen.getByText("PENDING")).toBeInTheDocument();
    expect(screen.getByText("#ord_002")).toBeInTheDocument();
    expect(screen.getByText("FORWARDED")).toBeInTheDocument();
  });

  it("shows empty state when no orders", async () => {
    server.use(http.get(`${BASE_URL}/orders`, () => HttpResponse.json(envelope([]))));

    renderRoute("/admin/orders");

    expect(await screen.findByText(/no orders yet/i)).toBeInTheDocument();
  });

  it("shows Retry Fulfillment button when expanded", async () => {
    server.use(http.get(`${BASE_URL}/orders`, () => HttpResponse.json(envelope(testOrders))));

    renderRoute("/admin/orders");

    const user = userEvent.setup();
    await user.click(await screen.findByText("#ord_001"));
    expect(screen.getByRole("button", { name: /retry fulfillment/i })).toBeInTheDocument();
  });

  it("hides Retry Fulfillment button for a FORWARDED order", async () => {
    server.use(http.get(`${BASE_URL}/orders`, () => HttpResponse.json(envelope(testOrders))));

    renderRoute("/admin/orders");

    const user = userEvent.setup();
    await user.click(await screen.findByText("#ord_002"));
    expect(screen.queryByRole("button", { name: /retry fulfillment/i })).not.toBeInTheDocument();
  });

  it("Retry Fulfillment fires POST /orders/:id/retry-fulfillment", async () => {
    server.use(http.get(`${BASE_URL}/orders`, () => HttpResponse.json(envelope(testOrders))));

    let calledId: string | null = null;
    server.use(
      http.post(`${BASE_URL}/orders/:id/retry-fulfillment`, ({ params }) => {
        calledId = params.id as string;
        return HttpResponse.json(envelope(testOrders[0]));
      })
    );

    renderRoute("/admin/orders");

    const user = userEvent.setup();
    await user.click(await screen.findByText("#ord_001"));
    await user.click(screen.getByRole("button", { name: /retry fulfillment/i }));

    await waitFor(() => expect(calledId).toBe("ord_001"));
  });
});
