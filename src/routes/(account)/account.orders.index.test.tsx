import { describe, it, expect } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { renderRoute } from "../../test-utils";
import { server } from "../../mocks/server";
import { BASE_URL } from "../../api/client";
import { envelope } from "../../mocks/handlers";
import { buyerAccount, mockSignedIn } from "../../mocks/fixtures";
import type { Order } from "../../api/types";

const twoOrders: Order[] = [
  {
    id: "ord-001",
    createdAt: "2024-01-15T10:00:00Z",
    stripePaymentIntentId: "pi_test_ord-001",
    status: "PENDING",
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
    stripePaymentIntentId: "pi_test_ord-002",
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
    status: "PENDING",
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

describe("/account/orders", () => {
  it("redirects guest to /sign-in", async () => {
    const { router } = renderRoute("/account/orders");
    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/sign-in");
    });
  });

  it("redirects guest to /sign-in with a redirect back to /account/orders", async () => {
    const { router } = renderRoute("/account/orders");
    await waitFor(() => {
      expect(router.state.location.search).toEqual({ redirect: "/account/orders" });
    });
  });

  it("renders two seeded orders for authenticated buyer", async () => {
    mockSignedIn(buyerAccount);
    server.use(http.get(`${BASE_URL}/orders/mine`, () => HttpResponse.json(envelope(twoOrders))));

    renderRoute("/account/orders");

    expect(await screen.findByText(/ord-001/)).toBeInTheDocument();
    expect(screen.getByText(/Faker Jersey/)).toBeInTheDocument();
    expect(screen.getByText(/ord-002/)).toBeInTheDocument();
    expect(screen.getByText(/League of Legends Hoodie/)).toBeInTheDocument();
  });

  it("shows empty state when buyer has no orders", async () => {
    mockSignedIn(buyerAccount);

    renderRoute("/account/orders");

    expect(await screen.findByText(/no orders yet/i)).toBeInTheDocument();
  });

  it("shows a status badge for each order and links each row to its detail page", async () => {
    mockSignedIn(buyerAccount);
    server.use(http.get(`${BASE_URL}/orders/mine`, () => HttpResponse.json(envelope(twoOrders))));

    renderRoute("/account/orders");

    await screen.findByText(/ord-001/);

    expect(screen.getByTestId("order-status-ord-001")).toHaveTextContent("PENDING");
    expect(screen.getByRole("link", { name: /order #ord-001/i })).toHaveAttribute(
      "href",
      "/account/orders/ord-001"
    );
    expect(screen.getByRole("link", { name: /order #ord-002/i })).toHaveAttribute(
      "href",
      "/account/orders/ord-002"
    );
  });
});
