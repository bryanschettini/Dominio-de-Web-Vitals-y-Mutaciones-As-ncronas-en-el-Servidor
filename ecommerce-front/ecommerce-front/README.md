# Tienda – Frontend E-commerce en Next.js 16

Frontend en **Next.js 16 (App Router) + TypeScript + Tailwind CSS 4** que consume la API REST de e-commerce (Laravel 12 + Swagger + Stripe). Implementa el flujo completo: catálogo → detalle → carrito → registro/login → orden → pago con Stripe → confirmación → historial.

## Requisitos
- Node.js 20.9 o superior
- API Laravel en ejecución (ej. `http://localhost:8000`)
- Cuenta de Stripe en modo prueba (clave pública `pk_test_...`)

## Configuración y ejecución

```bash
git clone https://github.com/<tu-usuario>/ecommerce-front.git
cd ecommerce-front
cp .env.example .env.local     # y completa los valores
npm install
npm run dev                    # http://localhost:3000
```

Producción (necesario para medir con Lighthouse):

```bash
npm run build && npm run start
```

### Variables de entorno (`.env.example`)

| Variable | Descripción |
|---|---|
| `API_BASE_URL` | URL base de la API incluyendo `/api`, ej. `http://localhost:8000/api`. Solo se usa en el servidor (no se expone al navegador). |
| `NEXT_PUBLIC_STRIPE_KEY` | Clave **pública** de Stripe (`pk_test_...`). Es seguro exponerla. |

### ¿Rutas de la API distintas?
Todas las rutas del backend están en un único archivo: [`src/lib/endpoints.ts`](src/lib/endpoints.ts). Si tu Swagger usa otras, solo edita ese archivo.

| Acción | Método y ruta usada |
|---|---|
| Registro | `POST /register` |
| Login | `POST /login` |
| Listar productos | `GET /products` |
| Detalle de producto | `GET /products/{id}` |
| Crear orden | `POST /orders` (Bearer token) |
| Pagar orden | `POST /orders/{id}/pay` (Bearer token) |
| Historial | `GET /orders` (Bearer token) |

### Sin Laravel a mano: API de prueba
Para ver la interfaz funcionando sin el backend:

```bash
npm run mock-api     # http://localhost:8000/api (datos en memoria)
```
> Solo es para demo local. Las evidencias finales deben tomarse con tu API real.

## Rutas implementadas

| Ruta | Acceso | Descripción |
|---|---|---|
| `/products` | Pública | Catálogo (Server Component + Suspense) |
| `/products/[id]` | Pública | Detalle del producto y botón de agregar |
| `/login`, `/register` | Pública | Autenticación con Server Actions |
| `/cart` | Pública | Carrito en estado local (Context + localStorage) |
| `/checkout` | Protegida | Resumen y pago con Stripe Elements |
| `/checkout/success` | Protegida | Confirmación de compra |
| `/orders` | Protegida | Historial de órdenes (Suspense) |

## Decisiones técnicas

- **Lecturas en Server Components** (`fetch` en el servidor con `tags` y `revalidate`) → menos JavaScript en el cliente.
- **Mutaciones con Server Actions** (`login`, `register`, `logout`, `createOrderAndPay`).
- **Token en cookie `httpOnly`** (`secure` en producción, `sameSite=lax`): el JavaScript del navegador nunca puede leerlo. Se adjunta como `Bearer` solo desde el servidor (`src/lib/api.ts`).
- **Protección de rutas** con `src/proxy.ts` (en Next 16 reemplaza a `middleware.ts`): sin cookie, `/checkout` y `/orders` redirigen a `/login?from=...`. La redirección posterior al login valida que sea una ruta interna (evita *open redirect*).
- **Datos actualizados tras mutar**: `createOrderAndPay` ejecuta `revalidatePath("/orders")`, `revalidatePath("/products")` y `revalidateTag("products", "max")` (el stock cambia al comprar).
- **Resiliencia**: `loading.tsx` en catálogo, checkout e historial; `error.tsx` con botón *Reintentar* en las mismas rutas; `not-found.tsx` para productos inexistentes; `Suspense` con *skeleton* en catálogo e historial; errores de validación de Laravel (422) mostrados por campo.
- **Rendimiento (Web Vitals)**: `next/image` con `priority` en imágenes above-the-fold (LCP), dimensiones reservadas y skeletons (CLS), poco estado en el cliente (INP), Stripe cargado solo en `/checkout`, fuentes del sistema (sin bloqueo de render).
- **Accesibilidad**: etiquetas en formularios, `role="alert"` en errores, foco visible, `prefers-reduced-motion`.

## Estructura

```
src/
├─ app/            rutas, loading.tsx, error.tsx y actions/ (Server Actions)
├─ components/     CartProvider, CheckoutForm, AuthForm, ProductCard...
├─ lib/            api.ts (fetch central), session.ts (cookie), endpoints.ts
├─ types/          tipos TypeScript
└─ proxy.ts        protección de rutas
mock-api/          API de prueba opcional
docs/              evidencias (Swagger, flujo de compra, Lighthouse)
```

## Evidencias
Carpeta [`docs/`](docs/): capturas de Swagger, flujo completo de compra y reporte Lighthouse. Ver [`docs/EVIDENCIAS.md`](docs/EVIDENCIAS.md).

## Prueba de pago
Tarjeta de prueba de Stripe: `4242 4242 4242 4242`, cualquier fecha futura y cualquier CVC.
