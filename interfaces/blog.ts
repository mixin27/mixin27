import { MarkdownItem } from "@/interfaces/markdown";

export interface Blog extends MarkdownItem {
  author: string;
  authorImage: string;
  coverImage: string;
}
