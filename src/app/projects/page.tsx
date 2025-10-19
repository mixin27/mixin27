import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ExternalLink, Github, Smartphone, Globe } from 'lucide-react'
import { generateMetadata as genMeta } from '@/lib/utils'
import {
  getSortedProjects,
  getFeaturedProjects,
  getProjectStats,
} from '@/lib/projects'

export const metadata: Metadata = genMeta({
  title: 'Projects',
  description: 'Explore my portfolio of mobile and web applications.',
  url: '/projects',
})

export default async function ProjectsPage() {
  const allProjects = await getSortedProjects()
  const featuredProjects = await getFeaturedProjects()
  const stats = await getProjectStats()

  const otherProjects = allProjects.filter((p) => !p.featured)

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="border-b bg-gradient-to-b from-background to-muted/20">
        <div className="container py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              My Projects
            </h1>
            <p className="text-xl text-muted-foreground">
              A collection of mobile and web applications I've built, showcasing
              my skills in creating user-friendly and innovative solutions.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            <div className="rounded-lg border bg-card p-4">
              <p className="text-3xl font-bold">{allProjects.length}</p>
              <p className="text-sm text-muted-foreground">Total Projects</p>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <p className="text-3xl font-bold">{featuredProjects.length}</p>
              <p className="text-sm text-muted-foreground">Featured</p>
            </div>
            {/* <div className="rounded-lg border bg-card p-4">
              <p className="text-3xl font-bold">10K+</p>
              <p className="text-sm text-muted-foreground">Downloads</p>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <p className="text-3xl font-bold">4.2</p>
              <p className="text-sm text-muted-foreground">Avg Rating</p>
            </div> */}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <section className="container py-16">
          <h2 className="text-3xl font-bold mb-8">Featured Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project) => (
              <article
                key={project.slug}
                className="group rounded-lg border bg-card overflow-hidden hover:shadow-lg transition-all"
              >
                {/* Project Image */}
                <div className="aspect-video bg-muted relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    {!project.image && (
                      <Smartphone className="size-16 text-primary/40" />
                    )}
                    {project.image && (
                      <Image
                        src={project.image}
                        alt={`${project.title} Logo`}
                        objectFit="cover"
                        fill
                      />
                    )}
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2 py-1 text-xs font-medium text-primary-300">
                      Featured
                    </span>
                  </div>
                </div>

                {/* Project Content */}
                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                    <span className="inline-flex items-center gap-1">
                      <Smartphone className="size-3" />
                      {project.platform}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full bg-muted px-2 py-1 text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="flex items-center gap-3 pt-4 border-t">
                    {project.links && project.links.github && (
                      <a
                        href={project.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="GitHub"
                      >
                        <Github className="size-4" />
                      </a>
                    )}
                    {project.links && project.links.website && (
                      <a
                        href={project.links.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Website"
                      >
                        <Globe className="size-4" />
                      </a>
                    )}
                    <Link
                      href={`/projects/${project.slug}`}
                      className="ml-auto inline-flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      View Details
                      <ExternalLink className="size-3" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Other Projects */}
      {otherProjects.length > 0 && (
        <section className="border-t bg-muted/20">
          <div className="container py-16">
            <h2 className="text-3xl font-bold mb-8">More Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherProjects.map((project) => (
                <article
                  key={project.slug}
                  className="group rounded-lg border bg-card overflow-hidden hover:shadow-lg transition-all"
                >
                  {/* Project Image */}
                  <div className="aspect-video bg-muted relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      {!project.image && (
                        <Smartphone className="size-16 text-primary/40" />
                      )}
                      {project.image && (
                        <Image
                          src={project.image}
                          alt={`${project.title} Logo`}
                          objectFit="cover"
                          fill
                        />
                      )}
                    </div>
                  </div>

                  {/* Project Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                      <span className="inline-flex items-center gap-1">
                        <Smartphone className="size-3" />
                        {project.platform}
                      </span>
                    </div>

                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>

                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center rounded-full bg-muted px-2 py-1 text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Links */}
                    <div className="flex items-center gap-3 pt-4 border-t">
                      {project.links && project.links.github && (
                        <a
                          href={project.links.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground transition-colors"
                          aria-label="GitHub"
                        >
                          <Github className="size-4" />
                        </a>
                      )}
                      {project.links && project.links.website && (
                        <a
                          href={project.links.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground transition-colors"
                          aria-label="Website"
                        >
                          <Globe className="size-4" />
                        </a>
                      )}
                      <Link
                        href={`/projects/${project.slug}`}
                        className="ml-auto inline-flex items-center gap-1 text-sm text-primary hover:underline"
                      >
                        View Details
                        <ExternalLink className="size-3" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="border-t">
        <div className="container py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Interested in Working Together?
            </h2>
            <p className="text-muted-foreground mb-8">
              I'm always open to discussing new projects, creative ideas, or
              opportunities to be part of your vision.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Get In Touch
              <ExternalLink className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
