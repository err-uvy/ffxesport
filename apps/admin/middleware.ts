import { NextResponse, type NextRequest } from "next/server";

const publicRoutes = ["/login", "/403"];

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const hasSession = Boolean(req.cookies.get("ffx_access")?.value);
  const isPublic = publicRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));

  if (pathname === "/") {
    return NextResponse.redirect(new URL(hasSession ? "/admin" : "/login", req.url));
  }

  if (!hasSession && !isPublic && !pathname.startsWith("/_next")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (hasSession && pathname === "/login") {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"]
};
