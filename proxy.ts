import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// Convenience redirect only; the boundary is requireAdmin() in every page
// and action (D84). Next 16 calls this file proxy.ts, not middleware.ts.
export const proxy = auth((req) => {
  if (req.nextUrl.pathname === "/dashboard/login") return NextResponse.next();
  if (!req.auth) {
    return NextResponse.redirect(new URL("/dashboard/login", req.nextUrl));
  }
  return NextResponse.next();
});

// Public routes are never matched
export const config = { matcher: ["/dashboard/:path*"] };
