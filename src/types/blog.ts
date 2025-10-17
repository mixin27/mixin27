export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  content: string;
  coverImage?: string;
  date: string;
  lastModified?: string;
  author: Author;
  category: BlogCategory;
  tags: string[];
  readingTime: string;
  featured: boolean;
  published: boolean;
  series?: {
    name: string;
    order: number;
  };
}

export interface Author {
  name: string;
  avatar?: string;
  bio?: string;
  social?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    website?: string;
  };
}

export type BlogCategory =
  | 'tutorial'
  | 'guide'
  | 'news'
  | 'opinion'
  | 'case-study'
  | 'announcement';

export interface BlogMetadata {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: BlogCategory;
  tags: string[];
  readingTime: string;
  featured: boolean;
}
