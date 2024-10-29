/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: "standalone",
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/login",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/:path*-filter",
        destination: `${process.env.NEXT_PUBLIC_SITE_URL}/:path*-filter`,
      },
    ];
  },
};

export default nextConfig;
