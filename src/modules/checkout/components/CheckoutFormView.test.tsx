import { render, screen } from "@testing-library/react";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { describe, it, expect, vi } from "vitest";
import type { UseFormRegister } from "react-hook-form";

import { CheckoutFormView } from "./CheckoutFormView";
import { schema } from "./CheckoutFormView.schema";
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
    cardSlot: <input data-testid="card-slot" readOnly />,
    ...props,
  };
  return render(
    <ChakraProvider value={defaultSystem}>
      <CheckoutFormView {...defaults} />
    </ChakraProvider>
  );
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
});

// ---------------------------------------------------------------------------
// Component render tests
// ---------------------------------------------------------------------------
describe("CheckoutFormView default state", () => {
  it("renders all shipping fields and pay button with total", () => {
    renderView();
    expect(screen.getByPlaceholderText("Full Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Street address")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("City")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("State")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Postal code")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Country")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /pay \$59\.99/i })).toBeInTheDocument();
  });

  it("renders card slot", () => {
    renderView();
    expect(screen.getByTestId("card-slot")).toBeInTheDocument();
  });

  it("does not show payment-error by default", () => {
    renderView();
    expect(screen.queryByTestId("payment-error")).not.toBeInTheDocument();
  });
});

describe("CheckoutFormView validation errors", () => {
  it("displays field error messages from errors prop", () => {
    renderView({
      errors: {
        fullName: { type: "required", message: "Full name is required" },
        email: { type: "required", message: "Email is required" },
        city: { type: "required", message: "City is required" },
      },
    });
    expect(screen.getByText("Full name is required")).toBeInTheDocument();
    expect(screen.getByText("Email is required")).toBeInTheDocument();
    expect(screen.getByText("City is required")).toBeInTheDocument();
  });
});

describe("CheckoutFormView payment declined", () => {
  it("shows payment-error with message", () => {
    renderView({ paymentError: "Your card was declined." });
    expect(screen.getByTestId("payment-error")).toHaveTextContent("Your card was declined.");
  });
});
