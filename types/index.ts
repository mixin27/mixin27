// ============================================================
// Global TypeScript Types
// ============================================================

export type ProjectCategory = "flutter" | "dart" | "android" | "web" | "library" | "full-stack";

export interface Project {
  id: string;
  slug: string;
  name: string;
  shortDesc: string;
  fullDesc: string;
  category: ProjectCategory;
  tags: string[];
  featured: boolean;
  links: {
    github?: string;
    playStore?: string;
    pubDev?: string;
    releases?: string;
    demo?: string;
    live?: string;
  };
  image?: string;
}

export type AppCategory = "productivity" | "social" | "other";
export type AppStatus = "active" | "inactive";
export type AppPlatform = "android" | "ios" | "both";

export interface App {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  description: string;
  category: AppCategory;
  platform: AppPlatform;
  status: AppStatus;
  packageId?: string;
  links: {
    playStore?: string;
    github?: string;
    privacy: string;
    live?: string;
  };
  image: string;
}

export interface ExperienceItem {
  period: string;
  role: string;
  company: string;
  type: string;
  description: string;
  bullets: string[];
}

export interface NavItem {
  label: string;
  href: string;
}

export interface SocialLink {
  label: string;
  href: string;
  icon: "github" | "linkedin" | "twitter" | "email" | "rss";
}
