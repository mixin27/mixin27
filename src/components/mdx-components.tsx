import Image from 'next/image'
import Link from 'next/link'
import React, { ComponentPropsWithoutRef } from 'react'

// Custom Image component for MDX
function MDXImage(props: ComponentPropsWithoutRef<typeof Image>) {
  return (
    <Image
      {...props}
      alt={props.alt || ''}
      width={props.width || 1200}
      height={props.height || 630}
      className="rounded-lg my-6 w-full h-auto"
    />
  )
}

// Custom Link component for MDX
function MDXLink(props: ComponentPropsWithoutRef<'a'>) {
  const href = props.href || ''

  // External links
  if (href.startsWith('http')) {
    return (
      <a
        {...props}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:underline font-medium"
      />
    )
  }

  // Internal links
  return (
    <Link
      href={href}
      {...props}
      className="text-primary hover:underline font-medium"
    />
  )
}

// Custom Code component
function MDXCode({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<'code'>) {
  const isInline = !className

  if (isInline) {
    return (
      <code
        className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground"
        {...props}
      >
        {children}
      </code>
    )
  }

  // For code blocks, return as-is (rehype-pretty-code handles it)
  return (
    <code className={className} {...props}>
      {children}
    </code>
  )
}

// Custom Pre component (code blocks)
function MDXPre({ children, ...props }: ComponentPropsWithoutRef<'pre'>) {
  return (
    <pre
      className="bg-muted p-4 rounded-lg overflow-x-auto mb-4 border text-sm"
      {...props}
    >
      {children}
    </pre>
  )
}

// Custom Table components
function MDXTable(props: ComponentPropsWithoutRef<'table'>) {
  return (
    <div className="overflow-x-auto my-6">
      <table className="w-full border-collapse" {...props} />
    </div>
  )
}

function MDXTHead(props: ComponentPropsWithoutRef<'thead'>) {
  return <thead className="bg-muted" {...props} />
}

function MDXTH(props: ComponentPropsWithoutRef<'th'>) {
  return <th className="px-4 py-2 text-left font-semibold border" {...props} />
}

function MDXTD(props: ComponentPropsWithoutRef<'td'>) {
  return <td className="px-4 py-2 border" {...props} />
}

// Custom Blockquote
function MDXBlockquote(props: ComponentPropsWithoutRef<'blockquote'>) {
  return (
    <blockquote
      className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground"
      {...props}
    />
  )
}

// Custom HR
function MDXHR(props: ComponentPropsWithoutRef<'hr'>) {
  return <hr className="my-8 border-border" {...props} />
}

// Heading components with anchor links
function createHeading(level: 1 | 2 | 3 | 4 | 5 | 6) {
  return function Heading({
    children,
    ...props
  }: ComponentPropsWithoutRef<'h1'>) {
    const id =
      typeof children === 'string'
        ? children.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        : undefined

    // Map level to actual heading component
    const renderHeading = () => {
      const content = (
        <>
          {children}
          {id && (
            <a href={`#${id}`} className="heading-anchor">
              #
            </a>
          )}
        </>
      )

      switch (level) {
        case 1:
          return (
            <h1 id={id} {...props}>
              {content}
            </h1>
          )
        case 2:
          return (
            <h2 id={id} {...props}>
              {content}
            </h2>
          )
        case 3:
          return (
            <h3 id={id} {...props}>
              {content}
            </h3>
          )
        case 4:
          return (
            <h4 id={id} {...props}>
              {content}
            </h4>
          )
        case 5:
          return (
            <h5 id={id} {...props}>
              {content}
            </h5>
          )
        case 6:
          return (
            <h6 id={id} {...props}>
              {content}
            </h6>
          )
      }
    }

    return renderHeading()
  }
}

interface BadgeProps {
  text: string
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'gray'
  href?: string
}

const colorMap = {
  blue: 'bg-blue-100 text-blue-800',
  green: 'bg-green-100 text-green-800',
  red: 'bg-red-100 text-red-800',
  yellow: 'bg-yellow-100 text-yellow-800',
  purple: 'bg-purple-100 text-purple-800',
  gray: 'bg-gray-100 text-gray-800',
}

export function Badge({ text, color = 'gray', href }: BadgeProps) {
  const className = `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorMap[color]}`

  if (href) {
    return (
      <Link href={href} target="_blank" rel="noopener noreferrer">
        <span className={className}>{text}</span>
      </Link>
    )
  }

  return <span className={className}>{text}</span>
}

export function BadgeGroup({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap gap-2 mb-4">{children}</div>
}

// Export all MDX components
export const mdxComponents = {
  // Headings
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),

  // Content
  p: (props: ComponentPropsWithoutRef<'p'>) => (
    <p className="mb-4 text-muted-foreground leading-7" {...props} />
  ),
  a: MDXLink,
  img: MDXImage,
  Image: MDXImage,

  // Lists
  ul: (props: ComponentPropsWithoutRef<'ul'>) => (
    <ul className="list-disc pl-6 mb-4 space-y-2" {...props} />
  ),
  ol: (props: ComponentPropsWithoutRef<'ol'>) => (
    <ol className="list-decimal pl-6 mb-4 space-y-2" {...props} />
  ),
  li: (props: ComponentPropsWithoutRef<'li'>) => (
    <li className="text-muted-foreground" {...props} />
  ),

  // Code
  code: MDXCode,
  pre: MDXPre,

  // Table
  table: MDXTable,
  thead: MDXTHead,
  th: MDXTH,
  td: MDXTD,

  // Other
  blockquote: MDXBlockquote,
  hr: MDXHR,
  strong: (props: ComponentPropsWithoutRef<'strong'>) => (
    <strong className="font-semibold text-foreground" {...props} />
  ),
  em: (props: ComponentPropsWithoutRef<'em'>) => (
    <em className="italic" {...props} />
  ),

  //   Badge components
  Badge,
  BadgeGroup,
}
