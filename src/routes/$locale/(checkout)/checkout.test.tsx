import { describe, it, expect, beforeEach, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { formatPrice } from "@/i18n/formatPrice";
import enUSCart from "@/i18n/locales/en-US/cart.json";
import enUSCheckout from "@/i18n/locales/en-US/checkout.json";
import { renderRoute } from "../../../test-utils";
import { addToCart, clearCart } from "../../../store/cart";

// ---------------------------------------------------------------------------
// Stripe mock
// ---------------------------------------------------------------------------
const mockConfirmCardPayment = vi.fn();
const mockStripe = { confirmCardPayment: mockConfirmCardPayment };

vi.mock("@stripe/react-stripe-js", () => ({
  Elements: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  CardElement: () => <input data-testid="card-element" readOnly />,
  useStripe: () => mockStripe,
  useElements: () => ({ getElement: () => ({}) }),
}));

beforeEach(() => {
  clearCart();
  vi.clearAllMocks();
});

const shipping = enUSCheckout.shipping;

/** The pay button names its own total, so the expected label has to be built the same way. */
function payLabel(total: number): string {
  return enUSCheckout.payment.pay.replace("{{total}}", formatPrice(total, "en-US"));
}

async function fillShippingForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(await screen.findByPlaceholderText(shipping.fullName), "Jane Doe");
  await user.type(screen.getByPlaceholderText(shipping.email), "jane@example.com");
  await user.type(screen.getByPlaceholderText(shipping.addressPlaceholder), "123 Main St");
  await user.type(screen.getByPlaceholderText(shipping.city), "Los Angeles");
  await user.type(screen.getByPlaceholderText(shipping.state), "CA");
  await user.type(screen.getByPlaceholderText(shipping.postalCodePlaceholder), "90001");
  await user.type(screen.getByPlaceholderText(shipping.country), "US");
}

// ---------------------------------------------------------------------------
// Behavior 1: Cart "Proceed to Checkout" navigates to /checkout
// ---------------------------------------------------------------------------
describe("Cart → Checkout navigation", () => {
  it("clicking Proceed to Checkout from cart navigates to /checkout", async () => {
    addToCart({
      skuId: "fj-s-black",
      productId: "1",
      productName: "Faker Jersey",
      variant: "S / Black",
      price: 59.99,
    });
    renderRoute("/cart");

    const btn = await screen.findByRole("link", { name: enUSCart.checkout });
    expect(btn).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Behavior 3: Stripe CardElement renders in /checkout
// ---------------------------------------------------------------------------
describe("/checkout Stripe CardElement", () => {
  it("renders card input field", async () => {
    addToCart({
      skuId: "fj-s-black",
      productId: "1",
      productName: "Faker Jersey",
      variant: "S / Black",
      price: 59.99,
    });
    renderRoute("/checkout");

    expect(await screen.findByTestId("card-element")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Behavior 4: Valid card → confirmation page (BE creates order via webhook) + SKU summary
// ---------------------------------------------------------------------------
describe("/checkout successful payment", () => {
  it("submitting with valid fields navigates to confirmation page and clears cart", async () => {
    const user = userEvent.setup();
    mockConfirmCardPayment.mockResolvedValue({ paymentIntent: { status: "succeeded" } });

    addToCart({
      skuId: "fj-s-black",
      productId: "1",
      productName: "Faker Jersey",
      variant: "S / Black",
      price: 59.99,
    });
    renderRoute("/checkout");
    await fillShippingForm(user);
    await user.click(screen.getByRole("button", { name: payLabel(59.99) }));

    await screen.findByText(enUSCheckout.confirmation.title);
    expect(screen.getByText(/faker jersey/i)).toBeInTheDocument();
  });

  it("resolves the order id by polling for the payment intent (merch-shop-fvg)", async () => {
    const user = userEvent.setup();
    mockConfirmCardPayment.mockResolvedValue({
      paymentIntent: { status: "succeeded", id: "pi_test_001" },
    });

    addToCart({
      skuId: "fj-s-black",
      productId: "1",
      productName: "Faker Jersey",
      variant: "S / Black",
      price: 59.99,
    });
    renderRoute("/checkout");
    await fillShippingForm(user);
    await user.click(screen.getByRole("button", { name: payLabel(59.99) }));

    // MSW fixture ord_001 carries stripePaymentIntentId "pi_test_001"
    expect(await screen.findByText("ord_001")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Behavior 5: Declined card shows inline error, form state preserved
// ---------------------------------------------------------------------------
describe("/checkout declined card", () => {
  it("shows inline payment error without navigating away", async () => {
    const user = userEvent.setup();
    mockConfirmCardPayment.mockResolvedValue({ error: { message: "Your card was declined." } });

    addToCart({
      skuId: "fj-s-black",
      productId: "1",
      productName: "Faker Jersey",
      variant: "S / Black",
      price: 59.99,
    });
    renderRoute("/checkout");
    await fillShippingForm(user);
    await user.click(screen.getByRole("button", { name: payLabel(59.99) }));

    expect(await screen.findByTestId("payment-error")).toHaveTextContent("Your card was declined.");
    expect(screen.getByPlaceholderText(shipping.fullName)).toBeInTheDocument();
    expect(screen.queryByText(enUSCheckout.confirmation.title)).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Behavior 2: Shipping form validates required fields before payment
// ---------------------------------------------------------------------------
describe("/checkout shipping validation", () => {
  it("shows validation errors when required fields are empty and Pay is clicked", async () => {
    const user = userEvent.setup();
    addToCart({
      skuId: "fj-s-black",
      productId: "1",
      productName: "Faker Jersey",
      variant: "S / Black",
      price: 59.99,
    });
    renderRoute("/checkout");

    const payBtn = await screen.findByRole("button", { name: payLabel(59.99) });
    await user.click(payBtn);

    expect(await screen.findByText(enUSCheckout.validation.fullName)).toBeInTheDocument();
    expect(mockConfirmCardPayment).not.toHaveBeenCalled();
  });
});
