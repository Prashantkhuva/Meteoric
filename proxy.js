import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import crypto from "crypto";

const NONCE_SECRET = process.env.CSP_NONCE_SECRET || "meteori-csp-nonce-fallback";

function buildCsp(nonce, isDev) {
  const directives = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline' 'nonce-${nonce}' https://www.googletagmanager.com https://va.vercel-scripts.com https://cal.com https://app.cal.com https://embed.cal.com https://checkout.razorpay.com https://cdn.razorpay.com`,
    `style-src 'self' 'nonce-${nonce}' https://fonts.googleapis.com`,
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob: https: https://vercel.com https://asset.cloudinary.com",
    "connect-src 'self' https://*.supabase.co https://www.google-analytics.com https://vitals.vercel-insights.com https://cal.com https://app.cal.com https://api.razorpay.com https://lumberjack.razorpay.com",
    "frame-src https://cal.com https://app.cal.com https://embed.cal.com https://checkout.razorpay.com https://api.razorpay.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
  ];

  if (isDev) {
    directives[1] += " http://localhost:* ws://localhost:*";
    directives[2] += " http://localhost:*";
  }

  return directives.join("; ");
}

export async function proxy(request) {
  const nonce = crypto
    .createHmac("sha256", NONCE_SECRET)
    .update(`${Date.now()}-${Math.random()}`)
    .digest("base64");

  const isDev = process.env.NODE_ENV === "development";

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    const res = NextResponse.next({ request });
    res.headers.set("Content-Security-Policy", buildCsp(nonce, isDev));
    res.headers.set("x-nonce", nonce);
    return res;
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
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

  supabaseResponse.headers.set("Content-Security-Policy", buildCsp(nonce, isDev));
  supabaseResponse.headers.set("x-nonce", nonce);

  return supabaseResponse;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
