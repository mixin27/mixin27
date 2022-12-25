/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    dangerouslyAllowSVG: true,
    domains: [
      "tailwindui.com",
      "images.unsplash.com",
      "eincode.com",
      "thrangra.sirv.com",
      "cdn.sanity.io",
      "vercel.com",
    ],
  },
};

module.exports = nextConfig;
