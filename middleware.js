export default function middleware(request) {
  const host = request.headers.get("host") || "";
  const { pathname, search } = request.nextUrl;

  if (
    (host === "www.withmeteoric.com" || host.startsWith("www.")) &&
    !pathname.startsWith("/api")
  ) {
    const url = new URL(`https://withmeteoric.com${pathname}${search}`);
    return Response.redirect(url, 301);
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon|m.png|og.png|apple-touch-icon|site\\.webmanifest|robots\\.txt|sitemap\\.xml|llms|meteoric-indexnow-key|prashant\\.png).*)",
  ],
};
