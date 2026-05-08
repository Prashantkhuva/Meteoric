import { next } from "@vercel/functions";
import snapshot from "./middleware-snapshot.js";

/**
 * Social / link-unfurl crawlers that should receive full OG + JSON-LD in the
 * initial HTML (no client JS required).
 */
const SOCIAL_BOT_UA =
  /facebookexternalhit|Facebot|Twitterbot|LinkedInBot|WhatsApp|Slackbot|Discordbot|SkypeUriPreview|Applebot|Pinterest|Slurp/i;

function normalizeRoutePath(pathname) {
  if (!pathname || pathname === "/") return "/";
  const trimmed = pathname.replace(/\/$/, "");
  return trimmed || "/";
}

function escAttr(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/"/g, "&quot;");
}

function buildSocialHeadFragment(meta) {
  const imageAlt = `${escAttr(meta.siteName)} — ${escAttr(meta.title)}`;
  const tags = [
    `<meta name="description" content="${escAttr(meta.description)}" />`,
    `<meta name="keywords" content="${escAttr(meta.keywords)}" />`,
    `<meta name="robots" content="index, follow" />`,
    `<link rel="canonical" href="${escAttr(meta.canonicalUrl)}" />`,
    `<meta property="og:site_name" content="${escAttr(meta.siteName)}" />`,
    `<meta property="og:locale" content="${escAttr(meta.ogLocale)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:title" content="${escAttr(meta.title)}" />`,
    `<meta property="og:description" content="${escAttr(meta.description)}" />`,
    `<meta property="og:url" content="${escAttr(meta.canonicalUrl)}" />`,
    `<meta property="og:image" content="${escAttr(meta.imageUrl)}" />`,
    `<meta property="og:image:width" content="${escAttr(String(meta.ogImageWidth))}" />`,
    `<meta property="og:image:height" content="${escAttr(String(meta.ogImageHeight))}" />`,
    `<meta property="og:image:type" content="${escAttr(meta.ogImageType)}" />`,
    `<meta property="og:image:alt" content="${imageAlt}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:site" content="${escAttr(meta.twitterSite)}" />`,
    `<meta name="twitter:title" content="${escAttr(meta.title)}" />`,
    `<meta name="twitter:description" content="${escAttr(meta.description)}" />`,
    `<meta name="twitter:image" content="${escAttr(meta.imageUrl)}" />`,
    `<meta name="twitter:image:alt" content="${imageAlt}" />`,
    `<script type="application/ld+json">${meta.jsonLdString}</script>`,
  ];
  return tags.join("\n    ");
}

export const config = {
  matcher: [
    "/",
    "/((?!index\\.html|assets/|.*\\.[\\w.-]+$).*)",
  ],
};

export default async function middleware(request) {
  const ua = request.headers.get("user-agent") || "";
  if (!SOCIAL_BOT_UA.test(ua)) {
    return next();
  }

  const url = new URL(request.url);
  const pathKey = normalizeRoutePath(url.pathname);
  const meta = snapshot[pathKey] || snapshot["/"];

  const indexUrl = new URL("/index.html", url.origin);
  const staticRes = await fetch(indexUrl.toString(), { redirect: "manual" });

  if (!staticRes.ok) {
    return next();
  }

  let html = await staticRes.text();

  html = html.replace(
    /<title>[\s\S]*?<\/title>/i,
    `<title>${escAttr(meta.title)}</title>`,
  );

  if (!html.includes("</head>")) {
    return next();
  }

  if (!/property=["']og:title["']/i.test(html)) {
    html = html.replace("</head>", `    ${buildSocialHeadFragment(meta)}\n</head>`);
  }

  return new Response(html, {
    status: 200,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
