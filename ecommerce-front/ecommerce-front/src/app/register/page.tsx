import type { Metadata } from "next";
import AuthForm from "@/components/AuthForm";
import { registerAction } from "@/app/actions/auth";

export const metadata: Metadata = { title: "Crear cuenta" };

export default function RegisterPage() {
  return (
    <AuthForm
      title="Crear cuenta"
      action={registerAction}
      submitLabel="Crear cuenta"
      pendingLabel="Creando cuenta..."
      fields={[
        { name: "name", label: "Nombre", type: "text", autoComplete: "name" },
        { name: "email", label: "Correo electrónico", type: "email", autoComplete: "email" },
        { name: "password", label: "Contraseña", type: "password", autoComplete: "new-password" },
        { name: "password_confirmation", label: "Confirmar contraseña", type: "password", autoComplete: "new-password" },
      ]}
      footer={{ text: "¿Ya tienes cuenta?", href: "/login", link: "Iniciar sesión" }}
    />
  );
}
