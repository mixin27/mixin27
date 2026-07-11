import type { Metadata } from "next"
import { SectionLabel } from "@/components/ui/section-label"
import Link from "next/link"
import { getAllContent } from "@/lib/mdx"

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Thoughts on Flutter, mobile architecture, clean code, and developer experience.",
}

export default async function BlogPage() {
  const posts = await getAllContent("blog")
  const published = posts.filter((p) => !p.frontmatter.draft)
  return (
    <>
      {/* Header */}
      <div className="relative border-b border-border/70 pt-32 pb-20">
        <div
          className="pointer-events-none absolute -top-10 right-0 size-[500px] rounded-full bg-purple-500/8 blur-[120px]"
          aria-hidden="true"
        />
        <div className="mx-auto max-w-7xl px-6">
          <SectionLabel className="mb-4">Writing</SectionLabel>
          <h1 className="mb-4 text-5xl font-bold tracking-tight">The Blog</h1>
          <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
            Thoughts on Flutter, mobile architecture, clean code, and developer
            experience.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {published.map(({ slug, frontmatter, readingTime }) => (
            <article
              key={slug}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card/60 shadow-sm transition-all hover:-translate-y-1 hover:border-purple-500/25 hover:bg-card"
            >
              {/* Cover gradient */}
              <div
                className={`relative flex h-44 items-center justify-center bg-linear-to-br from-purple-400 to-indigo-700`}
              >
                <svg
                  className="opacity-20"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <Link href={`/blog/${slug}`}>
                  <h2 className="mb-3 flex-1 leading-snug font-semibold text-foreground transition-colors group-hover:text-purple-600">
                    {frontmatter.title}
                  </h2>
                </Link>
                <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                  {frontmatter.description}
                </p>
                <div className="flex items-center gap-3 font-mono text-[10px] text-muted-foreground/80">
                  {frontmatter.date && (
                    <time dateTime={frontmatter.date}>
                      {new Intl.DateTimeFormat("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }).format(new Date(frontmatter.date))}
                    </time>
                  )}
                  <span>·</span>
                  <span>{readingTime.text}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Coming soon note */}
        <div className="mt-16 rounded-2xl border border-dashed border-border p-10 text-center">
          <p className="font-mono text-sm text-muted-foreground/80">
            More articles coming soon. Follow on{" "}
            <a
              href="https://twitter.com/kyawzayartun98"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 transition-colors hover:text-purple-300"
            >
              Twitter
            </a>{" "}
            for updates.
          </p>
        </div>
      </div>
    </>
  )
}
