import { next } from "@vercel/functions";
import snapshot from "./middleware-snapshot.js";

/**
 * Crawlers that need route-correct meta in the initial HTML (no client JS).
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

function replaceTag(html, pattern, replacement) {
  return pattern.test(html) ? html.replace(pattern, replacement) : html;
}

function upsertMeta(html, attr, key, content) {
  const pattern = new RegExp(
    `<meta\\s+${attr}=["']${key}["'][^>]*>`,
    "i",
  );
  const tag = `<meta ${attr}="${key}" content="${escAttr(content)}" />`;
  return replaceTag(html, pattern, tag);
}

function upsertLink(html, rel, href) {
  const pattern = new RegExp(`<link\\s+rel=["']${rel}["'][^>]*>`, "i");
  const tag = `<link rel="${rel}" href="${escAttr(href)}" />`;
  return replaceTag(html, pattern, tag);
}

function buildJsonLdScript(jsonLdString) {
  return `<script type="application/ld+json">${jsonLdString}</script>`;
}

function applyRouteMeta(html, meta) {
  let out = html;

  out = replaceTag(
    out,
    /<title>[\s\S]*?<\/title>/i,
    `<title>${escAttr(meta.title)}</title>`,
  );

  out = upsertMeta(out, "name", "description", meta.description);
  out = upsertMeta(out, "name", "keywords", meta.keywords);
  out = upsertMeta(out, "name", "robots", "index, follow");
  out = upsertLink(out, "canonical", meta.canonicalUrl);

  out = upsertMeta(out, "property", "og:site_name", meta.siteName);
  out = upsertMeta(out, "property", "og:locale", meta.ogLocale);
  out = upsertMeta(out, "property", "og:type", "website");
  out = upsertMeta(out, "property", "og:title", meta.title);
  out = upsertMeta(out, "property", "og:description", meta.description);
  out = upsertMeta(out, "property", "og:url", meta.canonicalUrl);
  out = upsertMeta(out, "property", "og:image", meta.imageUrl);
  out = upsertMeta(out, "property", "og:image:secure_url", meta.imageUrl);
  out = upsertMeta(
    out,
    "property",
    "og:image:width",
    String(meta.ogImageWidth),
  );
  out = upsertMeta(
    out,
    "property",
    "og:image:height",
    String(meta.ogImageHeight),
  );
  out = upsertMeta(out, "property", "og:image:type", meta.ogImageType);
  out = upsertMeta(
    out,
    "property",
    "og:image:alt",
    `${meta.siteName} — ${meta.title}`,
  );

  out = upsertMeta(out, "name", "twitter:card", "summary_large_image");
  out = upsertMeta(out, "name", "twitter:site", meta.twitterSite);
  out = upsertMeta(out, "name", "twitter:title", meta.title);
  out = upsertMeta(out, "name", "twitter:description", meta.description);
  out = upsertMeta(out, "name", "twitter:image", meta.imageUrl);
  out = upsertMeta(
    out,
    "name",
    "twitter:image:alt",
    `${meta.siteName} — ${meta.title}`,
  );

  out = out.replace(
    /<script\s+type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi,
    "",
  );

  if (out.includes("</head>")) {
    out = out.replace(
      "</head>",
      `    ${buildJsonLdScript(meta.jsonLdString)}\n</head>`,
    );
  }

  return out;
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

    if (!html.includes("</head>")) {
      return next();
    }

    html = applyRouteMeta(html, meta);

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
