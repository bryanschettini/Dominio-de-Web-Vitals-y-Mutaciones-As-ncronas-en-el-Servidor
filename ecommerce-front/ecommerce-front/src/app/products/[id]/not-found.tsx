import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-md p-10 text-center">
      <h1 className="text-2xl font-bold">Producto no encontrado</h1>
      <Link href="/products" className="mt-4 inline-block text-brand underline">Volver al catálogo</Link>
    </main>
  );
}
