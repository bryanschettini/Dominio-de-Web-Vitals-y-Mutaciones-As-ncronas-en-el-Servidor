import Link from "next/link";
import { getToken } from "@/lib/session";
import { logoutAction } from "@/app/actions/auth";
import CartLink from "./CartLink";

export default async function Header() {
  const logged = Boolean(await getToken());

  return (
    <header className="border-b border-line">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center gap-1 px-4 py-3 text-sm">
        <Link href="/products" className="mr-auto text-lg font-bold text-brand">
          Tienda
        </Link>
        <Link href="/products" className="rounded px-3 py-2 hover:bg-surface">
          Catálogo
        </Link>
        <CartLink />
        {logged ? (
          <>
            <Link href="/orders" className="rounded px-3 py-2 hover:bg-surface">
              Mis compras
            </Link>
            <form action={logoutAction}>
              <button className="rounded px-3 py-2 hover:bg-surface">Cerrar sesión</button>
            </form>
          </>
        ) : (
          <>
            <Link href="/login" className="rounded px-3 py-2 hover:bg-surface">
              Iniciar sesión
            </Link>
            <Link
              href="/register"
              className="rounded bg-brand px-3 py-2 font-medium text-white hover:bg-brand-dark"
            >
              Crear cuenta
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
