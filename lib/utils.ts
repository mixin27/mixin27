import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getCategoryLabel(category: string): string {
  const map: Record<string, string> = {
    flutter: "Flutter",
    dart: "Dart",
    android: "Android",
    web: "Web",
    library: "Library",
  }
  return map[category] ?? category
}

export function getCategoryColor(category: string): string {
  const map: Record<string, string> = {
    flutter: "bg-sky-500/10 text-sky-400 border-sky-500/20",
    dart: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    android: "bg-green-500/10 text-green-400 border-green-500/20",
    web: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    library: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  }
  return map[category] ?? "bg-muted/70 text-muted-foreground border-border"
}

/**
 * Get base URL from environment
 */
export function getBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return 'http://localhost:3000';
}

/**
 * Format date to readable string
 */
export function formatDate(date: string | Date, locale: string = 'en-US'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  return dateObj.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
