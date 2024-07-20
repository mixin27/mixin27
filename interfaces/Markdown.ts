import { Blog } from "./Blog";
import { Portfolio } from "./Portofolio";
import { Project } from "./Project";

export interface MarkdownItem {
  title: string;
  description: string;
  content: string;
  slug: string;
  date: string;
}

export interface MarkdownContent {
  blogs: Blog[];
  portfolios: Portfolio[];
  projects: Project[];
}

export type ContentItemName = keyof MarkdownContent;

export interface SearchContent extends Partial<MarkdownItem> {
  category: ContentItemName;
}
