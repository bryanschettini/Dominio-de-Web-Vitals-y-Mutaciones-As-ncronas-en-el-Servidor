import { NextRequest, NextResponse } from "next/server";

const PROTECTED = ["/checkout", "/orders"];

/** Next.js 16: proxy.ts reemplaza a middleware.ts */
export function proxy(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const isProtected = PROTECTED.some((p) => req.nextUrl.pathname.startsWith(p));

  if (isProtected && !token) {
    const url = new URL("/login", req.url);
    url.searchParams.set("from", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/checkout/:path*", "/orders/:path*"] };
