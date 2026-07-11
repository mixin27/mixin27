"use client"

import {
  isValidElement,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"

interface MermaidProps {
  chart?: string
  caption?: string
  children?: ReactNode
}

function cssVar(name: string, fallback: string) {
  if (typeof window === "undefined") return fallback

  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim()

  return value.length > 0 ? value : fallback
}

function isDarkMode() {
  if (typeof document === "undefined") return false
  return document.documentElement.classList.contains("dark")
}

function extractTextContent(node: ReactNode): string {
  if (node === null || node === undefined) {
    return ""
  }

  if (typeof node === "string" || typeof node === "number") {
    return String(node)
  }

  if (Array.isArray(node)) {
    const hasLineElements = node.some(
      (child) =>
        isValidElement(child) &&
        (((child as any).props.className === "line") ||
          ((child as any).props.className as string[])?.includes?.("line"))
    )

    if (hasLineElements) {
      return node.map(extractTextContent).join("\n")
    }
    return node.map(extractTextContent).join("")
  }

  if (isValidElement<{ children?: ReactNode; className?: string | string[] }>(node)) {
    const className = node.props.className
    const isLine =
      className === "line" ||
      (Array.isArray(className) && className.includes("line")) ||
      (typeof className === "string" && className.split(" ").includes("line"))

    const content = extractTextContent(node.props.children)
    return isLine ? content : content
  }

  return ""
}


function resolveChartSource({ chart, children }: MermaidProps) {
  const source =
    typeof chart === "string" ? chart : extractTextContent(children)

  return source.replace(/\u00a0/g, " ").trim()
}

/**
 * Mermaid — client-side Mermaid diagram renderer.
 * Uses the mermaid npm package for in-browser rendering.
 *
 * Install: npm install mermaid
 *
 * Usage in MDX:
 * <Mermaid>
 * ```mermaid
 * graph TD
 *   A[Start] --> B{Decision}
 *   B -->|Yes| C[End]
 *   B -->|No| D[Other]
 * ```
 * </Mermaid>
 */
export function Mermaid(props: MermaidProps) {
  const { chart, caption, children } = props
  const [svg, setSvg] = useState("")
  const [error, setError] = useState("")
  const [dark, setDark] = useState(false)

  const source = useMemo(
    () => resolveChartSource({ chart, children }),
    [chart, children]
  )

  useEffect(() => {
    setDark(isDarkMode())

    const observer = new MutationObserver(() => {
      setDark(isDarkMode())
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    let cancelled = false

    async function render() {
      if (!source) {
        setSvg("")
        setError("No Mermaid diagram source provided")
        return
      }

      try {
        const mermaid = (await import("mermaid")).default

        mermaid.initialize({
          startOnLoad: false,
          theme: "base",
          securityLevel: "loose",
          themeVariables: {
            background: "transparent",

            primaryColor: cssVar("--mermaid-primary", "#f8fafc"),
            primaryTextColor: cssVar("--mermaid-primary-foreground", "#0f172a"),
            primaryBorderColor: cssVar("--mermaid-border", "#cbd5e1"),

            lineColor: cssVar("--mermaid-muted-foreground", "#64748b"),

            secondaryColor: cssVar("--mermaid-muted", "#f1f5f9"),
            tertiaryColor: cssVar("--mermaid-accent", "#ffffff"),

            mainBkg: cssVar("--mermaid-card", "#ffffff"),
            nodeBorder: cssVar("--mermaid-border", "#cbd5e1"),
            clusterBkg: cssVar("--mermaid-muted", "#f8fafc"),
            clusterBorder: cssVar("--mermaid-border", "#cbd5e1"),

            titleColor: cssVar("--mermaid-foreground", "#0f172a"),
            edgeLabelBackground: cssVar("--mermaid-background", "#ffffff"),

            textColor: cssVar("--mermaid-foreground", "#0f172a"),
            nodeTextColor: cssVar("--mermaid-foreground", "#0f172a"),
            labelTextColor: cssVar("--mermaid-foreground", "#0f172a"),

            fontFamily: "inherit",
          },
        })

        const id = `mermaid-${dark ? "dark" : "light"}-${Math.random()
          .toString(36)
          .slice(2)}`

        const { svg: rendered } = await mermaid.render(id, source)

        if (!cancelled) {
          setSvg(rendered)
          setError("")
        }
      } catch (err) {
        if (!cancelled) {
          setSvg("")
          setError(
            err instanceof Error ? err.message : "Failed to render diagram"
          )
        }
      }
    }

    render()

    return () => {
      cancelled = true
    }
  }, [source, dark])

  if (error) {
    return (
      <div className="my-6 rounded-xl border border-red-200 bg-red-50/50 p-4 dark:border-red-900/50 dark:bg-red-950/20">
        <p className="text-sm font-semibold text-red-600 dark:text-red-400">
          Diagram error
        </p>
        <pre className="mt-1 text-xs text-red-500">{error}</pre>
      </div>
    )
  }

  return (
    <figure className="my-8 flex flex-col items-center">
      <div
        className="w-full overflow-x-auto rounded-xl border border-border bg-background p-6"
        dangerouslySetInnerHTML={{ __html: svg }}
        aria-label="Diagram"
      />
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
