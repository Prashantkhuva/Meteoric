/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
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
