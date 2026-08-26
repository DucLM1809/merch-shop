import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";

import { renderRoute } from "../../../test-utils";
import { server } from "../../../mocks/server";
import { BASE_URL } from "../../../api/client";
import { envelope } from "../../../mocks/handlers";

import type { RawProduct, RawSku } from "../../../api/types";

import { adminAccount, buyerAccount, mockSignedIn } from "../../../mocks/fixtures";

// Nested `game`/`attributes` match the real backend's wire shape — see the
// Raw* types in api/types.ts and merch-shop-11d.
const productWithSkus: RawProduct = {
  id: "p1",
  name: "Jinx Hoodie",
  game: { id: "lol", name: "League of Legends", slug: "league-of-legends" },
  skus: [
    { id: "sku-1", price: 49.99, available: true, attributes: { size: "M", color: "Black" } },
    { id: "sku-2", price: 29.99, available: false, attributes: { size: "L", color: "White" } },
  ],
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("/admin/skus", () => {
  it("redirects unauthenticated user to /sign-in", async () => {
    const { router } = renderRoute("/admin/skus");
    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/en-US/sign-in");
    });
  });

  it("redirects signed-in non-admin to /", async () => {
    mockSignedIn(buyerAccount);
    const { router } = renderRoute("/admin/skus");
    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/en-US");
    });
  });

  it("renders SKU rows for admin user", async () => {
    mockSignedIn(adminAccount);
    server.use(
      http.get(`${BASE_URL}/products`, () => HttpResponse.json(envelope([productWithSkus])))
    );

    renderRoute("/admin/skus");

    expect(await screen.findAllByText("Jinx Hoodie")).toHaveLength(2);
    expect(screen.getByText("$49.99")).toBeInTheDocument();
    expect(screen.getByText("$29.99")).toBeInTheDocument();
  });

  it("renders SKUs as a real table with column headers and rows", async () => {
    mockSignedIn(adminAccount);
    server.use(
      http.get(`${BASE_URL}/products`, () => HttpResponse.json(envelope([productWithSkus])))
    );

    renderRoute("/admin/skus");

    await screen.findByText("$49.99");

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Product" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Price" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Size" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Color" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Edition" })).toBeInTheDocument();
    // Header row + one row per SKU.
    expect(screen.getAllByRole("row")).toHaveLength(1 + (productWithSkus.skus?.length ?? 0));
  });

  it("shows empty state when no SKUs", async () => {
    mockSignedIn(adminAccount);
    server.use(http.get(`${BASE_URL}/products`, () => HttpResponse.json(envelope([]))));

    renderRoute("/admin/skus");

    expect(await screen.findByText(/no skus yet/i)).toBeInTheDocument();
  });

  it("create form fires POST /skus", async () => {
    mockSignedIn(adminAccount);
    server.use(
      http.get(`${BASE_URL}/products`, () => HttpResponse.json(envelope([productWithSkus])))
    );

    let posted = false;
    server.use(
      http.post(`${BASE_URL}/skus`, async () => {
        posted = true;
        const created: RawSku = {
          id: "new-sku",
          price: 19.99,
          available: true,
          attributes: { size: "S" },
        };
        return HttpResponse.json(envelope(created), { status: 201 });
      })
    );

    renderRoute("/admin/skus");

    const user = userEvent.setup();
    await user.click(await screen.findByRole("button", { name: /\+ new sku/i }));
    await user.selectOptions(screen.getByDisplayValue("Product…"), "p1");
    await user.type(screen.getByPlaceholderText("Price (e.g. 29.99)"), "19.99");
    await user.click(screen.getByRole("button", { name: /^save$/i }));

    await waitFor(() => expect(posted).toBe(true));
  });

  it("availability toggle fires PATCH /skus/:id/availability", async () => {
    mockSignedIn(adminAccount);
    server.use(
      http.get(`${BASE_URL}/products`, () => HttpResponse.json(envelope([productWithSkus])))
    );

    let patched = false;
    server.use(
      http.patch(`${BASE_URL}/skus/:id/availability`, async () => {
        patched = true;
        const updated: RawSku = { id: "sku-1", price: 49.99, available: false, attributes: {} };
        return HttpResponse.json(envelope(updated));
      })
    );

    renderRoute("/admin/skus");

    const user = userEvent.setup();
    const availableBtns = await screen.findAllByRole("button", { name: /^available$/i });
    await user.click(availableBtns[0]);

    await waitFor(() => expect(patched).toBe(true));
  });

  it("bulk apply fires PATCH /skus/availability/bulk", async () => {
    mockSignedIn(adminAccount);
    server.use(
      http.get(`${BASE_URL}/products`, () => HttpResponse.json(envelope([productWithSkus])))
    );

    let patchedBody: unknown = null;
    server.use(
      http.patch(`${BASE_URL}/skus/availability/bulk`, async ({ request }) => {
        patchedBody = await request.json();
        return HttpResponse.json({ ok: true });
      })
    );

    renderRoute("/admin/skus");

    const user = userEvent.setup();
    await screen.findByRole("option", { name: "League of Legends" });
    await user.selectOptions(screen.getByLabelText("Facet value"), "lol");
    await user.click(screen.getByRole("button", { name: /^apply$/i }));

    await waitFor(() =>
      expect(patchedBody).toEqual({ facet: "game", facetId: "lol", available: true })
    );
  });

  it("delete fires DELETE /skus/:id", async () => {
    mockSignedIn(adminAccount);
    server.use(
      http.get(`${BASE_URL}/products`, () => HttpResponse.json(envelope([productWithSkus])))
    );

    let deleted = false;
    server.use(
      http.delete(`${BASE_URL}/skus/:id`, () => {
        deleted = true;
        return HttpResponse.json({ ok: true });
      })
    );

    renderRoute("/admin/skus");

    const user = userEvent.setup();
    const deleteBtns = await screen.findAllByRole("button", { name: /^delete$/i });
    await user.click(deleteBtns[0]);
    await user.click(screen.getByRole("button", { name: /^confirm$/i }));

    await waitFor(() => expect(deleted).toBe(true));
  });
});
