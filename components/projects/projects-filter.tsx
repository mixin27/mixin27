"use client"

import { useState, useMemo } from "react"
import { projects } from "@/data/projects"
import { ProjectCard } from "./project-card"
import { cn } from "@/lib/utils"
import type { ProjectCategory } from "@/types"

type FilterOption = "all" | ProjectCategory | "featured"

const FILTERS: { label: string; value: FilterOption }[] = [
  { label: "All", value: "all" },
  { label: "Flutter", value: "flutter" },
  { label: "Dart", value: "dart" },
  { label: "Android", value: "android" },
  { label: "Web", value: "web" },
  { label: "Featured", value: "featured" },
]

export function ProjectsFilter() {
  const [active, setActive] = useState<FilterOption>("all")

  const filtered = useMemo(() => {
    if (active === "all") return projects
    if (active === "featured") return projects.filter((p) => p.featured)
    return projects.filter((p) => p.category === active)
  }, [active])

  return (
    <div>
      {/* Filter bar */}
      <div
        className="mb-10 flex flex-wrap gap-2"
        role="group"
        aria-label="Filter projects"
      >
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setActive(f.value)}
            className={cn(
              "rounded-lg border px-4 py-2 font-mono text-[11px] tracking-widest uppercase transition-all",
              active === f.value
                ? "border-purple-500 bg-purple-500 text-white"
                : "border-border text-muted-foreground hover:border-foreground/15 hover:text-foreground"
            )}
            aria-pressed={active === f.value}
          >
            {f.label}
            {f.value === "all" && (
              <span className="ml-1.5 opacity-60">({projects.length})</span>
            )}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-24 text-center font-mono text-sm text-muted-foreground/80">
          No projects found.
        </div>
      )}
    </div>
  )
}
