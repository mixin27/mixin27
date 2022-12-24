import { join } from "path";
import fs from "fs";

/**
 * Get full directory path.
 * @param path Relative path you want to locate
 * @returns Full directory path.
 */
const getDirectory = (path: string): string => join(process.cwd(), path);

/**
 * Get list of file name under the directory.
 * @param dir Directory path
 * @returns List of file names under the `dir`.
 */
const getFileNames = (dir: string): string[] => fs.readdirSync(dir);

/**
 * Get content of the file.
 * @param filePath Path of the file you want to open.
 * @returns File content.
 */
const getFileContent = (filePath: string): string => {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  return fileContent;
};

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

export {
  getDirectory,
  getFileNames,
  getFileContent,
  getBlogFileNames,
  getBlogContent,
};
