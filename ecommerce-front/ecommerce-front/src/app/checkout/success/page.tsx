import type { Metadata } from "next";
import Link from "next/link";
import ClearCart from "@/components/ClearCart";

export const metadata: Metadata = { title: "Compra confirmada" };

export default async function Success({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  const { order } = await searchParams;
  return (
    <main className="mx-auto max-w-md p-10 text-center">
      <ClearCart />
      <h1 className="text-3xl font-bold text-brand">¡Compra confirmada!</h1>
      <p className="mt-3 text-muted">
        {order ? `Tu orden #${order} fue pagada con éxito.` : "Tu pago fue procesado con éxito."}
      </p>
      <div className="mt-6 flex justify-center gap-4">
        <Link href="/orders" className="rounded bg-brand px-5 py-2 font-medium text-white hover:bg-brand-dark">
          Ver mis compras
        </Link>
        <Link href="/products" className="rounded border border-line px-5 py-2 hover:bg-surface">
          Seguir comprando
        </Link>
      </div>
    </main>
  );
}
