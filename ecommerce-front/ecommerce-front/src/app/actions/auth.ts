"use server";

import { redirect } from "next/navigation";
import { api, ApiError, extractToken } from "@/lib/api";
import { ENDPOINTS } from "@/lib/endpoints";
import { clearToken, setToken } from "@/lib/session";
import type { FormState } from "@/types";

/** Solo permite redirecciones internas (evita open redirect). */
function safePath(from: FormDataEntryValue | null) {
  const p = typeof from === "string" ? from : "";
  return p.startsWith("/") && !p.startsWith("//") ? p : "/products";
}

async function authenticate(path: string, payload: Record<string, unknown>, fallback: string) {
  try {
    const body = await api<unknown>(path, { method: "POST", body: JSON.stringify(payload) });
    const token = extractToken(body);
    if (!token) return { error: "La API no devolvió un token" } as FormState;
    await setToken(token);
    return null;
  } catch (e) {
    if (e instanceof ApiError) return { error: e.message, fieldErrors: e.errors } as FormState;
    return { error: fallback } as FormState;
  }
}

export async function loginAction(_: FormState, formData: FormData): Promise<FormState> {
  const failure = await authenticate(
    ENDPOINTS.login,
    { email: formData.get("email"), password: formData.get("password") },
    "No se pudo iniciar sesión",
  );
  if (failure) return failure;
  redirect(safePath(formData.get("from")));
}

export async function registerAction(_: FormState, formData: FormData): Promise<FormState> {
  const failure = await authenticate(
    ENDPOINTS.register,
    {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      password_confirmation: formData.get("password_confirmation"),
    },
    "No se pudo crear la cuenta",
  );
  if (failure) return failure;
  redirect("/products");
}

export async function logoutAction() {
  await clearToken();
  redirect("/login");
}
