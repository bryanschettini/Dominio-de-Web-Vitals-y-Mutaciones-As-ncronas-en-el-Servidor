/**
 * Rutas de la API Laravel en un solo lugar.
 * Si tu Swagger usa otras rutas, solo cambia este archivo.
 */
export const ENDPOINTS = {
  register: "/register",
  login: "/login",
  products: "/products",
  product: (id: number | string) => `/products/${id}`,
  orders: "/orders",
  payOrder: (id: number | string) => `/orders/${id}/pay`,
} as const;
