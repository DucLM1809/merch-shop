import { describe, it, expect, beforeEach, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderRoute } from "../../test-utils";
import { addToCart, clearCart } from "../../store/cart";

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

async function fillShippingForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(await screen.findByPlaceholderText("Full Name"), "Jane Doe");
  await user.type(screen.getByPlaceholderText("Email"), "jane@example.com");
  await user.type(screen.getByPlaceholderText("Street address"), "123 Main St");
  await user.type(screen.getByPlaceholderText("City"), "Los Angeles");
  await user.type(screen.getByPlaceholderText("State"), "CA");
  await user.type(screen.getByPlaceholderText("Postal code"), "90001");
  await user.type(screen.getByPlaceholderText("Country"), "US");
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

    const btn = await screen.findByRole("link", { name: /proceed to checkout/i });
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
// Behavior 4: Valid card → POST /orders → confirmation page with orderId + SKU summary
// ---------------------------------------------------------------------------
describe("/checkout successful payment", () => {
  it("submitting with valid fields navigates to confirmation page with orderId and clears cart", async () => {
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
    await user.click(screen.getByRole("button", { name: /pay/i }));

    await screen.findByText(/ord_test_123/i);
    expect(screen.getByText(/faker jersey/i)).toBeInTheDocument();
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
    await user.click(screen.getByRole("button", { name: /pay/i }));

    expect(await screen.findByTestId("payment-error")).toHaveTextContent("Your card was declined.");
    expect(screen.getByPlaceholderText("Full Name")).toBeInTheDocument();
    expect(screen.queryByText(/order confirmed/i)).not.toBeInTheDocument();
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

    const payBtn = await screen.findByRole("button", { name: /pay/i });
    await user.click(payBtn);

    expect(await screen.findByText(/full name is required/i)).toBeInTheDocument();
    expect(mockConfirmCardPayment).not.toHaveBeenCalled();
  });
});
