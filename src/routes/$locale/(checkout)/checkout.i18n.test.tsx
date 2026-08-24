import { describe, it, expect, beforeEach, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { formatPrice } from "@/i18n/formatPrice";
import enUSCheckout from "@/i18n/locales/en-US/checkout.json";
import enGBCheckout from "@/i18n/locales/en-GB/checkout.json";
import frFRCheckout from "@/i18n/locales/fr-FR/checkout.json";
import { priceText, renderRoute } from "@/test-utils";
import { addToCart, clearCart } from "@/store/cart";

// Checkout is where Phase 1's line is easiest to cross: the form labels and the validation
// sentences are chrome and must translate, while Stripe's own decline copy and the money's
// denomination are not ours to restate. These tests pin both sides.

const mockConfirmCardPayment = vi.fn();

vi.mock("@stripe/react-stripe-js", () => ({
  Elements: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  CardElement: () => <input data-testid="card-element" readOnly />,
  useStripe: () => ({ confirmCardPayment: mockConfirmCardPayment }),
  useElements: () => ({ getElement: () => ({}) }),
}));

const JERSEY = {
  skuId: "fj-s-black",
  productId: "1",
  productName: "Faker Jersey",
  variant: "S / Black",
  price: 59.99,
};

beforeEach(() => {
  clearCart();
  vi.clearAllMocks();
});

describe("Checkout chrome across locales", () => {
  it("renders the form headings and labels in French under the fr-FR prefix", async () => {
    addToCart(JERSEY);

    renderRoute("/fr-FR/checkout");

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: frFRCheckout.title })).toBeInTheDocument();
    });

    expect(
      screen.getByRole("heading", { name: frFRCheckout.shipping.heading })
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: frFRCheckout.payment.heading })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(frFRCheckout.shipping.fullName)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(frFRCheckout.shipping.addressPlaceholder)
    ).toBeInTheDocument();
    expect(screen.queryByPlaceholderText(enUSCheckout.shipping.fullName)).not.toBeInTheDocument();
  });

  it("uses en-GB's own address vocabulary", async () => {
    addToCart(JERSEY);

    renderRoute("/en-GB/checkout");

    await waitFor(() => {
      expect(screen.getByPlaceholderText(enGBCheckout.shipping.postalCode)).toBeInTheDocument();
    });

    expect(screen.getByPlaceholderText(enGBCheckout.shipping.city)).toBeInTheDocument();

    // The words that separate the two English locales.
    expect(enGBCheckout.shipping.postalCode).not.toBe(enUSCheckout.shipping.postalCode);
    expect(enGBCheckout.shipping.city).not.toBe(enUSCheckout.shipping.city);
    expect(
      screen.queryByPlaceholderText(enUSCheckout.shipping.postalCodePlaceholder)
    ).not.toBeInTheDocument();
  });

  it("shows validation sentences in the active locale, never the schema's keys", async () => {
    const user = userEvent.setup();
    addToCart(JERSEY);

    renderRoute("/fr-FR/checkout");

    const payButton = await screen.findByRole("button", {
      name: frFRCheckout.payment.pay.replace("{{total}}", formatPrice(59.99, "fr-FR")),
    });
    await user.click(payButton);

    expect(await screen.findByText(frFRCheckout.validation.fullName)).toBeInTheDocument();
    expect(screen.getByText(frFRCheckout.validation.postalCode)).toBeInTheDocument();

    // The key that the schema actually reports.
    expect(screen.queryByText("validation.fullName")).not.toBeInTheDocument();
    expect(screen.queryByText(enUSCheckout.validation.fullName)).not.toBeInTheDocument();
    expect(mockConfirmCardPayment).not.toHaveBeenCalled();
  });
});

describe("Checkout prices across locales", () => {
  it("formats the pay button total for the locale in the URL", async () => {
    addToCart(JERSEY);

    renderRoute("/fr-FR/checkout");

    const expected = frFRCheckout.payment.pay.replace("{{total}}", formatPrice(59.99, "fr-FR"));

    expect(await screen.findByRole("button", { name: expected })).toBeInTheDocument();
  });

  it("formats the same total differently per locale, without converting it", async () => {
    addToCart(JERSEY);

    const { unmount } = renderRoute("/en-US/checkout");

    const usButton = await screen.findByRole("button", { name: /59/ });

    expect(usButton).toHaveTextContent("59.99");

    unmount();

    renderRoute("/fr-FR/checkout");

    const frenchButton = await screen.findByRole("button", { name: /59/ });

    // Same 59.99 either way — French just writes the decimal with a comma.
    expect(frenchButton).toHaveTextContent("59,99");
    expect(frenchButton).not.toHaveTextContent("59.99");
  });
});

describe("Order confirmation across locales", () => {
  it("confirms the order in French and formats its total", async () => {
    const user = userEvent.setup();
    mockConfirmCardPayment.mockResolvedValue({ paymentIntent: { status: "succeeded" } });

    addToCart(JERSEY);

    renderRoute("/fr-FR/checkout");

    await user.type(await screen.findByPlaceholderText(frFRCheckout.shipping.fullName), "Jane Doe");
    await user.type(screen.getByPlaceholderText(frFRCheckout.shipping.email), "jane@example.com");
    await user.type(
      screen.getByPlaceholderText(frFRCheckout.shipping.addressPlaceholder),
      "123 Main St"
    );
    await user.type(screen.getByPlaceholderText(frFRCheckout.shipping.city), "Paris");
    await user.type(screen.getByPlaceholderText(frFRCheckout.shipping.state), "Île-de-France");
    await user.type(
      screen.getByPlaceholderText(frFRCheckout.shipping.postalCodePlaceholder),
      "75001"
    );
    await user.type(screen.getByPlaceholderText(frFRCheckout.shipping.country), "France");

    await user.click(
      screen.getByRole("button", {
        name: frFRCheckout.payment.pay.replace("{{total}}", formatPrice(59.99, "fr-FR")),
      })
    );

    await screen.findByText(frFRCheckout.confirmation.title);

    expect(screen.getByText(frFRCheckout.confirmation.itemsPurchased)).toBeInTheDocument();
    expect(screen.getByText(frFRCheckout.confirmation.total)).toBeInTheDocument();
    // The product itself stays untranslated.
    expect(screen.getByText("Faker Jersey")).toBeInTheDocument();
    expect(screen.getAllByText(priceText(59.99, "fr-FR")).length).toBeGreaterThanOrEqual(1);
  });
});
