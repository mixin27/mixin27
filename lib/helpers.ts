import { MarkdownItem, SearchContent } from "@interfaces/Markdown";
import { writeContentToFile } from "./file";

/**
 * Get `T` item list according to `get` function.
 * @param fileNames List of file names.
 * @param get Function to invoke.
 * @returns List of `T`.
 */
function getAllItems<T>(fileNames: string[], get: (name: string) => T): T[] {
  return fileNames.map((name) => get(name));
}

/**
 * Prepare and write list of search document data as `json` list to a file.
 *
 * @param filePath Path of file to be written.
 * @param items List of item to be written.
 * @param category Category name for each written item.
 */
function writeListToFile<T extends MarkdownItem>(
  filePath: string,
  items: T[],
  category: string
) {
  const searchItemList: SearchContent[] = [];

  items.forEach((item) => {
    const searchItem: SearchContent = {
      slug: item.slug,
      title: item.title,
      description: item.description,
      category: category,
    };
    searchItemList.push(searchItem);
  });
  const json = JSON.stringify(searchItemList, null, 2);
  writeContentToFile(json, filePath);
}

export { getAllItems, writeListToFile };
