"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";
import { money } from "@/lib/format";

export default function CartView() {
  const { items, total, ready, add, decrement, remove } = useCart();

  if (!ready) return <div className="h-32 animate-pulse rounded bg-surface" />;

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-line p-10 text-center">
        <p className="text-muted">Tu carrito está vacío.</p>
        <Link href="/products" className="mt-4 inline-block font-medium text-brand underline">
          Ver el catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ul className="divide-y divide-line rounded-lg border border-line">
        {items.map(({ product, quantity }) => (
          <li key={product.id} className="flex flex-wrap items-center gap-4 p-4">
            <div className="min-w-0 flex-1">
              <Link href={`/products/${product.id}`} className="font-medium hover:text-brand">
                {product.name}
              </Link>
              <p className="text-sm text-muted">{money(product.price)} c/u</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                aria-label={`Quitar una unidad de ${product.name}`}
                onClick={() => decrement(product.id)}
                className="h-8 w-8 rounded border border-line hover:bg-surface"
              >
                −
              </button>
              <span className="w-6 text-center" aria-live="polite">{quantity}</span>
              <button
                aria-label={`Agregar una unidad de ${product.name}`}
                onClick={() => add(product)}
                disabled={quantity >= product.stock}
                className="h-8 w-8 rounded border border-line hover:bg-surface disabled:opacity-40"
              >
                +
              </button>
            </div>
            <p className="w-24 text-right font-medium">{money(Number(product.price) * quantity)}</p>
            <button onClick={() => remove(product.id)} className="text-sm text-danger underline">
              Quitar
            </button>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between">
        <p className="text-xl font-bold">Total: {money(total)}</p>
        <Link href="/checkout" className="rounded bg-brand px-6 py-3 font-medium text-white hover:bg-brand-dark">
          Ir a pagar
        </Link>
      </div>
    </div>
  );
}
