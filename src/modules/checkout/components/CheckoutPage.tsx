import { useState } from "react";
import type { JSX } from "react";

import { Box } from "@chakra-ui/react";
import { CardElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useNavigate } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { client } from "@/api/client";
import type { CreateOrderRequest } from "@/api/types";
import { cartStore, clearCart } from "@/store/cart";
import { CheckoutFormView } from "./CheckoutFormView";
import { schema, DEFAULTS } from "./CheckoutFormView.schema";
import type { FormValues } from "./CheckoutFormView.schema";

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ?? "pk_test_placeholder"
);

function CheckoutForm() {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const items = useStore(cartStore, (s) => s.items);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: DEFAULTS,
  });

  async function onSubmit(data: FormValues): Promise<void> {
    if (!stripe || !elements) return;
    setPaymentError(null);

    try {
      const body: CreateOrderRequest = {
        shipping: {
          fullName: data.fullName.trim(),
          email: data.email.trim(),
          line1: data.line1.trim(),
          ...(data.line2.trim() && { line2: data.line2.trim() }),
          city: data.city.trim(),
          state: data.state.trim(),
          postalCode: data.postalCode.trim(),
          country: data.country.trim(),
        },
        lines: items.map((i) => ({
          skuId: i.skuId,
          productName: i.productName,
          variant: i.variant,
          price: i.price,
          quantity: i.quantity,
        })),
      };
      const { orderId, clientSecret } = await client.createOrder(body);

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: elements.getElement(CardElement)! },
      });

      if (result.error) {
        setPaymentError(result.error.message ?? "Payment failed");
        return;
      }

      clearCart();
      navigate({
        to: "/order-confirmation",
        search: { orderId, items: JSON.stringify(items) },
      });
    } catch {
      setPaymentError("Something went wrong. Please try again.");
    }
  }

  return (
    <CheckoutFormView
      register={register}
      errors={errors}
      paymentError={paymentError}
      isSubmitting={isSubmitting}
      total={items.reduce((s, i) => s + i.price * i.quantity, 0)}
      onSubmit={handleSubmit(onSubmit)}
      cardSlot={<CardElement />}
    />
  );
}

export function CheckoutPage(): JSX.Element {
  return (
    <Box p={8} maxW="2xl" mx="auto">
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </Box>
  );
}
