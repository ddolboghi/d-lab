/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: "standalone",
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  publicRuntimeConfig: {
    HOST: process.env.HOST,
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
};

export default nextConfig;
