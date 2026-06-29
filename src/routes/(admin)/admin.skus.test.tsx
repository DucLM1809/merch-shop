import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor, fireEvent } from "@testing-library/react";
import { http, HttpResponse } from "msw";

import { renderRoute } from "../../test-utils";
import { server } from "../../mocks/server";
import { BASE_URL } from "../../api/client";

import type { Product, SKU } from "../../api/types";

import { useAuth, useUser } from "@clerk/react";
import {
  adminUser,
  buyerUser,
  AUTH_SIGNED_OUT,
  AUTH_SIGNED_IN,
  USER_SIGNED_OUT,
  userCtx,
} from "../../mocks/fixtures";

const mockUseAuth = vi.mocked(useAuth);
const mockUseUser = vi.mocked(useUser);

const twoSkus: SKU[] = [
  { id: "sku-1", price: 49.99, available: true, size: "M", color: "Black" },
  { id: "sku-2", price: 29.99, available: false, size: "L", color: "White" },
];

const productWithSkus: Product = {
  id: "p1",
  slug: "jinx-hoodie",
  name: "Jinx Hoodie",
  price: 49.99,
  publisherId: "riot",
  publisherSlug: "riot-games",
  gameId: "lol",
  gameSlug: "league-of-legends",
  skus: twoSkus,
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("/admin/skus", () => {
  it("redirects unauthenticated user to /sign-in", async () => {
    mockUseAuth.mockReturnValue(AUTH_SIGNED_OUT);
    mockUseUser.mockReturnValue(USER_SIGNED_OUT);
    const { router } = renderRoute("/admin/skus");
    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/sign-in");
    });
  });

  it("redirects signed-in non-admin to /", async () => {
    mockUseAuth.mockReturnValue(AUTH_SIGNED_IN);
    mockUseUser.mockReturnValue(userCtx(buyerUser));
    const { router } = renderRoute("/admin/skus");
    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/");
    });
  });

  it("renders SKU rows for admin user", async () => {
    mockUseAuth.mockReturnValue(AUTH_SIGNED_IN);
    mockUseUser.mockReturnValue(userCtx(adminUser));
    server.use(http.get(`${BASE_URL}/products`, () => HttpResponse.json([productWithSkus])));

    renderRoute("/admin/skus");

    expect(await screen.findAllByText("Jinx Hoodie")).toHaveLength(twoSkus.length);
    expect(screen.getByText("$49.99")).toBeInTheDocument();
    expect(screen.getByText("$29.99")).toBeInTheDocument();
  });

  it("shows empty state when no SKUs", async () => {
    mockUseAuth.mockReturnValue(AUTH_SIGNED_IN);
    mockUseUser.mockReturnValue(userCtx(adminUser));
    server.use(http.get(`${BASE_URL}/products`, () => HttpResponse.json([])));

    renderRoute("/admin/skus");

    expect(await screen.findByText(/no skus yet/i)).toBeInTheDocument();
  });

  it("create form fires POST /skus", async () => {
    mockUseAuth.mockReturnValue(AUTH_SIGNED_IN);
    mockUseUser.mockReturnValue(userCtx(adminUser));
    server.use(http.get(`${BASE_URL}/products`, () => HttpResponse.json([productWithSkus])));

    let posted = false;
    server.use(
      http.post(`${BASE_URL}/skus`, async () => {
        posted = true;
        const created: SKU = { id: "new-sku", price: 19.99, available: true, size: "S" };
        return HttpResponse.json(created, { status: 201 });
      })
    );

    renderRoute("/admin/skus");

    fireEvent.click(await screen.findByText("+ New SKU"));
    fireEvent.change(screen.getByDisplayValue("Product…"), { target: { value: "p1" } });
    fireEvent.change(screen.getByPlaceholderText("Price (e.g. 29.99)"), {
      target: { value: "19.99" },
    });
    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => expect(posted).toBe(true));
  });

  it("availability toggle fires PATCH /skus/:id/availability", async () => {
    mockUseAuth.mockReturnValue(AUTH_SIGNED_IN);
    mockUseUser.mockReturnValue(userCtx(adminUser));
    server.use(http.get(`${BASE_URL}/products`, () => HttpResponse.json([productWithSkus])));

    let patched = false;
    server.use(
      http.patch(`${BASE_URL}/skus/:id/availability`, async () => {
        patched = true;
        return HttpResponse.json({ id: "sku-1", price: 49.99, available: false });
      })
    );

    renderRoute("/admin/skus");

    const availableBtns = await screen.findAllByText("Available");
    fireEvent.click(availableBtns[0]);

    await waitFor(() => expect(patched).toBe(true));
  });

  it("delete fires DELETE /skus/:id", async () => {
    mockUseAuth.mockReturnValue(AUTH_SIGNED_IN);
    mockUseUser.mockReturnValue(userCtx(adminUser));
    server.use(http.get(`${BASE_URL}/products`, () => HttpResponse.json([productWithSkus])));

    let deleted = false;
    server.use(
      http.delete(`${BASE_URL}/skus/:id`, () => {
        deleted = true;
        return HttpResponse.json({ ok: true });
      })
    );

    renderRoute("/admin/skus");

    const deleteBtns = await screen.findAllByText("Delete");
    fireEvent.click(deleteBtns[0]);
    fireEvent.click(screen.getByText("Confirm"));

    await waitFor(() => expect(deleted).toBe(true));
  });
});
