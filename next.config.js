/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "oasis-ecommerce-app.vercel.app",
      },
    ],
  },
};

module.exports = nextConfig;
