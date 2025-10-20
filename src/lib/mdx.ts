import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { compileMDX } from 'next-mdx-remote/rsc'
import readingTime from 'reading-time'
import remarkGfm from 'remark-gfm'
import rehypePrettyCode from 'rehype-pretty-code'
import { transformerCopyButton } from '@rehype-pretty/transformers'
import { mdxComponents } from '@/components/mdx-components'

const contentDirectory = path.join(process.cwd(), 'content')

export interface MDXContent {
  slug: string
  metadata: {
    title?: string
    description?: string
    date?: string
    lastUpdated?: string
    version?: string
    [key: string]: any
  }
  content: string
  readingTime?: string
}

export interface CompiledMDX {
  content: React.ReactElement
  metadata: MDXContent['metadata']
  readingTime?: string
}

/**
 * Get all MDX files from a directory
 */
export async function getMDXFiles(dir: string): Promise<string[]> {
  const fullPath = path.join(contentDirectory, dir)

  if (!fs.existsSync(fullPath)) {
    return []
  }

  const files = fs.readdirSync(fullPath)
  return files.filter((file) => file.endsWith('.mdx') || file.endsWith('.md'))
}

/**
 * Get MDX file by slug
 */
export async function getMDXBySlug(
  dir: string,
  slug: string,
  filename: string = 'index.mdx',
): Promise<MDXContent | null> {
  try {
    const filePath = path.join(contentDirectory, dir, slug, filename)

    if (!fs.existsSync(filePath)) {
      // Try without nested folder
      const altPath = path.join(contentDirectory, dir, `${slug}.mdx`)
      if (!fs.existsSync(altPath)) {
        return null
      }
      return await parseMDXFile(altPath, slug)
    }

    return await parseMDXFile(filePath, slug)
  } catch (error) {
    console.error(`Error reading MDX file: ${slug}`, error)
    return null
  }
}

/**
 * Parse MDX file and extract metadata
 */
async function parseMDXFile(
  filePath: string,
  slug: string,
): Promise<MDXContent> {
  const fileContent = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(fileContent)
  const stats = readingTime(content)

  if (!content || content.trim().length === 0) {
    console.warn(`Warning: MDX file "${slug}" has no content after frontmatter`)
  }

  return {
    slug,
    metadata: data,
    content,
    readingTime: stats.text,
  }
}

/**
 * Get all MDX content from a directory
 */
export async function getAllMDX(dir: string): Promise<MDXContent[]> {
  const fullPath = path.join(contentDirectory, dir)

  if (!fs.existsSync(fullPath)) {
    return []
  }

  const entries = fs.readdirSync(fullPath, { withFileTypes: true })
  const mdxContent: MDXContent[] = []

  for (const entry of entries) {
    if (entry.isDirectory()) {
      // Check for index.mdx or privacy.mdx in subdirectory
      const subPath = path.join(fullPath, entry.name)
      const files = fs.readdirSync(subPath)

      const mdxFile = files.find(
        (f) => f === 'index.mdx' || f === 'privacy.mdx' || f.endsWith('.mdx'),
      )

      if (mdxFile) {
        const content = await parseMDXFile(
          path.join(subPath, mdxFile),
          entry.name,
        )
        mdxContent.push(content)
      }
    } else if (entry.name.endsWith('.mdx') || entry.name.endsWith('.md')) {
      const slug = entry.name.replace(/\.mdx?$/, '')
      const content = await parseMDXFile(path.join(fullPath, entry.name), slug)
      mdxContent.push(content)
    }
  }

  return mdxContent
}

const options = {
  theme: {
    dark: 'github-dark-dimmed',
    light: 'github-light',
  },
  keepBackground: false,
  defaultLang: 'plaintext',
}

/**
 * Compile MDX content to React component
 */
export async function compileMDXContent(
  content: string,
  metadata: any = {},
): Promise<CompiledMDX> {
  try {
    const { content: mdxContent } = await compileMDX({
      source: content,
      options: {
        parseFrontmatter: true,
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [[rehypePrettyCode, options]],
        },
      },
      components: mdxComponents,
    })

    const stats = readingTime(content)

    return {
      content: mdxContent,
      metadata,
      readingTime: stats.text,
    }
  } catch (error) {
    console.error('Error compiling MDX:', error)
    throw error
  }
}

/**
 * Get sorted MDX content by date
 */
export async function getSortedMDX(
  dir: string,
  sortBy: 'date' | 'lastUpdated' = 'date',
): Promise<MDXContent[]> {
  const allContent = await getAllMDX(dir)

  return allContent.sort((a, b) => {
    const dateA = new Date(a.metadata[sortBy] || 0).getTime()
    const dateB = new Date(b.metadata[sortBy] || 0).getTime()
    return dateB - dateA
  })
}
