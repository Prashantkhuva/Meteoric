import "../src/index.css";
import { Analytics } from "@vercel/analytics/react";
import ClientLayout from "./client-layout";
import { Inter, DM_Sans } from "next/font/google";
import ErrorBoundary from "@/Components/ErrorBoundary";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
});

export const metadata = {
  title: "Meteoric — Web Development Agency for Startups & SaaS",
  description:
    "Meteoric is a web development agency that designs and builds high-performance websites, SaaS platforms, and full-stack applications that convert. Book a free strategy call.",
  metadataBase: new URL("https://withmeteoric.vercel.app"),
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  robots: "index, follow",
  openGraph: {
    siteName: "Meteoric",
    locale: "en_US",
    type: "website",
    title: "Meteoric — Web Development Agency for Startups & SaaS",
    description:
      "Meteoric is a web development agency that designs and builds high-performance websites, SaaS platforms, and full-stack applications that actually convert. Book a free strategy call.",
    url: "https://withmeteoric.vercel.app/",
    images: [
      {
        url: "https://withmeteoric.vercel.app/og-image.png?v=20260508",
        secureUrl: "https://withmeteoric.vercel.app/og-image.png?v=20260508",
        width: 1635,
        height: 962,
        alt: "Meteoric — Web Development Agency for Startups & SaaS",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@prashantkhuva_",
    title: "Meteoric — Web Development Agency for Startups & SaaS",
    description:
      "Meteoric is a web development agency that designs and builds high-performance websites, SaaS platforms, and full-stack applications that actually convert. Book a free strategy call.",
    images: ["https://withmeteoric.vercel.app/og-image.png?v=20260508"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${dmSans.variable}`}>
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
                  "@id": "https://withmeteoric.vercel.app/#organization",
                  name: "Meteoric",
                  url: "https://withmeteoric.vercel.app/",
                  logo: "https://withmeteoric.vercel.app/og-image.png?v=20260508",
                  founder: { "@type": "Person", name: "Prashant Khuva" },
                },
                {
                  "@type": "WebSite",
                  "@id": "https://withmeteoric.vercel.app/#website",
                  name: "Meteoric",
                  url: "https://withmeteoric.vercel.app/",
                  publisher: {
                    "@id": "https://withmeteoric.vercel.app/#organization",
                  },
                },
                {
                  "@type": "ProfessionalService",
                  "@id": "https://withmeteoric.vercel.app/#service",
                  name: "Meteoric",
                  url: "https://withmeteoric.vercel.app/",
                  description:
                    "Full-stack web development, SaaS products, and landing pages for startups.",
                  areaServed: "Worldwide",
                  serviceType: [
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
      <body>
        <ErrorBoundary>
          <ClientLayout>{children}</ClientLayout>
        </ErrorBoundary>
        <Analytics />
      </body>
    </html>
  );
}
