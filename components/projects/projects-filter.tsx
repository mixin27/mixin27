"use client"

import { useEffect, useMemo, useState } from "react"
import { Search, X } from "lucide-react"
import { projects } from "@/data/projects"
import { ProjectCard } from "./project-card"
import { cn, getCategoryLabel } from "@/lib/utils"
import type { Project, ProjectCategory } from "@/types"

type Availability = "open-source" | "store" | "live" | "package"
type Sort = "featured" | "name"

const AVAILABILITY: { value: Availability; label: string; test: (p: Project) => boolean }[] = [
  { value: "open-source", label: "Open source", test: (p) => Boolean(p.links.github) },
  { value: "store", label: "On app stores", test: (p) => Boolean(p.links.playStore || p.links.appStore) },
  { value: "live", label: "Live site", test: (p) => Boolean(p.links.live || p.links.demo) },
  { value: "package", label: "Package", test: (p) => Boolean(p.links.pubDev) },
]

/** Categories in use, most projects first, so new categories appear without code changes. */
const CATEGORIES = (() => {
  const counts = new Map<ProjectCategory, number>()
  for (const p of projects) counts.set(p.category, (counts.get(p.category) ?? 0) + 1)
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || getCategoryLabel(a[0]).localeCompare(getCategoryLabel(b[0])))
    .map(([value, count]) => ({ value, count }))
})()

const normalize = (s: string) => s.toLowerCase().replace(/[-_]/g, " ")

function matchesQuery(p: Project, query: string) {
  if (!query) return true
  const haystack = normalize([p.name, p.shortDesc, p.fullDesc, getCategoryLabel(p.category), ...p.tags].join(" "))
  return normalize(query)
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => haystack.includes(word))
}

interface FilterState {
  category: ProjectCategory | "all"
  availability: Availability | "all"
  featured: boolean
  query: string
  sort: Sort
}

const DEFAULTS: FilterState = { category: "all", availability: "all", featured: false, query: "", sort: "featured" }

/** Read filters from the URL so a filtered view can be shared or bookmarked. */
function readUrl(): FilterState {
  const params = new URLSearchParams(window.location.search)
  const category = params.get("category")
  const availability = params.get("has")
  return {
    category: CATEGORIES.some((c) => c.value === category) ? (category as ProjectCategory) : "all",
    availability: AVAILABILITY.some((a) => a.value === availability) ? (availability as Availability) : "all",
    featured: params.get("featured") === "1",
    query: params.get("q") ?? "",
    sort: params.get("sort") === "name" ? "name" : "featured",
  }
}

function writeUrl(state: FilterState) {
  const params = new URLSearchParams()
  if (state.category !== "all") params.set("category", state.category)
  if (state.availability !== "all") params.set("has", state.availability)
  if (state.featured) params.set("featured", "1")
  if (state.query.trim()) params.set("q", state.query.trim())
  if (state.sort !== "featured") params.set("sort", state.sort)
  const search = params.toString()
  window.history.replaceState(null, "", `${window.location.pathname}${search ? `?${search}` : ""}`)
}

const chipClass = (active: boolean) =>
  cn(
    "rounded-lg border px-3.5 py-2 font-mono text-[11px] tracking-widest uppercase transition-all",
    active
      ? "border-purple-500 bg-purple-500 text-white"
      : "border-border text-muted-foreground hover:border-foreground/15 hover:text-foreground",
  )

