import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    transpilePackages: ['next-mdx-remote'],
    reactStrictMode: true,
    images: {
        remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    },
    // MDX support
    pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
};

export default nextConfig;
