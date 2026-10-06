import { notFound, redirect } from "next/navigation"
import { type Metadata } from "next"
import { getAllContent, getContentBySlug } from "@/lib/mdx"
import { MdxLayout } from "@/components/mdx/mdx-layout"
import { projects } from "@/data/projects"

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

  if (slug === "mynmar-calendar") {
    redirect("/projects/myanmar-calendar")
  }

  const project = await getContentBySlug("projects", slug)

  if (!project) notFound()

  // The typed project catalogue owns outbound links. This keeps the card and
  // MDX detail page in sync while MDX remains the source for long-form content.
  const catalogueProject = projects.find((item) => item.slug === slug)
  const frontmatter = catalogueProject
    ? {
        ...project.frontmatter,
        image: catalogueProject.image ?? project.frontmatter.image,
        github: catalogueProject.links.github,
        live: catalogueProject.links.live ?? catalogueProject.links.demo,
        playStore: catalogueProject.links.playStore,
        appStore: catalogueProject.links.appStore,
        pubDev: catalogueProject.links.pubDev,
        demo: catalogueProject.links.demo,
        releases: catalogueProject.links.releases,
      }
    : project.frontmatter

  return (
    <MdxLayout
      frontmatter={frontmatter}
      readingTime={project.readingTime}
      variant="project"
      showToc
    >
      {project.content}
    </MdxLayout>
  )
}
