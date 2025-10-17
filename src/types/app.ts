export interface AppMetadata {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'fitness' | 'productivity' | 'weather' | 'finance' | 'social' | 'tools' | 'other';
  platform: 'android' | 'ios' | 'both';
  storeLinks: {
    playStore?: string;
    appStore?: string;
    github?: string;
  };
  privacyPolicy: {
    lastUpdated: string; // ISO date string
    version: string;
  };
  status: 'active' | 'deprecated' | 'development';
  releaseDate?: string;
}

export interface AppPrivacyContent {
  metadata: AppMetadata;
  content: string; // MDX content
  sections?: PrivacySection[];
}

export interface PrivacySection {
  title: string;
  slug: string;
  content: string;
}

// For the apps.json file
export interface AppsConfig {
  apps: AppMetadata[];
  lastUpdated: string;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
  color: string;
}
