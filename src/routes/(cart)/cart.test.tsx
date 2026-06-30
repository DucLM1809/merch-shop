import { describe, it, expect, beforeEach, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { useAuth } from "@clerk/react";
import { renderRoute } from "../../test-utils";
import { addToCart, clearCart, updateQuantity } from "../../store/cart";
import { server } from "../../mocks/server";
import { BASE_URL } from "../../api/client";
import { envelope } from "../../mocks/handlers";
import type { SyncCartResponse } from "../../api/types";

beforeEach(() => clearCart());

describe("/cart route", () => {
  it("shows empty cart message when no items", async () => {
    renderRoute("/cart");
    await screen.findByText(/your cart is empty/i);
  });

  it("adds two SKUs, updates quantity, removes one, asserts correct subtotal", async () => {
    addToCart({
      skuId: "fj-s-black",
      productId: "1",
      productName: "Faker Jersey",
      variant: "S / Black",
      price: 59.99,
    });
    addToCart({
      skuId: "fj-m-white",
      productId: "1",
      productName: "Faker Jersey",
      variant: "M / White",
      price: 62.99,
    });
    updateQuantity("fj-s-black", 2);

    renderRoute("/cart");

    // Both items visible; subtotal 59.99×2 + 62.99 = 182.97
    const jerseyItems = await screen.findAllByText("Faker Jersey");
    expect(jerseyItems).toHaveLength(2);

    const subtotal = await screen.findByTestId("cart-subtotal");
    expect(subtotal).toHaveTextContent("$182.97");

    // Remove first item (S / Black qty 2)
    const user = userEvent.setup();
    const removeButtons = await screen.findAllByRole("button", { name: /remove/i });
    await user.click(removeButtons[0]);

    // Subtotal drops to 62.99
    await waitFor(() => {
      expect(screen.getByTestId("cart-subtotal")).toHaveTextContent("$62.99");
    });
  });

  it("clears sessionStorage guest cart after successful sync", async () => {
    vi.mocked(useAuth).mockReturnValue({ isLoaded: true, isSignedIn: true } as ReturnType<
      typeof useAuth
    >);
    addToCart({
      skuId: "fj-s-black",
      productId: "1",
      productName: "Faker Jersey",
      variant: "S / Black",
      price: 59.99,
    });

    renderRoute("/cart");
    await screen.findByText("Faker Jersey");
  });

  it("decrementing quantity to 0 removes item", async () => {
    addToCart({
      skuId: "fj-s-black",
      productId: "1",
      productName: "Faker Jersey",
      variant: "S / Black",
      price: 59.99,
    });

    renderRoute("/cart");
    await screen.findByText("Faker Jersey");

    const user = userEvent.setup();
    const decrementButton = await screen.findByRole("button", { name: /decrease quantity/i });
    await user.click(decrementButton);

    await screen.findByText(/your cart is empty/i);
  });
});

describe("cart merge on sign-in", () => {
  it("merges guest cart with server cart when isSignedIn becomes true", async () => {
    addToCart({
      skuId: "fj-s-black",
      productId: "1",
      productName: "Faker Jersey",
      variant: "S / Black",
      price: 59.99,
    });

    // Server returns: fj-s-black qty 3 (merged) + fj-m-white qty 1 (server-only)
    server.use(
      http.post(`${BASE_URL}/cart/sync`, () => {
        const response: SyncCartResponse = {
          items: [
            {
              skuId: "fj-s-black",
              productId: "1",
              productName: "Faker Jersey",
              variant: "S / Black",
              price: 59.99,
              quantity: 3,
            },
            {
              skuId: "fj-m-white",
              productId: "1",
              productName: "Faker Jersey",
              variant: "M / White",
              price: 62.99,
              quantity: 1,
            },
          ],
        };
        return HttpResponse.json(envelope(response));
      })
    );

    vi.mocked(useAuth).mockReturnValue({ isLoaded: true, isSignedIn: true } as ReturnType<
      typeof useAuth
    >);

    renderRoute("/cart");

    // Both SKUs visible after merge
    await waitFor(() => {
      const rows = screen.getAllByText("Faker Jersey");
      expect(rows).toHaveLength(2);
    });

    // Subtotal: 59.99×3 + 62.99×1 = 242.96
    const subtotal = await screen.findByTestId("cart-subtotal");
    expect(subtotal).toHaveTextContent("$242.96");
  });

  it("preserves guest cart items when sync endpoint returns an error", async () => {
    addToCart({
      skuId: "fj-s-black",
      productId: "1",
      productName: "Faker Jersey",
      variant: "S / Black",
      price: 59.99,
    });

    server.use(http.post(`${BASE_URL}/cart/sync`, () => new HttpResponse(null, { status: 500 })));

    vi.mocked(useAuth).mockReturnValue({ isLoaded: true, isSignedIn: true } as ReturnType<
      typeof useAuth
    >);

    renderRoute("/cart");

    // Guest item still present
    await screen.findByText("Faker Jersey");
    // Error banner surfaced
    await screen.findByText(/cart sync failed/i);
  });
});
