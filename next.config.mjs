/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "origin-when-cross-origin" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://va.vercel-scripts.com https://cal.com https://app.cal.com https://embed.cal.com https://checkout.razorpay.com https://cdn.razorpay.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https: https://vercel.com https://asset.cloudinary.com",
              "connect-src 'self' https://*.supabase.co https://www.google-analytics.com https://vitals.vercel-insights.com https://cal.com https://app.cal.com https://api.razorpay.com https://lumberjack.razorpay.com",
              "frame-src https://cal.com https://app.cal.com https://embed.cal.com https://checkout.razorpay.com https://api.razorpay.com",
              "frame-ancestors 'none'",
            ].join("; "),
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/services/startup-web-development",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/services/api-development",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/services/ui-ux-design",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/services/technical-consulting",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/services/landing-pages",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/services/saas-development",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/services/web-applications",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/services/full-stack-development",
        destination: "/services",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
