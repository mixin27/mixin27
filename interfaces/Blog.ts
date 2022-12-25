import { MarkdownItem } from "./Markdown";

export interface Blog extends MarkdownItem {
  author: string;
  authorImage: string;
  coverImage: string;
  originalPostLink: string;
}
