import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL!;

export async function middleware(req: NextRequest) {
  const cookie = req.headers.get("cookie") || "";

  const res = await fetch(`${API_BASE}/api/auth/me/`, {
    headers: { cookie },
  });

  if (!res.ok) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
