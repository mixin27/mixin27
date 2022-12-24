import { join } from "path";

import { getDirectory, getFileContent, getFileNames } from "./file";
import { getAllItems } from "./helpers";
import { Blog } from "../interfaces/Blog";

/**
 * Blog directory
 */
const __BLOG_DIR__ = getDirectory("/content/blogs");

/**
 * Get blog file names from /content/blogs/
 * @returns List of file name under the blogs directory.
 */
const getBlogFileNames = (): string[] => getFileNames(__BLOG_DIR__);

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

export { getBlogFileNames, getBlog, getBlogList };
