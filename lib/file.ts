import { join } from "path";
import fs from "fs";
import matter from "gray-matter";

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
const getFileContent = (filePath: string) => {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);
  return { ...data, content };
};

export { getDirectory, getFileNames, getFileContent };
