import "../src/index.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import ClientLayout from "./client-layout";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import ErrorBoundary from "@/components/sections/ErrorBoundary";
import JsonLd from "@/components/seo/JsonLd";
import {
  buildOrganizationJsonLd,
  buildWebSiteJsonLd,
} from "@/lib/seo/jsonLd";
import {
  SITE_URL,
  SITE_NAME,
  SITE_TITLE,
  TITLE_TEMPLATE,
  DEFAULT_DESCRIPTION,
  GOOGLE_SITE_VERIFICATION,
  ogImage,
} from "@/lib/seo/config";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const switzer = localFont({
  src: [
    { path: "../public/fonts/switzer-400.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/switzer-500.woff2", weight: "500", style: "normal" },
    { path: "../public/fonts/switzer-600.woff2", weight: "600", style: "normal" },
    { path: "../public/fonts/switzer-700.woff2", weight: "700", style: "normal" },
  ],
  display: "swap",
  variable: "--font-switzer",
});

// No root-level canonical here: every indexable page declares its own
// self-referencing canonical. A root canonical would leak to /login,
// /editor, and /not-found.
export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_TITLE, template: TITLE_TEMPLATE },
  description: DEFAULT_DESCRIPTION,
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  robots: "index, follow",
  ...(GOOGLE_SITE_VERIFICATION
    ? { verification: { google: GOOGLE_SITE_VERIFICATION } }
    : {}),
  openGraph: {
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
    title: SITE_TITLE,
    description: DEFAULT_DESCRIPTION,
    url: `${SITE_URL}/`,
    images: ogImage(SITE_TITLE),
  },
  twitter: {
    card: "summary_large_image",
    site: "@prashantkhuva_",
    creator: "@prashantkhuva_",
    title: SITE_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [`${SITE_URL}/og.jpg`],
  },
  other: {
    "theme-color": "#050505",
    referrer: "origin-when-cross-origin",
    "og:image:secure_url": `${SITE_URL}/og.jpg`,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${switzer.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.setAttribute('data-reveal','on')}}catch(e){}",
          }}
        />
        <JsonLd data={buildOrganizationJsonLd()} />
        <JsonLd data={buildWebSiteJsonLd()} />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link
          rel="preconnect"
          href={
            process.env.NEXT_PUBLIC_SUPABASE_URL
              ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).origin
              : ""
          }
        />
        <link rel="dns-prefetch" href="https://cal.com" />
        <link
          rel="alternate"
          href="/llms.txt"
          type="text/plain"
          title="LLM-friendly site index"
        />
        <link
          rel="alternate"
          href="/llms-full.txt"
          type="text/plain"
          title="Meteoric extended AI index"
        />
        <link
          rel="alternate"
          href="/feed.xml"
          type="application/rss+xml"
          title="Meteoric Blog"
        />
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
