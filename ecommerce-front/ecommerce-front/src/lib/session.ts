import "server-only";
import { cookies } from "next/headers";

const COOKIE = "token";

/** Guarda el token en una cookie httpOnly: JavaScript del navegador no puede leerla. */
export async function setToken(token: string) {
  const store = await cookies();
  store.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function getToken() {
  return (await cookies()).get(COOKIE)?.value;
}

export async function clearToken() {
  (await cookies()).delete(COOKIE);
}
