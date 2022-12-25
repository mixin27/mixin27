import { Blog } from "@interfaces/Blog";
import { SearchContent } from "@interfaces/Markdown";
import { join } from "path";
import {
  getDirectory,
  getFileContent,
  getFileNames,
  writeContentToFile,
} from "./file";
import { getAllItems, writeListToFile } from "./helpers";
import { markdownToHtml } from "./md";

/**
 * Blog directory
 */
const __BLOG_DIR__ = getDirectory("/content/blogs");
const __BLOG_SEARCH_FILE__ = getDirectory("/content/search/index.json");

/**
 * Get blog file names from /content/blogs/
 * @returns List of file name under the blogs directory.
 */
const getBlogFileNames = (): string[] => getFileNames(__BLOG_DIR__);

/**
 * Get list slug from file names.
 * @returns List of `slug`.
 */
const getBlogSlugs = (): string[] =>
  getBlogFileNames().map((name) => name.replace(".md", ""));

/**
 * Get blog content from file.
 * @param fileName The name of the blog file.
 * @returns The `Blog` of the blog file.
 */
const getBlog = (fileName: string): Blog => {
  const blog = getFileContent(join(__BLOG_DIR__, fileName)) as Blog;
  blog.slug = fileName.replace(".md", "");
  return blog;
};

/**
 * Get the blog with the name of `slug` from blog files.
 * @param slug Slug to get `Blog`.
 * @returns The `Blog` according to `slug`.
 */
const getBlogBySlug = (slug: string): Blog => getBlog(slug + ".md");

/**
 * Get the blog with the name of `slug` from blog files with
 * converted `HTML` content.
 * @param slug Slug to get `Blog`
 * @returns The `Blog` with converted `HTML` content.
 */
const getBlogBySlugWithMarkdown = async (slug: string): Promise<Blog> => {
  const blog = getBlogBySlug(slug);
  blog.content = await markdownToHtml(blog.content);
  return blog;
};

/**
 * Get blog list by file names.
 * @param fileNames List of blog file names.
 * @returns List of `Blog`.
 */
const getBlogListByFileNames = (fileNames: string[]): Blog[] =>
  getAllItems<Blog>(fileNames, getBlog);

/**
 * Get blog list.
 * @returns List of `Blog`.
 */
const getBlogList = (): Blog[] => {
  // Get all file names from blogs directory.
  const blogFileNames = getBlogFileNames();

  return getBlogListByFileNames(blogFileNames);
};

/**
 * Write `Blog` json data to a file.
 *
 * @param blogs List of `Blog` to be written to a file.
 */
const writeBlogListToFile = (blogs: Blog[]) => {
  writeListToFile<Blog>(__BLOG_SEARCH_FILE__, blogs, "blogs");
};

export {
  getBlogFileNames,
  getBlogSlugs,
  getBlog,
  getBlogBySlug,
  getBlogBySlugWithMarkdown,
  getBlogList,
  writeBlogListToFile,
};
