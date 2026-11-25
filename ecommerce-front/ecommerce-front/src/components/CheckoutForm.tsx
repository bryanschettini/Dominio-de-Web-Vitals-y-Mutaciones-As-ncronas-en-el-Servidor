"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useCart } from "./CartProvider";
import { createOrderAndPay } from "@/app/actions/orders";
import { money } from "@/lib/format";

const key = process.env.NEXT_PUBLIC_STRIPE_KEY;
const stripePromise = key ? loadStripe(key) : null;

function Form() {
  const stripe = useStripe();
  const elements = useElements();
  const { items, total, ready } = useCart();
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();

  if (!ready) return <div className="h-40 animate-pulse rounded bg-surface" />;

  if (items.length === 0) {
    return (
      <p className="text-muted">
        No hay productos para pagar.{" "}
        <Link href="/products" className="text-brand underline">Ir al catálogo</Link>
      </p>
    );
  }

  async function handlePay(e: React.FormEvent) {
    e.preventDefault();
    setError(undefined);
    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);
    if (!card) return;

    const { paymentMethod, error: stripeErr } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });
    if (stripeErr || !paymentMethod) {
      setError(stripeErr?.message ?? "No se pudo validar la tarjeta");
      return;
    }

    startTransition(async () => {
      const res = await createOrderAndPay(
        items.map((i) => ({ product_id: i.product.id, quantity: i.quantity })),
        paymentMethod.id,
      );
      // Si todo sale bien, la Server Action redirige a /checkout/success
      if (res?.error) setError(res.error);
    });
  }

  return (
    <form onSubmit={handlePay} className="space-y-6">
      <ul className="divide-y divide-line rounded-lg border border-line text-sm">
        {items.map(({ product, quantity }) => (
          <li key={product.id} className="flex justify-between p-3">
            <span>{quantity} × {product.name}</span>
            <span>{money(Number(product.price) * quantity)}</span>
          </li>
        ))}
        <li className="flex justify-between p-3 text-base font-bold">
          <span>Total</span>
          <span>{money(total)}</span>
        </li>
      </ul>

      <div>
        <label className="mb-2 block text-sm font-medium">Datos de la tarjeta</label>
        <div className="rounded border border-line p-3">
          <CardElement options={{ hidePostalCode: true }} />
        </div>
        <p className="mt-2 text-xs text-muted">Prueba: 4242 4242 4242 4242, cualquier fecha futura y CVC.</p>
      </div>

      {error && <p role="alert" className="rounded bg-red-50 p-3 text-sm text-danger">{error}</p>}

      <button
        disabled={!stripe || pending}
        className="w-full rounded bg-brand p-3 font-medium text-white hover:bg-brand-dark disabled:opacity-50"
      >
        {pending ? "Procesando pago..." : `Pagar ${money(total)}`}
      </button>
    </form>
  );
}

export default function CheckoutForm() {
  if (!stripePromise) {
    return (
      <p role="alert" className="rounded bg-red-50 p-4 text-danger">
        Falta la variable NEXT_PUBLIC_STRIPE_KEY en .env.local
      </p>
    );
  }
  return (
    <Elements stripe={stripePromise}>
      <Form />
    </Elements>
  );
}
