import type { Metadata } from "next";
import { Suspense } from "react";
import { api, unwrap } from "@/lib/api";
import { ENDPOINTS } from "@/lib/endpoints";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/types";

export const metadata: Metadata = { title: "Catálogo" };

const GRID = "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4";

/** Server Component: la lectura se hace en el servidor y se envía por streaming. */
async function ProductList() {
  const body = await api<unknown>(ENDPOINTS.products, { tags: ["products"], revalidate: 60 });
  const products = unwrap<Product[]>(body);

  if (!products?.length) {
    return <p className="text-muted">Todavía no hay productos disponibles.</p>;
  }

  return (
    <div className={GRID}>
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} priority={i < 4} />
      ))}
    </div>
  );
}

function ProductsSkeleton() {
  return (
    <div className={GRID} aria-hidden>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="aspect-[4/5] animate-pulse rounded-lg bg-surface" />
      ))}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <main className="mx-auto max-w-6xl p-6">
      <h1 className="mb-6 text-3xl font-bold">Catálogo</h1>
      <Suspense fallback={<ProductsSkeleton />}>
        <ProductList />
      </Suspense>
    </main>
  );
}
