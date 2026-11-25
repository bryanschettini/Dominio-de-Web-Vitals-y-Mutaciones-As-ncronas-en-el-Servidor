"use client";

import { useState } from "react";
import { useCart } from "./CartProvider";
import type { Product } from "@/types";

export default function AddToCartButton({ product }: { product: Product }) {
  const { add, items } = useCart();
  const [added, setAdded] = useState(false);
  const inCart = items.find((i) => i.product.id === product.id)?.quantity ?? 0;
  const soldOut = product.stock <= 0 || inCart >= product.stock;

  return (
    <div>
      <button
        disabled={soldOut}
        onClick={() => {
          add(product);
          setAdded(true);
          setTimeout(() => setAdded(false), 1500);
        }}
        className="rounded bg-brand px-5 py-3 font-medium text-white hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
      >
        {product.stock <= 0 ? "Agotado" : inCart >= product.stock ? "Máximo en carrito" : "Agregar al carrito"}
      </button>
      <p role="status" className="mt-2 h-5 text-sm text-brand">
        {added ? "Agregado al carrito" : ""}
      </p>
    </div>
  );
}
