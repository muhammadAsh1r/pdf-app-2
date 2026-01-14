import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("access")?.value;
  const { pathname } = req.nextUrl;

  // 🔒 Protected routes (require auth)
  const isProtected =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/billing") ||
    pathname.startsWith("/tools");

  // 🚫 Not logged in → redirect to login
  if (isProtected && !accessToken) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 👤 Logged-in users should not see auth pages
  if (
    accessToken &&
    (pathname === "/login" || pathname === "/register")
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/dashboard/:path*",
    "/settings/:path*",
    "/billing/:path*",
    "/tools/:path*",
  ],
};
