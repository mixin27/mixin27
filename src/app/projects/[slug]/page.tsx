import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Globe,
  Calendar,
  Users,
  Clock,
} from 'lucide-react'
import {
  getProjectBySlug,
  getCompiledProject,
  getSortedProjects,
  getRelatedProjects,
} from '@/lib/projects'
import { formatDate, generateMetadata as genMeta } from '@/lib/utils'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

// Generate static params for all projects
export async function generateStaticParams() {
  const projects = await getSortedProjects()
  return projects.map((project) => ({
    slug: project.slug,
  }))
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const slug = (await params).slug
  const project = await getProjectBySlug(slug)

  if (!project) {
    return {
      title: 'Project Not Found',
    }
  }

  return genMeta({
    title: project.title,
    description: project.description,
    url: `/projects/${slug}`,
    image: project.image,
  })
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const slug = (await params).slug
  const projectData = await getCompiledProject(slug)

  if (!projectData) {
    notFound()
  }

  const relatedProjects = await getRelatedProjects(slug, 3)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container py-4">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-4" />
            Back to Projects
          </Link>
        </div>
      </header>

      <article className="container py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8">
            {/* Project Header */}
            <div className="mb-8">
              {/* Category Badge */}
              <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4 capitalize">
                {projectData.category}
              </span>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                {projectData.title}
              </h1>

              {/* Description */}
              <p className="text-xl text-muted-foreground">
                {projectData.description}
              </p>
            </div>

            {/* Project Image */}
            <div className="aspect-video rounded-lg overflow-hidden mb-8 bg-muted">
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <div className="text-6xl font-bold text-primary/10">
                  {/* {projectData.title.charAt(0)} */}
                  <Image
                    src={projectData.image}
                    alt={`${projectData.title} Logo`}
                    width={320}
                    height={320}
                  />
                </div>
              </div>
            </div>

            {/* Project Content */}
            {projectData.content && (
              <div className="prose prose-slate dark:prose-invert max-w-none mb-12">
                {projectData.content}
              </div>
            )}

            {/* Highlights */}
            {projectData.highlights && projectData.highlights.length > 0 && (
              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Key Highlights</h2>
                <ul className="space-y-2">
                  {projectData.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="size-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Challenges */}
            {projectData.challenges && projectData.challenges.length > 0 && (
              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">
                  Challenges & Solutions
                </h2>
                <div className="space-y-4">
                  {projectData.challenges.map((challenge, index) => (
                    <div key={index} className="rounded-lg border bg-card p-4">
                      <p className="text-sm">{challenge}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Learnings */}
            {projectData.learnings && projectData.learnings.length > 0 && (
              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">What I Learned</h2>
                <ul className="space-y-2">
                  {projectData.learnings.map((learning, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="size-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      <span>{learning}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              {/* Project Info */}
              <div className="rounded-lg border bg-card p-6">
                <h3 className="font-semibold mb-4">Project Details</h3>
                <div className="space-y-4">
                  {/* Platform */}
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Platform
                    </p>
                    <p className="font-medium">{projectData.platform}</p>
                  </div>

                  {/* Status */}
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Status</p>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                        projectData.status === 'completed'
                          ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                          : projectData.status === 'in-progress'
                            ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
                            : 'bg-gray-500/10 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      <span className="size-1.5 rounded-full bg-current" />
                      {projectData.status.charAt(0).toUpperCase() +
                        projectData.status.slice(1).replace('-', ' ')}
                    </span>
                  </div>

                  {/* Date */}
                  <div className="flex items-start gap-3">
                    <Calendar className="size-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Completed</p>
                      <p className="font-medium">
                        {formatDate(projectData.date)}
                      </p>
                    </div>
                  </div>

                  {/* Duration */}
                  {projectData.duration && (
                    <div className="flex items-start gap-3">
                      <Clock className="size-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Duration
                        </p>
                        <p className="font-medium">{projectData.duration}</p>
                      </div>
                    </div>
                  )}

                  {/* Team Size */}
                  {projectData.teamSize && (
                    <div className="flex items-start gap-3">
                      <Users className="size-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Team Size
                        </p>
                        <p className="font-medium">
                          {projectData.teamSize} members
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Role */}
                  {projectData.role && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        My Role
                      </p>
                      <p className="font-medium">{projectData.role}</p>
                    </div>
                  )}

                  {/* Client */}
                  {projectData.client && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Client
                      </p>
                      <p className="font-medium">{projectData.client}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Technologies */}
              {projectData.technologies.length > 0 && (
                <div className="rounded-lg border bg-card p-6">
                  <h3 className="font-semibold mb-4">Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    {projectData.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {projectData.tags.length > 0 && (
                <div className="rounded-lg border bg-card p-6">
                  <h3 className="font-semibold mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {projectData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Links */}
              {projectData.links &&
                Object.keys(projectData.links).length > 0 && (
                  <div className="rounded-lg border bg-card p-6">
                    <h3 className="font-semibold mb-4">Project Links</h3>
                    <div className="space-y-2">
                      {projectData.links && projectData.links.github && (
                        <a
                          href={projectData.links.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                        >
                          <Github className="size-4" />
                          View on GitHub
                          <ExternalLink className="size-3 ml-auto" />
                        </a>
                      )}
                      {projectData.links && projectData.links.demo && (
                        <a
                          href={projectData.links.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                        >
                          <Globe className="size-4" />
                          Live Demo
                          <ExternalLink className="size-3 ml-auto" />
                        </a>
                      )}
                      {projectData.links && projectData.links.playStore && (
                        <a
                          href={projectData.links.playStore}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                        >
                          <ExternalLink className="size-4" />
                          Google Play Store
                        </a>
                      )}
                      {projectData.links && projectData.links.appStore && (
                        <a
                          href={projectData.links.appStore}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                        >
                          <ExternalLink className="size-4" />
                          Apple App Store
                        </a>
                      )}
                      {projectData.links && projectData.links.website && (
                        <a
                          href={projectData.links.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                        >
                          <Globe className="size-4" />
                          Visit Website
                          <ExternalLink className="size-3 ml-auto" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
            </div>
          </aside>
        </div>

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold mb-8">Related Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProjects.map((project) => (
                <Link
                  key={project.slug}
                  href={`/projects/${project.slug}`}
                  className="group rounded-lg border bg-card overflow-hidden hover:shadow-lg transition-all"
                >
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <div className="text-4xl font-bold text-primary/10">
                      {/* {project.title.charAt(0)} */}
                      <Image
                        src={project.image}
                        alt={`${project.title} Logo`}
                        fill
                      />
                    </div>
                  </div>
                  <div className="p-4">
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary mb-2 capitalize">
                      {project.category}
                    </span>
                    <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {project.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  )
}
