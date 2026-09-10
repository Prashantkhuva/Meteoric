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
          value: "max-age=15552000; includeSubDomains; preload",
        },
        {
          key: "Permissions-Policy",
          value: "camera=(), microphone=(), geolocation=()",
        },
        {
          key: "Content-Security-Policy",
          value: "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://va.vercel-scripts.com https://cal.com https://app.cal.com https://embed.cal.com https://checkout.razorpay.com https://cdn.razorpay.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com https://frontend-cdn.perplexity.ai; img-src 'self' data: blob: https: https://vercel.com https://asset.cloudinary.com; connect-src 'self' https://*.supabase.co https://www.google-analytics.com https://vitals.vercel-insights.com https://cal.com https://app.cal.com https://api.razorpay.com https://lumberjack.razorpay.com; frame-src https://cal.com https://app.cal.com https://embed.cal.com https://checkout.razorpay.com https://api.razorpay.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests",
        },
        ],
      },
    ];
  },
  async redirects() {
    return [
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
        source: "/services/full-stack-development",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/technologies/:path*",
        destination: "/services",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
