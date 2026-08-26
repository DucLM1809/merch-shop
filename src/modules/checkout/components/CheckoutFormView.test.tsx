import { screen, within } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import type { UseFormRegister } from "react-hook-form";

import enUSCheckout from "@/i18n/locales/en-US/checkout.json";
import { expectNoA11yViolations, priceText, renderWithProviders } from "@/test-utils";
import { CheckoutFormView } from "./CheckoutFormView";
import { schema, VALIDATION_KEYS } from "./CheckoutFormView.schema";
import type { FormValues } from "./CheckoutFormView.schema";

const mockRegister = ((name: string) => ({
  name,
  ref: vi.fn(),
  onChange: vi.fn(),
  onBlur: vi.fn(),
})) as unknown as UseFormRegister<FormValues>;

function renderView(props: Partial<React.ComponentProps<typeof CheckoutFormView>> = {}) {
  const defaults: React.ComponentProps<typeof CheckoutFormView> = {
    register: mockRegister,
    errors: {},
    paymentError: null,
    isSubmitting: false,
    total: 59.99,
    onSubmit: vi.fn(),
    cardSlot: <input data-testid="card-slot" aria-label="Card details" readOnly />,
    ...props,
  };
  return renderWithProviders(<CheckoutFormView {...defaults} />);
}

// ---------------------------------------------------------------------------
// Schema unit tests
// ---------------------------------------------------------------------------
describe("CheckoutFormView schema", () => {
  it("rejects empty required fields", () => {
    const result = schema.safeParse({
      fullName: "",
      email: "",
      line1: "",
      line2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const fields = result.error.issues.map((i) => i.path[0]);
      expect(fields).toContain("fullName");
      expect(fields).toContain("email");
      expect(fields).toContain("line1");
      expect(fields).toContain("city");
      expect(fields).toContain("state");
      expect(fields).toContain("postalCode");
      expect(fields).toContain("country");
    }
  });

  it("reports translation keys rather than sentences", () => {
    const result = schema.safeParse({
      fullName: "",
      email: "",
      line1: "",
      line2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message);
      const keys: string[] = Object.values(VALIDATION_KEYS);

      // A sentence leaking in here is a message that could never be translated.
      expect(messages.every((message) => keys.includes(message))).toBe(true);
    }
  });

  it("accepts valid input (line2 optional)", () => {
    const result = schema.safeParse({
      fullName: "Jane Doe",
      email: "jane@example.com",
      line1: "123 Main St",
      line2: "",
      city: "Los Angeles",
      state: "CA",
      postalCode: "90001",
      country: "US",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a non-empty but malformed email, reporting the same translation key", () => {
    const result = schema.safeParse({
      fullName: "Jane Doe",
      email: "not-an-email",
      line1: "123 Main St",
      line2: "",
      city: "Los Angeles",
      state: "CA",
      postalCode: "90001",
      country: "US",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const emailIssue = result.error.issues.find((i) => i.path[0] === "email");
      expect(emailIssue?.message).toBe(VALIDATION_KEYS.email);
    }
  });
});

// ---------------------------------------------------------------------------
// Component render tests
// ---------------------------------------------------------------------------
describe("CheckoutFormView default state", () => {
  it("renders all shipping fields and pay button with total", () => {
    renderView();
    expect(screen.getByPlaceholderText(enUSCheckout.shipping.fullName)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(enUSCheckout.shipping.email)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(enUSCheckout.shipping.addressPlaceholder)
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText(enUSCheckout.shipping.city)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(enUSCheckout.shipping.state)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(enUSCheckout.shipping.postalCodePlaceholder)
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText(enUSCheckout.shipping.country)).toBeInTheDocument();

    const payLabel = enUSCheckout.payment.pay.replace("{{total}}", "$59.99");
    expect(screen.getByRole("button", { name: payLabel })).toBeInTheDocument();
  });

  it("formats the pay button total for the active locale", () => {
    renderView({ total: 1234.5 });

    const button = screen.getByRole("button", { name: /1,234/ });

    expect(priceText(1234.5, "en-US")(button.textContent?.replace(/^Pay /u, "") ?? "")).toBe(true);
  });

  it("renders card slot", () => {
    renderView();
    expect(screen.getByTestId("card-slot")).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = renderView();
    await expectNoA11yViolations(container);
  });

  it("does not show payment-error by default", () => {
    renderView();
    expect(screen.queryByTestId("payment-error")).not.toBeInTheDocument();
  });

  it("shows a non-navigable Shipping → Payment step indicator", () => {
    renderView();
    const steps = screen.getByRole("list", { name: enUSCheckout.steps.label });
    const items = within(steps).getAllByRole("listitem");

    expect(items).toHaveLength(2);
    expect(
      within(items[0]).getByText(new RegExp(enUSCheckout.shipping.heading))
    ).toBeInTheDocument();
    expect(
      within(items[1]).getByText(new RegExp(enUSCheckout.payment.heading))
    ).toBeInTheDocument();
    expect(items[0]).toHaveAttribute("aria-current", "step");
    expect(items[1]).not.toHaveAttribute("aria-current");
    // Structural only — never a link/button a user could jump ahead with.
    expect(within(steps).queryByRole("link")).not.toBeInTheDocument();
    expect(within(steps).queryByRole("button")).not.toBeInTheDocument();
  });
});

describe("CheckoutFormView validation errors", () => {
  it("translates the schema's keys into the active locale's sentences", () => {
    renderView({
      errors: {
        fullName: { type: "required", message: VALIDATION_KEYS.fullName },
        email: { type: "required", message: VALIDATION_KEYS.email },
        city: { type: "required", message: VALIDATION_KEYS.city },
      },
    });
    expect(screen.getByText(enUSCheckout.validation.fullName)).toBeInTheDocument();
    expect(screen.getByText(enUSCheckout.validation.email)).toBeInTheDocument();
    expect(screen.getByText(enUSCheckout.validation.city)).toBeInTheDocument();

    // The key itself must never reach the page.
    expect(screen.queryByText(VALIDATION_KEYS.fullName)).not.toBeInTheDocument();
  });
});

describe("CheckoutFormView payment declined", () => {
  it("shows payment-error with message", () => {
    // Stripe's own decline copy, passed through rather than translated.
    renderView({ paymentError: "Your card was declined." });
    expect(screen.getByTestId("payment-error")).toHaveTextContent("Your card was declined.");
  });
});
