import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

/**
 * Convert `Markdown` string to `HTML` string.
 * @param markdown `Markdown` string content.
 * @returns Converted `HTML` string.
 */
const markdownToHtml = async (markdown: string): Promise<string> => {
  const result = await remark()
    .use(remarkHtml)
    .use(remarkGfm)
    .process(markdown);

  return result.toString();
};

export { markdownToHtml };
