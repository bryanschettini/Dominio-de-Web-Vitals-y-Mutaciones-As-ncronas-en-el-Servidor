"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { api, ApiError, unwrap } from "@/lib/api";
import { ENDPOINTS } from "@/lib/endpoints";
import type { Order } from "@/types";

export interface CheckoutState {
  error?: string;
}

interface CartLine {
  product_id: number;
  quantity: number;
}

/**
 * Mutación completa de compra:
 * 1) crea la orden  2) ejecuta el pago con Stripe  3) revalida caché  4) redirige.
 */
export async function createOrderAndPay(
  items: CartLine[],
  paymentMethodId: string,
): Promise<CheckoutState> {
  if (!items.length) return { error: "Tu carrito está vacío" };

  let orderId: number;

  try {
    const created = await api<unknown>(ENDPOINTS.orders, {
      method: "POST",
      auth: true,
      body: JSON.stringify({ items }),
    });
    const order = unwrap<Order>(created);
    orderId = order.id;

    await api(ENDPOINTS.payOrder(order.id), {
      method: "POST",
      auth: true,
      body: JSON.stringify({ payment_method: paymentMethodId }),
    });
  } catch (e) {
    if (e instanceof ApiError) {
      if (e.status === 401) redirect("/login?from=/checkout");
      return { error: e.message };
    }
    throw e;
  }

  // Evita UI desactualizada: historial y stock del catálogo
  revalidatePath("/orders");
  revalidatePath("/products");
  revalidateTag("products", "max");

  redirect(`/checkout/success?order=${orderId}`);
}
