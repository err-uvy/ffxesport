import { NextResponse, type NextRequest } from "next/server";

const publicRoutes = ["/login", "/register", "/forgot-password", "/verify-otp", "/reset-password"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hasSession = Boolean(req.cookies.get("ffx_access")?.value);
  const isPublic = publicRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));

  if (pathname === "/") {
    return NextResponse.redirect(new URL(hasSession ? "/dashboard" : "/login", req.url));
  }

  if (!hasSession && !isPublic && !pathname.startsWith("/_next")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (hasSession && isPublic) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"]
};
