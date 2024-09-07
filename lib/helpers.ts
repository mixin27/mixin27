import {
  ContentItemName,
  MarkdownContent,
  MarkdownItem,
  SearchContent,
} from "@/interfaces/markdown";
import { getDirectory, writeContentToFile } from "./file";

const __SEARCH_DATA_FILE__ = getDirectory("/content/search/index.json");

/**
 * Get `T` item list according to `get` function.
 * @param fileNames List of file names.
 * @param get Function to invoke.
 * @returns List of `T`.
 */
function getAllItems<T extends MarkdownItem>(
  fileNames: string[],
  get: (fileName: string) => T
): T[] {
  return fileNames
    .map((name) => get(name))
    .sort((a, b) => (a.date > b.date ? -1 : 1));
}

function saveSearchData(content: MarkdownContent) {
  const searchItemList: SearchContent[] = [];
  Object.keys(content).forEach((dataSource) => {
    const contentName = dataSource as ContentItemName;
    content[contentName].forEach((data) => {
      const searchItem: SearchContent = {
        slug: data.slug,
        title: data.title,
        description: data.description,
        category: contentName,
      };
      searchItemList.push(searchItem);
    });
  });
  const json = JSON.stringify(searchItemList, null, 2);
  writeContentToFile(json, __SEARCH_DATA_FILE__);
  console.log("search index write complete");
}

export { getAllItems, saveSearchData };
