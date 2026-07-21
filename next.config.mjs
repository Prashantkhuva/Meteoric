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
        source: "/services/landing-pages",
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
