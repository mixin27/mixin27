import { MdxLayout } from "@/components/mdx/mdx-layout"
import { getAllContent, getContentBySlug } from "@/lib/mdx"
import { Metadata } from "next"
import { notFound } from "next/navigation"

interface Props {
  params: Promise<{ slug: string }>
}

// Generate static params for all apps
export async function generateStaticParams() {
  const apps = await getAllContent("apps")
  return apps.map(({ slug }) => ({ slug }))
}

// Generate per-page metadata from frontmatter
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const app = await getContentBySlug("apps", slug)
  if (!app) return {}

  const { title, updatedAt } = app.frontmatter

  return {
    title,
    description: title,
    openGraph: {
      title,
      description: title,
      type: "article",
      publishedTime: updatedAt,
    },
    twitter: { card: "summary_large_image", title, description: title },
  }
}

export default async function PrivacyPolicyPage({ params }: Props) {
  const { slug } = await params
  const app = await getContentBySlug("apps", slug)

  if (!app || app.frontmatter.draft) {
    notFound()
  }

  return (
    <MdxLayout
      frontmatter={app.frontmatter}
      readingTime={app.readingTime}
      variant="blog"
      showToc
    >
      {app.content}
    </MdxLayout>
  )
}
