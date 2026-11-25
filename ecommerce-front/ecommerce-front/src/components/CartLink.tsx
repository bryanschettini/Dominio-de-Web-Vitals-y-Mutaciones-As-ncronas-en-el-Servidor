"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";

export default function CartLink() {
  const { count, ready } = useCart();
  return (
    <Link href="/cart" className="rounded px-3 py-2 hover:bg-surface">
      Carrito{ready && count > 0 ? ` (${count})` : ""}
    </Link>
  );
}
