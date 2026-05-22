import { next } from "@vercel/functions";
import snapshot from "./middleware-snapshot.js";

/**
 * Crawlers that need route-correct meta in the initial HTML (no client JS).
 * Includes search engines (Google, Bing, …) and social link preview bots.
 */
const CRAWLER_UA =
  /googlebot|google-inspectiontool|bingbot|duckduckbot|baiduspider|yandexbot|slurp|facebookexternalhit|facebot|twitterbot|linkedinbot|whatsapp|slackbot|discordbot|skypeuripreview|applebot|pinterest|bytespider|gptbot|claudebot|perplexitybot/i;

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
    `<meta property="og:image:secure_url" content="${escAttr(meta.imageUrl)}" />`,
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
  if (!CRAWLER_UA.test(ua)) {
    return next();
  }

  try {
    const url = new URL(request.url);
    const pathKey = normalizeRoutePath(url.pathname);
    const meta = snapshot[pathKey] || snapshot["/"];

    const indexUrl = new URL("/index.html", url.origin);
    // Avoid edge subrequest blocks: act like a normal browser fetching HTML.
    const staticRes = await fetch(indexUrl.toString(), {
      redirect: "manual",
      headers: {
        Accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
        "User-Agent":
          ua ||
          "Mozilla/5.0 (compatible; MeteoricPreviewBot/1.0; +https://withmeteoric.vercel.app)",
      },
    });

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
      html = html.replace(
        "</head>",
        `    ${buildSocialHeadFragment(meta)}\n</head>`,
      );
    }

    return new Response(html, {
      status: 200,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch {
    return next();
  }
}
