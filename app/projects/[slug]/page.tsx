import { notFound } from "next/navigation"
import { type Metadata } from "next"
import { getAllContent, getContentBySlug } from "@/lib/mdx"
import { MdxLayout } from "@/components/mdx/mdx-layout"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const projects = await getAllContent("projects")
  return projects.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = await getContentBySlug("projects", slug)
  if (!project) return {}
  const { title, description, image } = project.frontmatter
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      ...(image ? { images: [{ url: image }] } : {}),
    },
  }
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const project = await getContentBySlug("projects", slug)

  if (!project) notFound()

  return (
    <MdxLayout
      frontmatter={project.frontmatter}
      readingTime={project.readingTime}
      variant="project"
      showToc
    >
      {project.content}
    </MdxLayout>
  )
}
