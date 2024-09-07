import { Blog } from "./blog";
import { Project } from "./project";

export interface MarkdownMetadata {
  field: string;
  value: string;
}

export interface MarkdownItem {
  title: string;
  description: string;
  content: string;
  slug: string;
  date: string;
  metadata: Partial<MarkdownMetadata[]>;
}

export interface MarkdownContent {
  blogs: Blog[];
  projects: Project[];
}

export type ContentItemName = keyof MarkdownContent;

export interface SearchContent extends Partial<MarkdownItem> {
  category: ContentItemName;
}
