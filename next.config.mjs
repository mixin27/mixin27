import createMDX from "@next/mdx";

const withMDX = createMDX({
  // next/mdx handles static .mdx pages (e.g. app/privacy/page.mdx)
  // For dynamic content we use next-mdx-remote in lib/mdx.ts
});


/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  // Required for rehype-mermaid (uses puppeteer/playwright under the hood)
  serverExternalPackages: ["shiki", "rehype-mermaid"],
};


export default withMDX(nextConfig);
