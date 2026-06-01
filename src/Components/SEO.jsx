import { Helmet } from "react-helmet-async";
import {
  DEFAULT_OG_IMAGE,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_WIDTH,
  OG_LOCALE,
  SITE_NAME,
  SITE_URL,
  TWITTER_SITE,
  seoDefaults,
} from "../seo.config";
import {
  buildSeoJsonLd,
  buildLocalBusinessJsonLd,
  buildBreadcrumbJsonLd,
} from "../seo/jsonLd.js";

function toAbsoluteUrl(path = "/") {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export default function SEO({
  title = seoDefaults.title,
  description = seoDefaults.description,
  keywords = seoDefaults.keywords,
  path = seoDefaults.path,
  image = DEFAULT_OG_IMAGE,
  type = "website",
  noindex = false,
  breadcrumbs,
}) {
  const canonicalUrl = toAbsoluteUrl(path);
  const imageUrl = toAbsoluteUrl(image);
  const keywordContent = Array.isArray(keywords) ? keywords.join(", ") : keywords;
  const jsonLd = buildSeoJsonLd({ title, description, canonicalUrl });

  const schemas = [jsonLd, buildLocalBusinessJsonLd()];

  if (breadcrumbs) {
    schemas.push(buildBreadcrumbJsonLd(breadcrumbs));
  }

  return (
    <Helmet>
      <html lang="en" />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywordContent} />
      <meta
        name="robots"
        content={noindex ? "noindex, nofollow" : "index, follow"}
      />
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content={OG_LOCALE} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:secure_url" content={imageUrl} />
      <meta property="og:image:width" content={String(OG_IMAGE_WIDTH)} />
      <meta property="og:image:height" content={String(OG_IMAGE_HEIGHT)} />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:alt" content={`${SITE_NAME} — ${title}`} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={TWITTER_SITE} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:image:alt" content={`${SITE_NAME} — ${title}`} />

      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </Helmet>
  );
}
