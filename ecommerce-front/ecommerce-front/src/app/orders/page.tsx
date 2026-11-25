import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { api, ApiError, unwrap } from "@/lib/api";
import { ENDPOINTS } from "@/lib/endpoints";
import { money } from "@/lib/format";
import type { Order } from "@/types";

export const metadata: Metadata = { title: "Mis compras" };

const STATUS: Record<string, { label: string; cls: string }> = {
  paid: { label: "Pagada", cls: "bg-green-100 text-green-800" },
  pending: { label: "Pendiente", cls: "bg-amber-100 text-amber-800" },
  failed: { label: "Fallida", cls: "bg-red-100 text-red-800" },
};

async function OrdersList() {
  let orders: Order[];
  try {
    const body = await api<unknown>(ENDPOINTS.orders, { auth: true, tags: ["orders"] });
    orders = unwrap<Order[]>(body);
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) redirect("/login?from=/orders");
    throw e;
  }

  if (!orders?.length) {
    return (
      <div className="rounded-lg border border-dashed border-line p-10 text-center">
        <p className="text-muted">Aún no tienes compras.</p>
        <Link href="/products" className="mt-3 inline-block font-medium text-brand underline">
          Explorar el catálogo
        </Link>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {orders.map((o) => {
        const s = STATUS[o.status] ?? { label: o.status, cls: "bg-surface text-ink" };
        return (
          <li key={o.id} className="rounded-lg border border-line p-4">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Orden #{o.id}</span>
              <span className={`rounded px-2 py-1 text-xs font-medium ${s.cls}`}>{s.label}</span>
            </div>
            <p className="mt-1">Total: {money(o.total)}</p>
            <p className="text-sm text-muted">
              {new Date(o.created_at).toLocaleDateString("es-SV", { dateStyle: "long" })}
            </p>
            {o.items && o.items.length > 0 && (
              <ul className="mt-2 text-sm text-muted">
                {o.items.map((it, i) => (
                  <li key={i}>
                    {it.quantity} × {it.product?.name ?? `Producto #${it.product_id}`}
                  </li>
                ))}
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default function OrdersPage() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="mb-6 text-3xl font-bold">Mis compras</h1>
      <Suspense fallback={<div className="h-40 animate-pulse rounded-lg bg-surface" aria-hidden />}>
        <OrdersList />
      </Suspense>
    </main>
  );
}
