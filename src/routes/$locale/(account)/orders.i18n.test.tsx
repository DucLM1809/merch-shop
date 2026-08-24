import { describe, it, expect } from "vitest";
import { screen, waitFor, within } from "@testing-library/react";
import { http, HttpResponse } from "msw";

import { formatDate } from "@/i18n/formatDate";
import enUSOrders from "@/i18n/locales/en-US/orders.json";
import enGBOrders from "@/i18n/locales/en-GB/orders.json";
import frFROrders from "@/i18n/locales/fr-FR/orders.json";
import { priceText, renderRoute } from "@/test-utils";
import { server } from "@/mocks/server";
import { BASE_URL } from "@/api/client";
import { envelope } from "@/mocks/handlers";
import { buyerAccount, mockSignedIn } from "@/mocks/fixtures";
import type { Order } from "@/api/types";

// Orders carry three things that have to follow the locale, not the runtime: the chrome, the
// status vocabulary, and — unlike anywhere else in Phase 1 — a date. The product names in the
// lines stay untranslated, same line the catalog and cart draw.

const PLACED_AT = "2024-01-15T10:00:00Z";

const order: Order = {
  id: "ord-001",
  createdAt: PLACED_AT,
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

function serveOrder() {
  server.use(
    http.get(`${BASE_URL}/orders/mine`, () => HttpResponse.json(envelope([order]))),
    http.get(`${BASE_URL}/orders/:id`, () => HttpResponse.json(envelope(order)))
  );
}

describe("Order history across locales", () => {
  it("renders the history chrome in French under the fr-FR prefix", async () => {
    mockSignedIn(buyerAccount);
    serveOrder();

    renderRoute("/fr-FR/account/orders");

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: frFROrders.history.title })).toBeInTheDocument();
    });

    expect(screen.queryByText(enUSOrders.history.title)).not.toBeInTheDocument();
  });

  it("translates the empty state", async () => {
    mockSignedIn(buyerAccount);
    server.use(http.get(`${BASE_URL}/orders/mine`, () => HttpResponse.json(envelope([]))));

    renderRoute("/fr-FR/account/orders");

    expect(await screen.findByText(frFROrders.history.empty)).toBeInTheDocument();
  });

  it("numbers an order the way the locale numbers one", async () => {
    mockSignedIn(buyerAccount);
    serveOrder();

    renderRoute("/fr-FR/account/orders");

    const expected = frFROrders.orderNumber.replace("{{id}}", order.id);

    expect(await screen.findByText(expected)).toBeInTheDocument();
  });
});

describe("Order status across locales", () => {
  it("names the status in the active locale rather than echoing the API's enum", async () => {
    mockSignedIn(buyerAccount);
    serveOrder();

    renderRoute("/fr-FR/account/orders/ord-001");

    await waitFor(() => {
      expect(screen.getByTestId("order-status")).toHaveTextContent(frFROrders.status.CONFIRMED);
    });

    // The raw wire value must not reach a buyer.
    expect(screen.getByTestId("order-status")).not.toHaveTextContent("CONFIRMED");
  });
});

describe("Order dates across locales", () => {
  it("formats the placed-on date for the locale in the URL", async () => {
    mockSignedIn(buyerAccount);
    serveOrder();

    renderRoute("/fr-FR/account/orders/ord-001");

    const expected = frFROrders.placed.replace("{{date}}", formatDate(PLACED_AT, "fr-FR"));

    expect(await screen.findByText(expected)).toBeInTheDocument();
  });

  it("writes the same instant differently per locale", async () => {
    mockSignedIn(buyerAccount);
    serveOrder();

    const { unmount } = renderRoute("/en-US/account/orders");

    expect(await screen.findByText(formatDate(PLACED_AT, "en-US"))).toBeInTheDocument();

    unmount();

    renderRoute("/fr-FR/account/orders");

    expect(await screen.findByText(formatDate(PLACED_AT, "fr-FR"))).toBeInTheDocument();
    // The US spelling of the same day is not what a French reader gets.
    expect(formatDate(PLACED_AT, "fr-FR")).not.toBe(formatDate(PLACED_AT, "en-US"));
  });
});

describe("Order amounts across locales", () => {
  it("formats the order total for the locale in the URL", async () => {
    mockSignedIn(buyerAccount);
    serveOrder();

    renderRoute("/fr-FR/account/orders/ord-001");

    const total = await screen.findByTestId("order-total");

    expect(priceText(119.98, "fr-FR")(total.textContent ?? "")).toBe(true);
  });

  it("leaves the product name untranslated beside the translated chrome", async () => {
    mockSignedIn(buyerAccount);
    serveOrder();

    renderRoute("/fr-FR/account/orders/ord-001");

    await screen.findByText("Faker Jersey");

    expect(screen.getByRole("heading", { name: frFROrders.items })).toBeInTheDocument();
  });
});

describe("Order chrome under en-GB", () => {
  it("calls the address section delivery rather than shipping", async () => {
    mockSignedIn(buyerAccount);
    serveOrder();

    renderRoute("/en-GB/account/orders/ord-001");

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: enGBOrders.shipping })).toBeInTheDocument();
    });

    // The word that separates the two English locales.
    expect(enGBOrders.shipping).not.toBe(enUSOrders.shipping);
  });

  it("still shows the order's own total in the row", async () => {
    mockSignedIn(buyerAccount);
    serveOrder();

    renderRoute("/en-GB/account/orders");

    const row = await screen.findByTestId(`order-row-${order.id}`);

    expect(within(row).getByText(/119/)).toBeInTheDocument();
  });
});
