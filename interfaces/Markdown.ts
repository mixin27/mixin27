import { Blog } from "./Blog";
import { Education } from "./Education";
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
  educations: Education[];
}

export type ContentItemName = keyof MarkdownContent;

export interface SearchContent extends Partial<MarkdownItem> {
  category: ContentItemName;
}
