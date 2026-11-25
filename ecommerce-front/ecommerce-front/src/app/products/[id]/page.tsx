import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { api, ApiError, unwrap } from "@/lib/api";
import { ENDPOINTS } from "@/lib/endpoints";
import { money } from "@/lib/format";
import AddToCartButton from "@/components/AddToCartButton";
import { ProductImage } from "@/components/ProductCard";
import type { Product } from "@/types";

async function getProduct(id: string): Promise<Product> {
  try {
    const body = await api<unknown>(ENDPOINTS.product(id), { tags: ["products", `product-${id}`] });
    return unwrap<Product>(body);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  try {
    const p = await getProduct(id);
    return { title: p.name, description: p.description?.slice(0, 150) };
  } catch {
    return { title: "Producto" };
  }
}

export default async function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);

  return (
    <main className="mx-auto grid max-w-4xl gap-8 p-6 md:grid-cols-2">
      <div className="overflow-hidden rounded-lg border border-line">
        <ProductImage product={product} priority size={600} />
      </div>
      <div>
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="my-3 max-w-prose text-muted">{product.description}</p>
        <p className="mb-1 text-2xl font-semibold">{money(product.price)}</p>
        <p className="mb-5 text-sm text-muted">
          {product.stock > 0 ? `${product.stock} disponibles` : "Sin stock"}
        </p>
        <AddToCartButton product={product} />
      </div>
    </main>
  );
}
