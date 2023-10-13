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
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/google8f06b5535b3e9018.html',
      }
    ];
  },
};

module.exports = nextConfig;
