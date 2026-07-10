/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      {
        source: "/services/startup-web-development",
        destination: "/services/full-stack-development",
        permanent: true,
      },
      {
        source: "/services/api-development",
        destination: "/services/full-stack-development",
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
    ];
  },
};

export default nextConfig;
