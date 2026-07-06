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
    title: metaTitle,
    description: metaDescOg,
    images: [`${SITE_URL}${DEFAULT_OG_IMAGE}`],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfairDisplay.variable}`}>
      <head>
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
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
                },
                {
                  "@type": "WebSite",
                  "@id": `${SITE_URL}/#website`,
                  name: SITE_NAME,
                  url: SITE_URL,
                  publisher: {
                    "@id": `${SITE_URL}/#organization`,
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
              ],
            }),
          }}
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
