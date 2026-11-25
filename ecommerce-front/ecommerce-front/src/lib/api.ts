import "server-only";
import { getToken } from "./session";

const BASE = process.env.API_BASE_URL;

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public errors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface Options extends Omit<RequestInit, "next"> {
  /** Adjunta el Bearer token de la cookie */
  auth?: boolean;
  /** Tags de caché para revalidateTag() */
  tags?: string[];
  /** Segundos de caché; false = sin caché */
  revalidate?: number | false;
}

/** Fetch centralizado para el servidor (Server Components y Server Actions). */
export async function api<T>(
  path: string,
  { auth, tags, revalidate, ...init }: Options = {},
): Promise<T> {
  if (!BASE) {
    throw new ApiError(500, "Falta configurar API_BASE_URL en .env.local");
  }

  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string> | undefined),
  };

  if (auth) {
    const token = await getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  // Las mutaciones y las lecturas autenticadas nunca se cachean
  const cacheOpts =
    auth || (init.method && init.method !== "GET")
      ? { cache: "no-store" as const }
      : { next: { tags, revalidate: revalidate === undefined ? 60 : revalidate } };

  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, { ...init, headers, ...cacheOpts });
  } catch {
    throw new ApiError(503, "No se pudo conectar con la API. Verifica que esté en ejecución.");
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.message ?? `Error ${res.status} en la API`, body.errors);
  }
  return res.json();
}

/** Laravel suele envolver en { data: ... }; aceptamos ambos formatos. */
export function unwrap<T>(body: unknown): T {
  if (body && typeof body === "object" && "data" in body) {
    return (body as { data: T }).data;
  }
  return body as T;
}

/** Extrae el token sin importar cómo lo nombre la API. */
export function extractToken(body: any): string | undefined {
  return body?.token ?? body?.access_token ?? body?.data?.token ?? body?.data?.access_token;
}
