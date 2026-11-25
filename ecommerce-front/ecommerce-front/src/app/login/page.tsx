import type { Metadata } from "next";
import AuthForm from "@/components/AuthForm";
import { loginAction } from "@/app/actions/auth";

export const metadata: Metadata = { title: "Iniciar sesión" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ from?: string }> }) {
  const { from } = await searchParams;
  return (
    <AuthForm
      title="Iniciar sesión"
      action={loginAction}
      from={from}
      submitLabel="Iniciar sesión"
      pendingLabel="Ingresando..."
      fields={[
        { name: "email", label: "Correo electrónico", type: "email", autoComplete: "email" },
        { name: "password", label: "Contraseña", type: "password", autoComplete: "current-password" },
      ]}
      footer={{ text: "¿No tienes cuenta?", href: "/register", link: "Crear cuenta" }}
    />
  );
}
