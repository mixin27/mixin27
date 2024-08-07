import { MarkdownItem } from "./Markdown";

export interface Portfolio extends MarkdownItem {
  employee: string;
  employmentTime: number;
  employeeImage: string;
  coverImage: string;
  website: string;
  fromDate: string;
  toDate: String;
  highlights: string[];
}
