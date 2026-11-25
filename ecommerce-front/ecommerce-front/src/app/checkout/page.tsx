import type { Metadata } from "next";
import CheckoutForm from "@/components/CheckoutForm";

export const metadata: Metadata = { title: "Pago" };

export default function CheckoutPage() {
  return (
    <main className="mx-auto max-w-lg p-6">
      <h1 className="mb-6 text-3xl font-bold">Finalizar compra</h1>
      <CheckoutForm />
    </main>
  );
}
