import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

function buildCsp(isDev) {
  const directives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://va.vercel-scripts.com https://cal.com https://app.cal.com https://embed.cal.com https://checkout.razorpay.com https://cdn.razorpay.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com https://frontend-cdn.perplexity.ai",
    "img-src 'self' data: blob: https: https://vercel.com https://asset.cloudinary.com",
    "connect-src 'self' https://*.supabase.co https://www.google-analytics.com https://vitals.vercel-insights.com https://cal.com https://app.cal.com https://api.razorpay.com https://lumberjack.razorpay.com",
    "frame-src https://cal.com https://app.cal.com https://embed.cal.com https://checkout.razorpay.com https://api.razorpay.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
  ];

  if (isDev) {
    directives[1] = directives[1].replace("'unsafe-inline'", "'unsafe-inline' 'unsafe-eval'");
    directives[1] += " http://localhost:* ws://localhost:*";
    directives[2] += " http://localhost:*";
  }

  return directives.join("; ");
}

export async function proxy(request) {
  const host = request.headers.get("host") || "";
  const pn = request.nextUrl.pathname;

  // 1. Redirect http → https (skip localhost/127.0.0.1 in dev)
  const isLocalhost = host.includes("localhost") || host.startsWith("127.") || host.startsWith("0.0.0.0");
  if (request.nextUrl.protocol === "http:" && !isLocalhost) {
    const url = new URL(
      `https://${host}${pn}${request.nextUrl.search}`,
    );
    return Response.redirect(url, 301);
  }

  // 2. Redirect www → non-www (skip localhost)
  if (
    (host === "www.withmeteoric.com" || host.startsWith("www.")) &&
    !pn.startsWith("/api") && !isLocalhost
  ) {
    const url = new URL(
      `https://withmeteoric.com${pn}${request.nextUrl.search}`,
    );
    return Response.redirect(url, 301);
  }

  // 3. Redirect ?q= search parameter to homepage (broken template variable)
  if (request.nextUrl.searchParams.has("q")) {
    const url = new URL(`https://withmeteoric.com/`);
    return Response.redirect(url, 301);
  }

  // 4. Normalize double slashes in path (fixes GSC "Redirect error")
  if (pn.includes("//")) {
    const normalized = pn.replace(/\/+/g, "/");
    const url = new URL(
      `https://withmeteoric.com${normalized}${request.nextUrl.search}`,
    );
    return Response.redirect(url, 308);
  }

  // 5. Maintenance mode — redirect all public routes to /maintenance
  //    Admin, API, and static assets remain accessible so you can disable it
  if (process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true") {
    const isMaintenancePage = pn === "/maintenance";
    const isApiOrStatic =
      pn.startsWith("/api") ||
      pn.startsWith("/_next") ||
      pn.startsWith("/admin") ||
      pn.startsWith("/login") ||
      pn.startsWith("/editor") ||
      pn.startsWith("/preview") ||
      pn.startsWith("/share") ||
      pn === "/favicon.svg" ||
      pn === "/og.jpg" ||
      pn === "/apple-touch-icon.png" ||
      pn === "/site.webmanifest" ||
      pn === "/robots.txt" ||
      pn === "/sitemap.xml" ||
      pn === "/llms.txt" ||
      pn === "/llms-full.txt" ||
      pn === "/feed.xml";

    if (!isMaintenancePage && !isApiOrStatic) {
      const maintenanceUrl = request.nextUrl.clone();
      maintenanceUrl.pathname = "/maintenance";
      return NextResponse.redirect(maintenanceUrl);
    }
  }

  const isDev = process.env.NODE_ENV === "development";

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    const res = NextResponse.next({ request });
    res.headers.set("Content-Security-Policy", buildCsp(isDev));
    return res;
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  if (!user && pathname.startsWith("/admin")) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl);
  }

  if (user && pathname === "/login") {
    const adminUrl = request.nextUrl.clone();
    adminUrl.pathname = "/admin";
    return NextResponse.redirect(adminUrl);
  }

  supabaseResponse.headers.set("Content-Security-Policy", buildCsp(isDev));

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.svg|og.jpg|apple-touch-icon.png|site.webmanifest|robots.txt|sitemap.xml|llms.txt|llms-full.txt).*)",
  ],
};
