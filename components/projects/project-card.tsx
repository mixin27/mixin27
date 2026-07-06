import Link from "next/link"
import { GithubIcon, ExternalLinkIcon } from "@/components/ui/social-icons"
import { getCategoryColor, getCategoryLabel } from "@/lib/utils"
import type { Project } from "@/types"

interface ProjectCardProps {
  project: Project
  index?: number
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <article className="app-glass-card group relative flex flex-col rounded-2xl p-7">
      {/* Featured badge */}
      {project.featured && (
        <span className="absolute top-5 right-5 rounded-md bg-(--app-accent-primary) px-2 py-0.5 font-mono text-[9px] tracking-widest text-white uppercase">
          Featured
        </span>
      )}

      {/* Number */}
      {index !== undefined && (
        <span className="mb-3 font-mono text-[11px] tracking-widest text-muted-foreground/80">
          {String(index + 1).padStart(2, "0")}
        </span>
      )}

      {/* Category */}
      <span
        className={`mb-3 self-start rounded-md border px-2 py-0.5 font-mono text-[10px] tracking-widest uppercase ${getCategoryColor(project.category)}`}
      >
        {getCategoryLabel(project.category)}
      </span>

      {/* Title */}
      <h3 className="mb-2 font-heading text-xl leading-snug font-bold text-foreground transition-colors group-hover:text-(--app-accent-secondary)">
        {project.name}
      </h3>

      {/* Description */}
      <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground">
        {project.shortDesc}
      </p>

      {/* Tags */}
      <div className="mb-5 flex flex-wrap gap-1.5">
        {project.tags.map((tag, index) => (
          <span
            key={`${project.slug}-${tag}-${index}`}
            className="app-tag rounded-md px-2 py-0.5 font-mono text-[10px] tracking-wide uppercase"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Links */}
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href={`/projects/${project.slug}`}
          className="font-mono text-[12px] tracking-wide text-purple-400 uppercase transition-colors hover:text-purple-300"
        >
          View Details →
        </Link>

        {project.links.github && (
          <a
            href={project.links.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${project.name} on GitHub`}
            className="text-muted-foreground/80 transition-colors hover:text-foreground"
          >
            <GithubIcon className="size-4" />
          </a>
        )}

        {project.links.pubDev && (
          <a
            href={project.links.pubDev}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${project.name} on pub.dev`}
            className="flex items-center gap-1 font-mono text-[11px] text-muted-foreground/80 transition-colors hover:text-foreground"
          >
            pub.dev
            <ExternalLinkIcon className="size-3" />
          </a>
        )}

        {project.links.playStore && (
          <a
            href={project.links.playStore}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${project.name} on Play Store`}
            className="flex items-center gap-1 font-mono text-[11px] text-muted-foreground/80 transition-colors hover:text-foreground"
          >
            Play Store
            <ExternalLinkIcon className="size-3" />
          </a>
        )}

        {project.links.releases && (
          <a
            href={project.links.releases}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Latest release of ${project.name}`}
            className="flex items-center gap-1 font-mono text-[11px] text-muted-foreground/80 transition-colors hover:text-foreground"
          >
            Releases
            <ExternalLinkIcon className="size-3" />
          </a>
        )}
      </div>
    </article>
  )
}