export function ProjectsFilter() {
  const [state, setState] = useState<FilterState>(DEFAULTS)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setState(readUrl())
    setReady(true)
  }, [])

  useEffect(() => {
    if (ready) writeUrl(state)
  }, [state, ready])

  const update = (patch: Partial<FilterState>) => setState((s) => ({ ...s, ...patch }))

  // Everything except the category, so category counts reflect the other filters.
  const baseMatches = useMemo(() => {
    const avail = AVAILABILITY.find((a) => a.value === state.availability)
    return projects.filter(
      (p) => (!state.featured || p.featured) && (!avail || avail.test(p)) && matchesQuery(p, state.query),
    )
  }, [state.featured, state.availability, state.query])

  const filtered = useMemo(() => {
    const list = baseMatches.filter((p) => state.category === "all" || p.category === state.category)
    if (state.sort === "name") return [...list].sort((a, b) => a.name.localeCompare(b.name))
    // Featured first, otherwise keep the curated order from data/projects.ts.
    return [...list].sort((a, b) => Number(b.featured) - Number(a.featured))
  }, [baseMatches, state.category, state.sort])

  const categoryCount = (c: ProjectCategory) => baseMatches.filter((p) => p.category === c).length
  const isFiltered =
    state.category !== "all" || state.availability !== "all" || state.featured || state.query.trim() !== ""

  return (
    <div>
      <div className="mb-10 space-y-4">
        {/* Search, availability and sort */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="relative flex-1">
            <span className="sr-only">Search projects</span>
            <Search
              className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              type="search"
              value={state.query}
              onChange={(e) => update({ query: e.target.value })}
              placeholder="Search by name, tech or tag…"
              className="w-full rounded-xl border border-border bg-background/60 py-2.5 pr-3 pl-10 text-sm outline-none placeholder:text-muted-foreground/70 focus:border-purple-500/60"
            />
          </label>
          <div className="flex gap-3">
            <label className="flex-1 sm:flex-none">
              <span className="sr-only">Availability</span>
              <select
                value={state.availability}
                onChange={(e) => update({ availability: e.target.value as FilterState["availability"] })}
                className="w-full rounded-xl border border-border bg-background/60 px-3 py-2.5 text-sm outline-none focus:border-purple-500/60"
              >
                <option value="all">Any availability</option>
                {AVAILABILITY.map((a) => (
                  <option key={a.value} value={a.value}>
                    {a.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex-1 sm:flex-none">
              <span className="sr-only">Sort</span>
              <select
                value={state.sort}
                onChange={(e) => update({ sort: e.target.value as Sort })}
                className="w-full rounded-xl border border-border bg-background/60 px-3 py-2.5 text-sm outline-none focus:border-purple-500/60"
              >
                <option value="featured">Featured first</option>
                <option value="name">Name A–Z</option>
              </select>
            </label>
          </div>
        </div>

        {/* Category chips; scroll sideways on small screens instead of wrapping into many rows */}
        <div
          className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
          role="group"
          aria-label="Filter by technology"
        >
          <button
            type="button"
            onClick={() => update({ category: "all" })}
            className={cn(chipClass(state.category === "all"), "shrink-0")}
            aria-pressed={state.category === "all"}
          >
            All <span className="ml-1 opacity-60">{baseMatches.length}</span>
          </button>
          {CATEGORIES.map(({ value }) => {
            const count = categoryCount(value)
            return (
              <button
                key={value}
                type="button"
                onClick={() => update({ category: value })}
                disabled={count === 0 && state.category !== value}
                className={cn(chipClass(state.category === value), "shrink-0 disabled:opacity-40")}
                aria-pressed={state.category === value}
              >
                {getCategoryLabel(value)} <span className="ml-1 opacity-60">{count}</span>
              </button>
            )
          })}
          <button
            type="button"
            onClick={() => update({ featured: !state.featured })}
            className={cn(chipClass(state.featured), "shrink-0")}
            aria-pressed={state.featured}
          >
            ★ Featured
          </button>
        </div>

        {/* Result summary */}
        <div className="flex items-center justify-between gap-3 font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
          <p aria-live="polite">
            Showing {filtered.length} of {projects.length} projects
          </p>
          {isFiltered && (
            <button
              type="button"
              onClick={() => setState({ ...DEFAULTS, sort: state.sort })}
              className="inline-flex items-center gap-1 text-purple-400 hover:text-purple-300"
            >
              <X className="size-3.5" aria-hidden="true" />
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-24 text-center font-mono text-sm text-muted-foreground/80">
          No projects match these filters.{" "}
          <button
            type="button"
            onClick={() => setState(DEFAULTS)}
            className="text-purple-400 underline-offset-4 hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  )
}
