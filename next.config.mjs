import { withContentlayer } from "next-contentlayer";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/",
        destination: "/google8f06b5535b3e9018.html",
      },
    ];
  },
};

export default withContentlayer(nextConfig);
