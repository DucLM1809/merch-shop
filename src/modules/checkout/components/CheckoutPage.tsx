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
import { useLocale } from "@/i18n/useLocale";
import { cartStore, clearCart } from "@/store/cart";
import { CheckoutFormView } from "./CheckoutFormView";
import { schema, DEFAULTS } from "./CheckoutFormView.schema";
import type { FormValues } from "./CheckoutFormView.schema";

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ?? "pk_test_placeholder"
);

function CheckoutForm() {
  const navigate = useNavigate();
  const locale = useLocale();
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

  async function onSubmit(): Promise<void> {
    if (!stripe || !elements) return;
    setPaymentError(null);

    try {
      const {
        data: { id: cartId },
      } = await client.getCart();
      const {
        data: { clientSecret },
      } = await client.createPaymentIntent(cartId);

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: elements.getElement(CardElement)! },
      });

      if (result.error || !result.paymentIntent) {
        setPaymentError(result.error?.message ?? "Payment failed");
        return;
      }

      // BE creates the order asynchronously via Stripe webhook — confirmation
      // page resolves it by polling for the paymentIntentId (merch-shop-fvg).
      clearCart();
      navigate({
        to: "/$locale/order-confirmation",
        params: { locale },
        search: { paymentIntentId: result.paymentIntent.id, items: JSON.stringify(items) },
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
