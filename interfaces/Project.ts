import { MarkdownItem } from "./Markdown";

export interface Project extends MarkdownItem {
  company: string;
  companyLogo: string;
  companyUrl: string;
  logo: string;
  playstoreUrl: string;
  appstoreUrl: string;
  developers: string[];
  highlights: string[];
}
