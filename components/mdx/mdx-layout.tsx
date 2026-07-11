import { type ReactNode } from "react"
import Image from "next/image"
import { TableOfContents } from "./toc"
import type { Frontmatter } from "@/types/mdx"
import { cn } from "@/lib/utils"

interface MdxLayoutProps {
  frontmatter: Frontmatter
  readingTime?: { text: string }
  children: ReactNode
  showToc?: boolean
  variant?: "blog" | "project" | "page"
  className?: string
}

/**
 * MdxLayout — the outer shell for all MDX pages.
 * Handles the header (title, meta), sidebar TOC, and prose container.
 */
export function MdxLayout({
  frontmatter,
  readingTime,
  children,
  showToc = true,
  variant = "blog",
  className,
}: MdxLayoutProps) {
  const {
    title,
    description,
    date,
    author,
    tags,
    tech,
    github,
    live,
    status,
    lastReviewed,
    image,
  } = frontmatter

  const formattedDate = date
    ? new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(date))
    : null

  return (
    <div
      className={cn(
        "mx-auto max-w-7xl px-4 py-12 pt-32 sm:px-6 lg:px-8",
        className
      )}
    >
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_220px]">
        {/* Main content */}
        <main className="min-w-0">
          {/* Article header */}
          <header className="mb-10">
            {/* Tags / tech chips */}
            {(tags ?? tech)?.length && (
              <div className="mb-6 flex flex-wrap gap-2">
                {(tags ?? tech)!.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
              {variant === "project" && image && (
                <div className="flex size-20 shrink-0 items-center justify-center rounded-2xl border border-border/80 bg-muted/30 p-2.5 backdrop-blur-xs">
                  <Image
                    src={image}
                    alt={`${title} logo`}
                    width={80}
                    height={80}
                    className="size-full object-contain"
                  />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                  {title}
                </h1>
                {description && (
                  <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                )}
              </div>
            </div>

            {/* Meta row */}
            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
              {formattedDate && <time dateTime={date}>{formattedDate}</time>}
              {readingTime && (
                <>
                  <span aria-hidden>·</span>
                  <span>{readingTime.text}</span>
                </>
              )}
              {author && (
                <>
                  <span aria-hidden>·</span>
                  <span>{author}</span>
                </>
              )}
              {lastReviewed && (
                <>
                  <span aria-hidden>·</span>
                  <span>Last reviewed: {lastReviewed}</span>
                </>
              )}
            </div>

            {/* Project-specific links */}
            {variant === "project" && (github || live) && (
              <div className="mt-5 flex flex-wrap gap-3">
                {github && (
                  <a
                    href={github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-border bg-muted px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted/80"
                  >
                    GitHub ↗
                  </a>
                )}
                {live && (
                  <a
                    href={live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    Live site ↗
                  </a>
                )}
                {status && <StatusBadge status={status} />}
              </div>
            )}

            <div className="mt-8 border-b border-border" />
          </header>

          {/* MDX prose */}
          <article className="mdx-content prose-mdx">{children}</article>
        </main>

        {/* Sidebar TOC */}
        {showToc && (
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <TableOfContents />
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}

function StatusBadge({
  status,
}: {
  status: NonNullable<Frontmatter["status"]>
}) {
  const map = {
    completed:
      "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400",
    "in-progress":
      "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
    archived: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  }
  const label = {
    completed: "Completed",
    "in-progress": "In progress",
    archived: "Archived",
  }

  return (
    <span
      className={cn(
        "flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
        map[status]
      )}
    >
      {label[status]}
    </span>
  )
}
