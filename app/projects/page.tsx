import type { Metadata } from "next"
import { projects } from "@/data/projects"
import { ProjectsFilter } from "@/components/projects/projects-filter"
import { SectionLabel } from "@/components/ui/section-label"

export const metadata: Metadata = {
  title: "Projects",
  description: "Explore my portfolio of mobile and web applications.",
}

const stats = [
  { value: projects.length.toString(), label: "Total Projects" },
  {
    value: projects.filter((p) => p.featured).length.toString(),
    label: "Featured",
  },
]

export default function ProjectsPage() {
  return (
    <>
      {/* Header */}
      <div className="relative border-b border-border/70 pt-32 pb-20">
        <div
          className="pointer-events-none absolute -top-10 right-0 size-[500px] rounded-full bg-purple-500/8 blur-[120px]"
          aria-hidden="true"
        />
        <div className="mx-auto max-w-7xl px-6">
          <SectionLabel className="mb-4">Portfolio</SectionLabel>
          <h1 className="mb-4 text-5xl font-bold tracking-tight">
            My Projects
          </h1>
          <p className="mb-10 max-w-xl text-lg leading-relaxed text-muted-foreground">
            A collection of mobile and web applications I&apos;ve built,
            showcasing my skills in creating user-friendly and innovative
            solutions.
          </p>

          {/* Stats */}
          <div className="flex items-center gap-8">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="bg-linear-to-br from-purple-400 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">
                  {value}
                </p>
                <p className="mt-1 font-mono text-[11px] tracking-widest text-muted-foreground/80 uppercase">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Projects grid with filter */}
      <div className="mx-auto max-w-7xl px-6 py-16">
        <ProjectsFilter />
      </div>

      {/* CTA */}
      <section className="border-t border-border/70 py-20">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="mb-3 text-2xl font-bold">
            Interested in Working Together?
          </h2>
          <p className="mb-8 text-muted-foreground">
            I&apos;m always open to discussing new projects, creative ideas, or
            opportunities to be part of your vision.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 rounded-xl bg-purple-500 px-7 py-3.5 font-semibold text-white transition-colors hover:bg-purple-400"
          >
            Get In Touch
          </a>
        </div>
      </section>
    </>
  )
}
