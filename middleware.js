import { NextResponse } from "next/server";

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|m.png|robots.txt|sitemap.xml|llms.txt|llms-full.txt|.well-known|api/pdf|api/cron).*)",
  ],
};

export function middleware(request) {
  const host = request.headers.get("host") || "";
  const { pathname } = request.nextUrl;

  // Admin subdomain → serve admin panel
  if (host === "admin.withmeteoric.com") {
    if (pathname === "/") {
      return NextResponse.rewrite(new URL("/admin", request.url));
    }
    if (pathname === "/login") {
      return NextResponse.rewrite(new URL("/login", request.url));
    }
    return NextResponse.rewrite(new URL(`/admin${pathname}`, request.url));
  }

  // Main domain /admin → redirect to admin subdomain
  if (host === "withmeteoric.com" && pathname.startsWith("/admin")) {
    const sub = pathname === "/admin" ? "" : pathname.replace("/admin", "");
    return NextResponse.redirect(
      `https://admin.withmeteoric.com${sub || ""}`,
      301
    );
  }

  return NextResponse.next();
}
