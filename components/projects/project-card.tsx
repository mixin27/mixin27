import Link from "next/link"
import Image from "next/image"
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
      {/* Top Header Row with Logo & Featured/Number */}
      <div className="mb-5 flex items-start justify-between">
        {project.image ? (
          <div className="flex size-12 items-center justify-center rounded-xl border border-border/80 bg-muted/30 p-1.5 backdrop-blur-xs transition-colors group-hover:border-purple-500/30 group-hover:bg-purple-500/5">
            <Image
              src={project.image}
              alt={`${project.name} logo`}
              width={48}
              height={48}
              className="size-full object-contain"
            />
          </div>
        ) : (
          <div className="flex size-12 items-center justify-center rounded-xl border border-border/80 bg-muted/30 p-1.5 backdrop-blur-xs">
            <span className="font-mono text-xs font-bold text-muted-foreground uppercase">
              {project.category.substring(0, 2)}
            </span>
          </div>
        )}

        <div className="flex items-center gap-2">
          {project.featured && (
            <span className="rounded-md bg-purple-500/20 px-2 py-0.5 font-mono text-[9px] tracking-widest text-purple-300 uppercase">
              Featured
            </span>
          )}
          {index !== undefined && (
            <span className="font-mono text-[11px] tracking-widest text-muted-foreground/80">
              {String(index + 1).padStart(2, "0")}
            </span>
          )}
        </div>
      </div>

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
