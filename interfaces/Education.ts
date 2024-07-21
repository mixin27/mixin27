import { MarkdownItem } from "./Markdown";

export interface Education extends MarkdownItem {
  city: string;
  country: string;
  website: string;
  fromDate: string;
  toDate: string;
  courses: string[];
}
