"use client";

import { createContext, useContext, useEffect, useReducer, useState, useMemo } from "react";
import type { Product } from "@/types";

export interface CartItem {
  product: Product;
  quantity: number;
}

type Action =
  | { type: "ADD"; product: Product }
  | { type: "DECREMENT"; id: number }
  | { type: "REMOVE"; id: number }
  | { type: "CLEAR" }
  | { type: "HYDRATE"; items: CartItem[] };

function reducer(state: CartItem[], a: Action): CartItem[] {
  switch (a.type) {
    case "HYDRATE":
      return a.items;
    case "ADD": {
      const found = state.find((i) => i.product.id === a.product.id);
      if (found) {
        // No permitir más unidades que el stock disponible
        if (found.quantity >= a.product.stock) return state;
        return state.map((i) =>
          i.product.id === a.product.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [...state, { product: a.product, quantity: 1 }];
    }
    case "DECREMENT":
      return state
        .map((i) => (i.product.id === a.id ? { ...i, quantity: i.quantity - 1 } : i))
        .filter((i) => i.quantity > 0);
    case "REMOVE":
      return state.filter((i) => i.product.id !== a.id);
    case "CLEAR":
      return [];
  }
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  total: number;
  ready: boolean;
  add: (p: Product) => void;
  decrement: (id: number) => void;
  remove: (id: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, dispatch] = useReducer(reducer, []);
  const [ready, setReady] = useState(false);

  // Cargar carrito guardado (solo en el cliente)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) dispatch({ type: "HYDRATE", items: JSON.parse(saved) });
    } catch {
      /* localStorage no disponible o JSON inválido */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignorar */
    }
  }, [items, ready]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      ready,
      count: items.reduce((s, i) => s + i.quantity, 0),
      total: items.reduce((s, i) => s + Number(i.product.price) * i.quantity, 0),
      add: (product) => dispatch({ type: "ADD", product }),
      decrement: (id) => dispatch({ type: "DECREMENT", id }),
      remove: (id) => dispatch({ type: "REMOVE", id }),
      clear: () => dispatch({ type: "CLEAR" }),
    }),
    [items, ready],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de CartProvider");
  return ctx;
}
