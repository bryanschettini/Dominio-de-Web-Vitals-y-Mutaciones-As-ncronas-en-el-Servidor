"use client";

import { useEffect } from "react";
import { useCart } from "./CartProvider";

/** Vacía el carrito cuando el pago ya fue confirmado. */
export default function ClearCart() {
  const { clear, ready } = useCart();
  useEffect(() => {
    if (ready) clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);
  return null;
}
