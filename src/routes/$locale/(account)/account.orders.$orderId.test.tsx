import { describe, it, expect } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import enUSOrders from "@/i18n/locales/en-US/orders.json";
import { priceText, renderRoute } from "../../../test-utils";
import { server } from "../../../mocks/server";
import { BASE_URL } from "../../../api/client";
import { envelope } from "../../../mocks/handlers";
import { buyerAccount, mockSignedIn } from "../../../mocks/fixtures";
import type { Order } from "../../../api/types";

const testOrder: Order = {
  id: "ord-001",
  createdAt: "2024-01-15T10:00:00Z",
  stripePaymentIntentId: "pi_test_ord-001",
  status: "CONFIRMED",
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
};

describe("/account/orders/$orderId", () => {
  it("redirects guest to /sign-in with a redirect back to the order", async () => {
    const { router } = renderRoute("/account/orders/ord-001");
    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/en-US/sign-in");
    });
    expect(router.state.location.search).toEqual({ redirect: "/en-US/account/orders/ord-001" });
  });

  it("renders order detail for authenticated buyer: items, status, and total", async () => {
    mockSignedIn(buyerAccount);
    server.use(http.get(`${BASE_URL}/orders/:id`, () => HttpResponse.json(envelope(testOrder))));

    renderRoute("/account/orders/ord-001");

    expect(await screen.findByText(/Faker Jersey/)).toBeInTheDocument();
    expect(screen.getByTestId("order-status")).toHaveTextContent(enUSOrders.status.CONFIRMED);

    const total = screen.getByTestId("order-total");
    expect(priceText(119.98, "en-US")(total.textContent ?? "")).toBe(true);
  });

  it("renders a different status via the shared status-tone mapping", async () => {
    mockSignedIn(buyerAccount);
    const cancelledOrder: Order = { ...testOrder, status: "CANCELLED" };
    server.use(
      http.get(`${BASE_URL}/orders/:id`, () => HttpResponse.json(envelope(cancelledOrder)))
    );

    renderRoute("/account/orders/ord-001");

    expect(await screen.findByTestId("order-status")).toHaveTextContent(
      enUSOrders.status.CANCELLED
    );
  });

  it("shows a not-found message for an unknown order id", async () => {
    mockSignedIn(buyerAccount);
    server.use(http.get(`${BASE_URL}/orders/:id`, () => new HttpResponse(null, { status: 404 })));

    renderRoute("/account/orders/unknown-id");

    expect(await screen.findByText(enUSOrders.notFound)).toBeInTheDocument();
  });
});
