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

const metaTitle =
  "Meteoric — Web & Software Development Agency for Startups & SaaS";
const metaDesc =
  "Meteoric is a founder-led web development agency building high-performance websites, SaaS platforms, and full-stack applications that convert — not just look good. Free strategy call.";
const metaDescOg =
  "Meteoric is a founder-led web development agency building high-performance websites, SaaS platforms, and full-stack applications that actually convert. No account managers — just shipped products.";

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
        width: 1200,
        height: 630,
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
    referrer: "origin-when-cross-origin",
    "og:image:secure_url": `${SITE_URL}${DEFAULT_OG_IMAGE}`,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfairDisplay.variable}`}>
      <head>
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
        <link rel="alternate" hrefLang="en" href={SITE_URL} />
        <link rel="alternate" hrefLang="x-default" href={SITE_URL} />
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
