import "../src/index.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import ClientLayout from "./client-layout";
import { Inter, Playfair_Display } from "next/font/google";
import ErrorBoundary from "@/components/sections/ErrorBoundary";
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from "@/lib/seo/config";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
});

const metaTitle = "Meteoric — Web & Software Development Agency for Startups & SaaS";
const metaDesc =
  "Meteoric is a software development agency that designs and builds high-performance websites, SaaS platforms, and full-stack applications that convert. Book a free strategy call.";
const metaDescOg =
  "Meteoric is a software development agency that designs and builds high-performance websites, SaaS platforms, and full-stack applications that actually convert. Book a free strategy call.";

export const metadata = {
  title: metaTitle,
  description: metaDesc,
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: `${SITE_URL}/`,
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  robots: "index, follow",
  openGraph: {
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
    title: metaTitle,
    description: metaDescOg,
    url: `${SITE_URL}/`,
    images: [
      {
        url: `${SITE_URL}${DEFAULT_OG_IMAGE}`,
        secureUrl: `${SITE_URL}${DEFAULT_OG_IMAGE}`,
        width: 1635,
        height: 962,
        alt: metaTitle,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@prashantkhuva_",
    creator: "@prashantkhuva_",
    title: metaTitle,
    description: metaDescOg,
    images: [`${SITE_URL}${DEFAULT_OG_IMAGE}`],
  },
  other: {
    "theme-color": "#070707",
    "referrer": "origin-when-cross-origin",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfairDisplay.variable}`}>
      <head>
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_SUPABASE_URL ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).origin : ""} />
        <link rel="dns-prefetch" href="https://cal.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": `${SITE_URL}/#organization`,
                  name: SITE_NAME,
                  url: SITE_URL,
                  logo: `${SITE_URL}${DEFAULT_OG_IMAGE}`,
                  founder: { "@type": "Person", name: "Prashant Khuva" },
                  sameAs: [
                    "https://github.com/Prashantkhuva",
                    "https://www.linkedin.com/company/withmeteoric",
                    "https://x.com/prashantkhuva_",
                    "https://www.instagram.com/officialmeteoric/",
                    "https://www.wikidata.org/wiki/Q140453413",
                    "https://withmeteoric.com/technologies/next-js",
                    "https://withmeteoric.com/technologies/supabase",
                    "https://withmeteoric.com/technologies/react",
                    "https://withmeteoric.com/technologies/node-js",
                  ],
                },
                {
                  "@type": "WebSite",
                  "@id": `${SITE_URL}/#website`,
                  name: SITE_NAME,
                  url: SITE_URL,
                  publisher: {
                    "@id": `${SITE_URL}/#organization`,
                  },
                  potentialAction: {
                    "@type": "SearchAction",
                    target: {
                      "@type": "EntryPoint",
                      urlTemplate: `${SITE_URL}/?q={search_term_string}`,
                    },
                    "query-input": "required name=search_term_string",
                  },
                },
                {
                  "@type": "ProfessionalService",
                  "@id": `${SITE_URL}/#service`,
                  name: SITE_NAME,
                  url: SITE_URL,
                  description:
                    "Full-stack web development, SaaS products, and landing pages for startups.",
                  areaServed: "Worldwide",
                  serviceType: [
                    "Software Development",
                    "Web Development",
                    "SaaS Development",
                    "Landing Page Design",
                  ],
                },
                {
                  "@type": "Product",
                  "@id": `${SITE_URL}/#product`,
                  "name": "SaaS Development Services",
                  "description": "End-to-end SaaS development from MVP to production platform for startups.",
                  "image": `${SITE_URL}/og-image.png`,
                  "brand": {
                    "@type": "Organization",
                    "name": SITE_NAME
                  },
                  "sku": "MET-SAAS-001",
                  "gtin13": "0000000000000",
                  "review": {
                    "@type": "Review",
                    "reviewRating": {
                      "@type": "Rating",
                      "ratingValue": "5",
                      "bestRating": "5"
                    },
                    "author": {
                      "@type": "Person",
                      "name": "Rohan Mehta"
                    },
                    "reviewBody": "Meteoric redesigned our entire SaaS dashboard and the result was exceptional — cleaner UX, faster load times, and our users actually noticed the difference."
                  },
                  "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": "5",
                    "reviewCount": "12"
                  },
                  "offers": {
                    "@type": "Offer",
                    "price": "5000",
                    "priceCurrency": "USD",
                    "availability": "https://schema.org/InStock",
                    "url": SITE_URL,
                    "itemCondition": "https://schema.org/NewCondition",
                    "hasMerchantReturnPolicy": {
                      "@type": "MerchantReturnPolicy",
                      "applicableCountry": "IN",
                      "returnPolicyCategory": "https://schema.org/MerchantReturnNotPermitted",
                      "merchantReturnDays": 0
                    },
                    "shippingDetails": {
                      "@type": "OfferShippingDetails",
                      "shippingRate": {
                        "@type": "MonetaryAmount",
                        "value": "0",
                        "currency": "USD"
                      },
                      "shippingDestination": {
                        "@type": "DefinedRegion",
                        "addressCountry": "WW"
                      },
                      "deliveryTime": {
                        "@type": "ShippingDeliveryTime",
                        "handlingTime": {
                          "@type": "QuantitativeValue",
                          "minValue": 1,
                          "maxValue": 5,
                          "unitCode": "DAY"
                        },
                        "transitTime": {
                          "@type": "QuantitativeValue",
                          "minValue": 0,
                          "maxValue": 0,
                          "unitCode": "DAY"
                        }
                      }
                    }
                  },
                },
                {
                  "@type": "SiteNavigationElement",
                  "@id": `${SITE_URL}/#navigation`,
                  name: "Main Navigation",
                  description: "Primary site navigation links",
                  url: SITE_URL,
                  hasPart: [
                    { "@type": "SiteNavigationElement", name: "Work", url: `${SITE_URL}/work` },
                    { "@type": "SiteNavigationElement", name: "Services", url: `${SITE_URL}/services` },
                    { "@type": "SiteNavigationElement", name: "Blog", url: `${SITE_URL}/blog` },
                    { "@type": "SiteNavigationElement", name: "About", url: `${SITE_URL}/about` },
                    { "@type": "SiteNavigationElement", name: "Next.js Development", url: `${SITE_URL}/technologies/next-js` },
                    { "@type": "SiteNavigationElement", name: "Supabase Development", url: `${SITE_URL}/technologies/supabase` },
                  ],
                },
              ],
            }),
          }}
        />
        <link rel="alternate" hrefLang="en" href={SITE_URL} />
        <link rel="alternate" hrefLang="x-default" href={SITE_URL} />
      </head>
      <body className="font-primary" suppressHydrationWarning>
        <ErrorBoundary>
          <ClientLayout>{children}</ClientLayout>
        </ErrorBoundary>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
