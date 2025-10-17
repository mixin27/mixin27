export interface Project {
  slug: string;
  title: string;
  description: string;
  longDescription?: string;
  content?: string;
  image: string;
  images?: string[];
  category: ProjectCategory;
  tags: string[];
  technologies: string[];
  platform: 'iOS' | 'Android' | 'Flutter' | 'React Native' | 'Web';
  status: 'completed' | 'in-progress' | 'planned';
  featured: boolean;
  links?: {
    github?: string;
    demo?: string;
    playStore?: string;
    appStore?: string;
    website?: string;
  };
  date: string;
  client?: string;
  role?: string;
  duration?: string;
  teamSize?: number;
  highlights?: string[];
  challenges?: string[];
  learnings?: string[];
}

export type ProjectCategory =
  | 'mobile'
  | 'web'
  | 'design'
  | 'open-source'
  | 'personal';

export interface ProjectMetadata {
  slug: string;
  title: string;
  description: string;
  image: string;
  category: ProjectCategory;
  tags: string[];
  date: string;
  featured: boolean;
}
