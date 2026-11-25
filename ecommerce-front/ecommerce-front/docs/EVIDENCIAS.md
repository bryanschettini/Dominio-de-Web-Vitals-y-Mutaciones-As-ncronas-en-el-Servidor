# Evidencias a adjuntar

Guarda aquí las capturas con estos nombres para mantener el repositorio ordenado.

## 1. Endpoints consumidos desde Swagger → `docs/01-swagger.png`
1. Abre el Swagger de tu API Laravel (ej. `http://localhost:8000/api/documentation`).
2. Captura la vista donde se vean: `POST /register`, `POST /login`, `GET /products`, `GET /products/{id}`, `POST /orders`, `POST /orders/{id}/pay`, `GET /orders`. Si no caben en una captura, haz dos.

## 2. Flujo completo de compra → `docs/02-flujo-01.png` … `02-flujo-07.png`
Con la API y el frontend corriendo, captura en este orden:
1. `/products` (catálogo)
2. `/products/[id]` (detalle + "Agregar al carrito")
3. `/cart` (carrito con productos)
4. `/register` o `/login`
5. `/checkout` (tarjeta `4242 4242 4242 4242` ingresada)
6. `/checkout/success` (confirmación)
7. `/orders` (la orden aparece como **Pagada**)

Opcional: captura del Dashboard de Stripe → Pagos mostrando el cobro de prueba.

## 3. Reporte Lighthouse → `docs/03-lighthouse-products.html` (o PDF/PNG)
1. `npm run build && npm run start`
2. Chrome en **modo incógnito** → `http://localhost:3000/products`
3. DevTools (F12) → pestaña **Lighthouse** → modo **Mobile** → marca Performance, Accessibility, Best Practices y SEO → *Analyze page load*.
4. Menú ⋮ del reporte → **Save as HTML** (o captura de pantalla).
5. Repite en `/products/1` y, con sesión iniciada, en `/orders`.

Metas de referencia: LCP < 2.5 s · CLS < 0.1 · INP < 200 ms · Performance ≥ 90.
