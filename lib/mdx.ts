import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeUnwrapImages from 'rehype-unwrap-images'
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeKatex from "rehype-katex";
import { mdxComponents } from "@/components/mdx";
import type { Frontmatter } from "@/types/mdx";

const prettyCodeOptions: Parameters<typeof rehypePrettyCode>[0] = {
//   theme: "github-dark-dimmed",
  theme: {
    light: "github-light",
    dark: "github-dark-dimmed",
  },
  keepBackground: false,
  onVisitLine(node) {
    if (node.children.length === 0) {
      node.children = [{ type: "text", value: " " }];
    }
  },
  onVisitHighlightedLine(node) {
    node.properties.className = ["line--highlighted"];
  },
  onVisitHighlightedChars(node) {
    node.properties.className = ["chars--highlighted"];
  },
};

const remarkPlugins = [remarkGfm, remarkMath];

const rehypePlugins = [
  rehypeSlug,
  [
    rehypeAutolinkHeadings,
    {
      behavior: "append",
      properties: {
        className: ["anchor"],
        ariaLabel: "Link to section",
      },
    },
  ],
  [rehypePrettyCode, prettyCodeOptions],
  rehypeKatex,
  rehypeUnwrapImages,
] as NonNullable<
  NonNullable<
    Parameters<typeof compileMDX>[0]["options"]
  >["mdxOptions"]
>["rehypePlugins"];

const CONTENT_ROOT = path.join(process.cwd(), "content");

export function contentDir(type: string) {
  return path.join(CONTENT_ROOT, type);
}

export async function getMdxContent(filePath: string) {
  const raw = await fs.readFile(filePath, "utf-8");
  const { data: frontmatter, content } = matter(raw);
  const stats = readingTime(content);

  const { content: compiled } = await compileMDX<Frontmatter>({
    source: content,
    components: mdxComponents,
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        remarkPlugins,
        rehypePlugins,
        format: "mdx",
      },
    },
  });

  return {
    frontmatter: frontmatter as Frontmatter,
    content: compiled,
    readingTime: stats,
  };
}

export async function getAllContent(type: "blog" | "projects" | "apps") {
  const dir = contentDir(type);
  let files: string[];
  try {
    files = await fs.readdir(dir);
  } catch {
    return [];
  }

  const mdxFiles = files.filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

  const items = await Promise.all(
    mdxFiles.map(async (filename) => {
      const slug = filename.replace(/\.(mdx|md)$/, "");
      const filePath = path.join(dir, filename);
      const raw = await fs.readFile(filePath, "utf-8");
      const { data: frontmatter, content } = matter(raw);
      const stats = readingTime(content);
      return { slug, frontmatter: frontmatter as Frontmatter, readingTime: stats };
    })
  );

  return items.sort((a, b) => {
    const dateA = a.frontmatter.date ? new Date(a.frontmatter.date).getTime() : 0;
    const dateB = b.frontmatter.date ? new Date(b.frontmatter.date).getTime() : 0;
    return dateB - dateA;
  });
}

export async function getContentBySlug(type: "blog" | "projects" | "apps", slug: string) {
  const dir = contentDir(type);
  for (const ext of [".mdx", ".md"]) {
    const filePath = path.join(dir, `${slug}${ext}`);
    try {
      await fs.access(filePath);
      return getMdxContent(filePath);
    } catch {
      continue;
    }
  }
  return null;
}

export async function getStaticPage(slug: string) {
  const filePath = path.join(CONTENT_ROOT, `${slug}.mdx`);
  try {
    return getMdxContent(filePath);
  } catch {
    return null;
  }
}
