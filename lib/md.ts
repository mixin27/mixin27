import { join } from "path";
import { getDirectory, getFileContent, getFileNames } from "./file";

/**
 * Blog directory
 */
const BLOG_DIR = getDirectory("/content/blogs");

/**
 * Get blog file names from /content/blogs/
 * @returns List of file name under the blogs directory.
 */
const getBlogFileNames = (): string[] => getFileNames(BLOG_DIR);

/**
 * Get blog content from file.
 * @param fileName The name of the blog file.
 * @returns The content of the blog file.
 */
const getBlogContent = (fileName: string): string =>
  getFileContent(join(BLOG_DIR, fileName));

export { getBlogFileNames, getBlogContent };
