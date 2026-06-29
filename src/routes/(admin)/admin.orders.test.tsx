import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor, fireEvent } from "@testing-library/react";
import { http, HttpResponse } from "msw";

import { renderRoute } from "../../test-utils";
import { server } from "../../mocks/server";
import { BASE_URL } from "../../api/client";

import type { Order } from "../../api/types";

import { useAuth, useUser } from "@clerk/react";
import { adminUser, AUTH_SIGNED_IN, userCtx } from "../../mocks/fixtures";

const mockUseAuth = vi.mocked(useAuth);
const mockUseUser = vi.mocked(useUser);

const testOrders: Order[] = [
  {
    id: "ord_001",
    status: "pending",
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
    status: "delivered",
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
    server.use(http.get(`${BASE_URL}/orders`, () => HttpResponse.json(testOrders)));

    renderRoute("/admin/orders");

    expect(await screen.findByText("#ord_001")).toBeInTheDocument();
    expect(screen.getByText("pending")).toBeInTheDocument();
    expect(screen.getByText("#ord_002")).toBeInTheDocument();
    expect(screen.getByText("delivered")).toBeInTheDocument();
  });

  it("shows empty state when no orders", async () => {
    server.use(http.get(`${BASE_URL}/orders`, () => HttpResponse.json([])));

    renderRoute("/admin/orders");

    expect(await screen.findByText(/no orders yet/i)).toBeInTheDocument();
  });

  it("shows Cancel button for pending order when expanded", async () => {
    server.use(http.get(`${BASE_URL}/orders`, () => HttpResponse.json(testOrders)));

    renderRoute("/admin/orders");

    fireEvent.click(await screen.findByText("#ord_001"));
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("→ Processing")).toBeInTheDocument();
  });

  it("shows Refund button for delivered order when expanded", async () => {
    server.use(http.get(`${BASE_URL}/orders`, () => HttpResponse.json(testOrders)));

    renderRoute("/admin/orders");

    fireEvent.click(await screen.findByText("#ord_002"));
    expect(screen.getByText("Refund")).toBeInTheDocument();
  });

  it("Cancel fires PATCH /orders/:id/status with cancelled", async () => {
    server.use(http.get(`${BASE_URL}/orders`, () => HttpResponse.json(testOrders)));

    let patchedStatus: string | null = null;
    let patchedId: string | null = null;
    server.use(
      http.patch(`${BASE_URL}/orders/:id/status`, async ({ params, request }) => {
        const body = (await request.json()) as { status: string };
        patchedId = params.id as string;
        patchedStatus = body.status;
        return HttpResponse.json({ ...testOrders[0], status: body.status });
      })
    );

    renderRoute("/admin/orders");

    fireEvent.click(await screen.findByText("#ord_001"));
    fireEvent.click(screen.getByText("Cancel"));

    await waitFor(() => {
      expect(patchedId).toBe("ord_001");
      expect(patchedStatus).toBe("cancelled");
    });
  });

  it("→ Processing fires PATCH with processing status", async () => {
    server.use(http.get(`${BASE_URL}/orders`, () => HttpResponse.json(testOrders)));

    let patchedStatus: string | null = null;
    server.use(
      http.patch(`${BASE_URL}/orders/:id/status`, async ({ request }) => {
        const body = (await request.json()) as { status: string };
        patchedStatus = body.status;
        return HttpResponse.json({ ...testOrders[0], status: body.status });
      })
    );

    renderRoute("/admin/orders");

    fireEvent.click(await screen.findByText("#ord_001"));
    fireEvent.click(screen.getByText("→ Processing"));

    await waitFor(() => expect(patchedStatus).toBe("processing"));
  });
});
