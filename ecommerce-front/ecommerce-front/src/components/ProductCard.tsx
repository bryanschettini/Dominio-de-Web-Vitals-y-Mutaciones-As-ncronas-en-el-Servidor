import Image from "next/image";
import Link from "next/link";
import { money } from "@/lib/format";
import type { Product } from "@/types";

export function ProductImage({
  product,
  priority = false,
  size = 400,
}: {
  product: Product;
  priority?: boolean;
  size?: number;
}) {
  if (!product.image_url) {
    return (
      <div
        role="img"
        aria-label={product.name}
        className="flex aspect-square w-full items-center justify-center bg-surface text-4xl font-bold text-line"
      >
        {product.name.charAt(0).toUpperCase()}
      </div>
    );
  }
  return (
    <Image
      src={product.image_url}
      alt={product.name}
      width={size}
      height={size}
      priority={priority}
      className="aspect-square w-full object-cover"
    />
  );
}

export default function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="group block overflow-hidden rounded-lg border border-line bg-white hover:border-brand"
    >
      <ProductImage product={product} priority={priority} />
      <div className="p-4">
        <h2 className="font-semibold group-hover:text-brand">{product.name}</h2>
        <p className="mt-1 text-lg">{money(product.price)}</p>
        {product.stock <= 0 && <p className="mt-1 text-sm text-danger">Agotado</p>}
      </div>
    </Link>
  );
}
