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
  async redirects() {
    return [
      // Clients moved from /tools/invoices/clients to /tools/clients
      { source: "/tools/invoices/clients", destination: "/tools/clients", permanent: true },
      { source: "/tools/invoices/clients/new", destination: "/tools/clients/new", permanent: true },
      { source: "/tools/invoices/clients/:id", destination: "/tools/clients/:id", permanent: true },
      // Backup moved from /tools/migrate to /tools/backup
      { source: "/tools/migrate", destination: "/tools/backup", permanent: true },
      // Project renamed: Astral Wealth -> Astra Wealth Sales
      { source: "/projects/astral-wealth-mobile", destination: "/projects/astra-wealth-sales", permanent: true },
    ];
  },
};


export default withMDX(nextConfig);
