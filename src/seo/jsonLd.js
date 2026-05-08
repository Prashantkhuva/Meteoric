import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from "../seo.config.js";

const SITE_WEBSITE_ID = `${SITE_URL}/#website`;
const SITE_ORG_ID = `${SITE_URL}/#organization`;
const SITE_LOGO_URL = `${SITE_URL}${DEFAULT_OG_IMAGE}`;

/**
 * Page-level JSON-LD (@graph: Organization + WebSite + WebPage) for SPA routes.
 */
export function buildSeoJsonLd({ title, description, canonicalUrl }) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": SITE_ORG_ID,
        name: SITE_NAME,
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: SITE_LOGO_URL,
        },
      },
      {
        "@type": "WebSite",
        "@id": SITE_WEBSITE_ID,
        name: SITE_NAME,
        url: SITE_URL,
        publisher: { "@id": SITE_ORG_ID },
      },
      {
        "@type": "WebPage",
        "@id": `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: title,
        description,
        isPartOf: { "@id": SITE_WEBSITE_ID },
      },
    ],
  };
}
