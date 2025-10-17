import fs from 'fs';
import path from 'path';
import { AppMetadata, AppsConfig, AppPrivacyContent } from '@/types/app';
import { getMDXBySlug, compileMDXContent } from './mdx';

const appsConfigPath = path.join(process.cwd(), 'content/apps/apps.json');

/**
 * Get all apps configuration
 */
export function getAppsConfig(): AppsConfig {
  try {
    const fileContent = fs.readFileSync(appsConfigPath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Error reading apps.json:', error);
    return {
      apps: [],
      lastUpdated: new Date().toISOString(),
    };
  }
}

/**
 * Get all apps
 */
export function getAllApps(): AppMetadata[] {
  const config = getAppsConfig();
  return config.apps;
}

/**
 * Get app by ID
 */
export function getAppById(appId: string): AppMetadata | null {
  const config = getAppsConfig();
  return config.apps.find((app) => app.id === appId) || null;
}

/**
 * Get apps by category
 */
export function getAppsByCategory(
  category: AppMetadata['category']
): AppMetadata[] {
  const config = getAppsConfig();
  return config.apps.filter((app) => app.category === category);
}

/**
 * Get apps by platform
 */
export function getAppsByPlatform(
  platform: 'android' | 'ios' | 'both'
): AppMetadata[] {
  const config = getAppsConfig();
  return config.apps.filter(
    (app) => app.platform === platform || app.platform === 'both'
  );
}

/**
 * Get active apps only
 */
export function getActiveApps(): AppMetadata[] {
  const config = getAppsConfig();
  return config.apps.filter((app) => app.status === 'active');
}

/**
 * Get app privacy policy content
 */
export async function getAppPrivacyPolicy(
  appId: string
): Promise<AppPrivacyContent | null> {
  try {
    const app = getAppById(appId);
    if (!app) {
      return null;
    }

    const mdxContent = await getMDXBySlug('apps', appId, 'privacy.mdx');
    if (!mdxContent) {
      return null;
    }

    return {
      metadata: app,
      content: mdxContent.content,
      sections: extractSections(mdxContent.content),
    };
  } catch (error) {
    console.error(`Error getting privacy policy for ${appId}:`, error);
    return null;
  }
}

/**
 * Get compiled app privacy policy
 */
export async function getCompiledAppPrivacy(appId: string) {
  const privacyData = await getAppPrivacyPolicy(appId);
  if (!privacyData) {
    return null;
  }

  const compiled = await compileMDXContent(
    privacyData.content,
    privacyData.metadata
  );

  return {
    ...compiled,
    app: privacyData.metadata,
    sections: privacyData.sections,
  };
}

/**
 * Extract sections from MDX content (for table of contents)
 */
function extractSections(content: string) {
  const headingRegex = /^##\s+(.+)$/gm;
  const sections: { title: string; slug: string, content: string }[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const title = match[1];
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    sections.push({ title, slug, content });
  }

  return sections;
}

/**
 * Check if app privacy policy exists
 */
export function appPrivacyExists(appId: string): boolean {
  const privacyPath = path.join(
    process.cwd(),
    'content/apps',
    appId,
    'privacy.mdx'
  );
  return fs.existsSync(privacyPath);
}

/**
 * Get app statistics
 */
export function getAppStats() {
  const apps = getAllApps();

  return {
    total: apps.length,
    active: apps.filter((app) => app.status === 'active').length,
    android: apps.filter(
      (app) => app.platform === 'android' || app.platform === 'both'
    ).length,
    ios: apps.filter(
      (app) => app.platform === 'ios' || app.platform === 'both'
    ).length,
    byCategory: {
      fitness: apps.filter((app) => app.category === 'fitness').length,
      productivity: apps.filter((app) => app.category === 'productivity').length,
      weather: apps.filter((app) => app.category === 'weather').length,
      finance: apps.filter((app) => app.category === 'finance').length,
      social: apps.filter((app) => app.category === 'social').length,
      other: apps.filter((app) => app.category === 'other').length,
    },
  };
}

/**
 * Search apps by name or description
 */
export function searchApps(query: string): AppMetadata[] {
  const apps = getAllApps();
  const lowerQuery = query.toLowerCase();

  return apps.filter(
    (app) =>
      app.name.toLowerCase().includes(lowerQuery) ||
      app.description.toLowerCase().includes(lowerQuery)
  );
}
