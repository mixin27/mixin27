"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface TocItem {
  id: string
  text: string
  level: number
}

interface TocProps {
  /** Pass the compiled MDX content's container ref to auto-extract headings */
  containerSelector?: string
  /** Or pass items directly */
  items?: TocItem[]
  className?: string
}

/**
 * TableOfContents — auto-extracts headings from the rendered MDX content
 * and highlights the active section on scroll.
 */
export function TableOfContents({
  containerSelector = ".mdx-content",
  items,
  className,
}: TocProps) {
  const [headings, setHeadings] = useState<TocItem[]>(items ?? [])
  const [activeId, setActiveId] = useState<string>("")

  // Extract headings from DOM if not provided
  useEffect(() => {
    if (items) return

    const container = document.querySelector(containerSelector)
    if (!container) return

    const els = container.querySelectorAll("h2, h3, h4")
    const parsed: TocItem[] = Array.from(els).map((el) => ({
      id: el.id,
      text: el.textContent?.replace(/#$/, "").trim() ?? "",
      level: parseInt(el.tagName[1]),
    }))

    setHeadings(parsed)
  }, [containerSelector, items])

  // Intersection observer for active heading
  useEffect(() => {
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
            break
          }
        }
      },
      { rootMargin: "-80px 0% -60% 0%", threshold: 0 }
    )

    headings.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) return null

  return (
    <nav aria-label="Table of contents" className={cn("text-sm", className)}>
      <p className="mb-3 text-xs font-semibold tracking-wider text-foreground uppercase">
        On this page
      </p>
      <ul className="space-y-1">
        {headings.map(({ id, text, level }) => (
          <li key={id} style={{ paddingLeft: `${(level - 2) * 12}px` }}>
            <a
              href={`#${id}`}
              className={cn(
                "block truncate rounded py-0.5 text-muted-foreground transition-colors hover:text-foreground",
                activeId === id && "font-medium text-primary"
              )}
              onClick={(e) => {
                e.preventDefault()
                document
                  .getElementById(id)
                  ?.scrollIntoView({ behavior: "smooth" })
              }}
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
