/**
 * MDX component map — every HTML element rendered from MDX goes through these.
 * Mintlify-inspired: clean typography, beautiful code blocks, callout boxes.
 */
import type { MDXComponents } from "mdx/types"
import Image, { type ImageProps } from "next/image"
import Link from "next/link"
import { type ComponentPropsWithoutRef } from "react"

import { Callout } from "./callout"
import { CodeBlock } from "./code-block"
import { Mermaid } from "./mermaid"

type HeadingProps = ComponentPropsWithoutRef<"h1">
type ParagraphProps = ComponentPropsWithoutRef<"p">
type AnchorProps = ComponentPropsWithoutRef<"a">
type ImageMdxProps = ImageProps & { src: string; alt: string }

export const mdxComponents: MDXComponents = {
  // ─── Headings ───────────────────────────────────────────────────────────
  h1: ({ children, id, ...props }: HeadingProps) => (
    <h1
      id={id}
      className="group relative mt-2 scroll-mt-20 text-3xl font-bold tracking-tight text-foreground"
      {...props}
    >
      {children}
      {id && <HeadingAnchor id={id} />}
    </h1>
  ),
  h2: ({ children, id, ...props }: HeadingProps) => (
    <h2
      id={id}
      className="group relative mt-10 scroll-mt-20 border-b border-border pb-2 text-2xl font-semibold tracking-tight text-foreground"
      {...props}
    >
      {children}
      {id && <HeadingAnchor id={id} />}
    </h2>
  ),
  h3: ({ children, id, ...props }: HeadingProps) => (
    <h3
      id={id}
      className="group relative mt-8 scroll-mt-20 text-xl font-semibold text-foreground"
      {...props}
    >
      {children}
      {id && <HeadingAnchor id={id} />}
    </h3>
  ),
  h4: ({ children, id, ...props }: HeadingProps) => (
    <h4
      id={id}
      className="group relative mt-6 scroll-mt-20 text-lg font-semibold text-foreground"
      {...props}
    >
      {children}
      {id && <HeadingAnchor id={id} />}
    </h4>
  ),

  // ─── Body text ───────────────────────────────────────────────────────────
  p: ({ children, ...props }: ParagraphProps) => (
    <p className="leading-7 text-muted-foreground not-first:mt-5" {...props}>
      {children}
    </p>
  ),

  // ─── Links ───────────────────────────────────────────────────────────────
  a: ({ href, children, ...props }: AnchorProps) => {
    if (href?.startsWith("/") || href?.startsWith("#")) {
      return (
        <Link
          href={href}
          className="font-medium text-primary underline underline-offset-4 transition-colors hover:text-primary/80"
          {...props}
        >
          {children}
        </Link>
      )
    }
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-primary underline underline-offset-4 transition-colors hover:text-primary/80"
        {...props}
      >
        {children}
      </a>
    )
  },

  // ─── Lists ───────────────────────────────────────────────────────────────
  ul: ({ children, ...props }) => (
    <ul
      className="my-5 ml-6 list-disc space-y-1.5 text-muted-foreground"
      {...props}
    >
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol
      className="my-5 ml-6 list-decimal space-y-1.5 text-muted-foreground"
      {...props}
    >
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="leading-7" {...props}>
      {children}
    </li>
  ),

  // ─── Blockquote ──────────────────────────────────────────────────────────
  blockquote: ({ children, ...props }) => (
    <blockquote
      className="my-6 border-l-4 border-primary/40 pl-4 text-muted-foreground italic [&>p]:mt-0"
      {...props}
    >
      {children}
    </blockquote>
  ),

  // ─── Horizontal rule ─────────────────────────────────────────────────────
  hr: (props) => <hr className="my-8 border-border" {...props} />,

  // ─── Tables ──────────────────────────────────────────────────────────────
  table: ({ children, ...props }) => (
    <div className="my-6 w-full overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm" {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }) => (
    <thead className="border-b border-border bg-muted/50" {...props}>
      {children}
    </thead>
  ),
  tbody: ({ children, ...props }) => (
    <tbody className="divide-y divide-border" {...props}>
      {children}
    </tbody>
  ),
  tr: ({ children, ...props }) => (
    <tr className="transition-colors hover:bg-muted/30" {...props}>
      {children}
    </tr>
  ),
  th: ({ children, ...props }) => (
    <th
      className="px-4 py-3 text-left font-semibold text-foreground"
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td className="px-4 py-3 text-muted-foreground" {...props}>
      {children}
    </td>
  ),

  // ─── Inline code ─────────────────────────────────────────────────────────
  code: ({ children, ...props }) => {
    // Block code is handled by rehype-pretty-code (renders a <figure>).
    // This handles only inline `code`.
    return (
      <code
        className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-[0.875em] font-medium text-foreground"
        {...props}
      >
        {children}
      </code>
    )
  },

  // ─── Code block (pre) — styled by rehype-pretty-code ─────────────────────
  pre: CodeBlock,

  // ─── Images ──────────────────────────────────────────────────────────────
  img: ({ src, alt, width, height, ...props }: ImageMdxProps) => (
    <figure className="my-8">
      <Image
        src={src}
        alt={alt ?? ""}
        width={typeof width === "number" ? width : 800}
        height={typeof height === "number" ? height : 450}
        className="rounded-xl border border-border object-cover"
        {...props}
      />
      {alt && (
        <figcaption className="mt-2 text-center text-sm text-muted-foreground">
          {alt}
        </figcaption>
      )}
    </figure>
  ),

  // ─── Custom components (used directly in MDX files) ───────────────────────
  Callout,
  Mermaid,
}

// ─── Helper: heading anchor icon ─────────────────────────────────────────────
function HeadingAnchor({ id }: { id: string }) {
  return (
    <a
      href={`#${id}`}
      className="ml-2 text-muted-foreground/60 no-underline opacity-0 transition-opacity group-hover:opacity-100 hover:text-muted-foreground"
      aria-label="Link to section"
    >
      #
    </a>
  )
}
