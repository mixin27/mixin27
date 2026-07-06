import { notFound } from "next/navigation";
import { type Metadata } from "next";
import { getAllContent, getContentBySlug } from "@/lib/mdx";
import { MdxLayout } from "@/components/mdx/mdx-layout";

interface Props {
  params: Promise<{ slug: string }>;
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  const posts = await getAllContent("blog");
  return posts.map(({ slug }) => ({ slug }));
}

// Generate per-page metadata from frontmatter
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getContentBySlug("blog", slug);
  if (!post) return {};

  const { title, description, image, date } = post.frontmatter;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: date,
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getContentBySlug("blog", slug);

  if (!post || post.frontmatter.draft) {
    notFound();
  }

  return (
    <MdxLayout
      frontmatter={post.frontmatter}
      readingTime={post.readingTime}
      variant="blog"
      showToc
    >
      {post.content}
    </MdxLayout>
  );
}
