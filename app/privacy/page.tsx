import { notFound } from "next/navigation";
import { type Metadata } from "next";
import { getStaticPage } from "@/lib/mdx";
import { MdxLayout } from "@/components/mdx/mdx-layout";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How we collect and use your data.",
};

export default async function PrivacyPage() {
  const page = await getStaticPage("privacy-policy");

  if (!page) notFound();

  return (
    <MdxLayout
      frontmatter={page.frontmatter}
      variant="page"
      showToc={false}
    >
      {page.content}
    </MdxLayout>
  );
}
