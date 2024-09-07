import { join } from "path";
import { getDirectory, getFileNames, getFileContent } from "./file";
import { MarkdownItem } from "@/interfaces/markdown";
import { markdownToHtml } from "./md";

export const __blog_dir__ = getDirectory("/content/blogs");
export const __project_dir__ = getDirectory("/content/projects");

/**
 * Get `T` item list according to `get` function.
 * @param fileNames List of file names.
 * @param get Function to invoke.
 * @returns List of `T`.
 */
function getAllItems<T extends MarkdownItem>(
  path: string,
  fileNames: string[],
  get: (path: string, fileName: string) => T
): T[] {
  return fileNames
    .map((name) => get(path, name))
    .sort((a, b) => (a.date > b.date ? -1 : 1));
}

const getFileNameList = (dir: string): string[] => getFileNames(dir);

const getMarkdownFileSlugs = (path: string): string[] =>
  getFileNameList(path).map((name) => name.replace(".md", ""));

function getMarkdownFileItem<T extends MarkdownItem>(
  path: string,
  filename: string
): T {
  const item = getFileContent(join(path, filename)) as T;
  item.slug = filename.replace(".md", "");
  return item;
}

function getMarkdownFileItemBySlug<T extends MarkdownItem>(
  path: string,
  slug: string
): T {
  return getMarkdownFileItem<T>(path, slug + ".md");
}

async function getMarkdownFileItemBySlugWithMarkdown<T extends MarkdownItem>(
  path: string,
  slug: string
): Promise<T> {
  const item = getMarkdownFileItemBySlug<T>(path, slug);
  item.content = await markdownToHtml(item.content);
  return item;
}

function getMarkdownFileItemListByFileNames<T extends MarkdownItem>(
  path: string,
  filenames: string[]
): T[] {
  return getAllItems<T>(path, filenames, getMarkdownFileItem);
}

function getMarkdownFileItemList<T extends MarkdownItem>(path: string): T[] {
  const fileNames = getFileNameList(path);
  return getMarkdownFileItemListByFileNames<T>(path, fileNames);
}

export {
  getMarkdownFileItem,
  getMarkdownFileItemBySlugWithMarkdown,
  getMarkdownFileItemList,
  getMarkdownFileItemListByFileNames,
  getMarkdownFileSlugs,
};
