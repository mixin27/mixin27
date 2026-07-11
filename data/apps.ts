import type { App } from "@/types";

export const apps: App[] = [
  // ── PRODUCTIVITY ──────────────────────────────────────────
  {
    id: "collectra",
    slug: "collectra",
    name: "Collectra - Collection Tracker and Value Manager",
    shortName: "Collectra",
    description:
      "Collectra helps you catalog collections, track value, manage tags and loans, and keep backups with export/import.",
    category: "productivity",
    platform: "android",
    status: "active",
    packageId: "dev.mixin27.collection_tracker",
    links: {
      playStore:
        "https://play.google.com/store/apps/details?id=dev.mixin27.collection_tracker",
      github: "https://github.com/mixin27/collection_tracker",
      privacy: "/apps/collectra/privacy",
    },
    image: "/images/projects/collectra/logo.png",
  },
  {
    id: "myanmar-calendar",
    slug: "myanmar-calendar",
    name: "Myanmar Calendar",
    shortName: "Myanmar Calendar",
    description:
      "A modern Myanmar calendar app with calendar views, astrology, events, conversion tools, and printable calendar generation.",
    category: "productivity",
    platform: "android",
    status: "active",
    packageId: "dev.mixin27.mmcalendar",
    links: {
      playStore:
        "https://play.google.com/store/apps/details?id=dev.mixin27.mmcalendar",
      github: "https://github.com/mixin27/mmcalendar",
      privacy: "/apps/myanmar-calendar/privacy",
    },
    image: "/images/projects/myanmar-calendar/logo.png",
  },
  {
    id: "beads-math",
    slug: "beads-math",
    name: "Beads Math",
    shortName: "Beads Math",
    description:
      "Mobile application to improve maths calculation skills.",
    category: "productivity",
    platform: "android",
    status: "active",
    packageId: "tech.kbw.beads_math",
    links: {
      playStore:
        "https://play.google.com/store/apps/details?id=tech.kbw.beads_math",
      privacy: "/apps/beads-math/privacy",
    },
    image: "/images/projects/beads-math/logo.png",
  },

  // ── SOCIAL ────────────────────────────────────────────────
  {
    id: "yoyo-chatt",
    slug: "yoyo-chatt",
    name: "Yoyo Chatt",
    shortName: "Yoyo Chatt",
    description:
      "An innovative chat application developed using Flutter and Firebase.",
    category: "social",
    platform: "android",
    status: "active",
    packageId: "com.norm.yoyo_chatt",
    links: {
      playStore:
        "https://play.google.com/store/apps/details?id=com.norm.yoyo_chatt",
      github: "https://github.com/mixin27/yoyo_chatt",
      privacy: "/apps/yoyo-chatt/privacy",
    },
    image: "/images/projects/yoyo-chatt/logo.png",
  },

  // ── OTHER ─────────────────────────────────────────────────
  {
    id: "billion-sport-live",
    slug: "billion-sport-live",
    name: "Billion Sport Live",
    shortName: "Billion Sport Live",
    description: "Sport live stream mobile application.",
    category: "other",
    platform: "android",
    status: "active",
    links: {
      github: "https://github.com/mixin27/vs-live-flutter",
      privacy: "/apps/billion-sport-live/privacy",
    },
    image: "/images/projects/billion-sport-live/logo.png",
  },
  {
    id: "maun-news",
    slug: "maun-news",
    name: "Maun News",
    shortName: "Maun News",
    description:
      "Maun News is a news app that provides news from various sources in Myanmar.",
    category: "other",
    platform: "android",
    status: "active",
    packageId: "com.maun.news_mobile",
    links: {
      playStore:
        "https://play.google.com/store/apps/details?id=com.maun.news_mobile",
      privacy: "/apps/maun-news/privacy",
    },
    image: "/images/projects/maun-news/logo.png",
  },
];

export const totalApps = apps.length;
export const activeApps = apps.filter((a) => a.status === "active").length;
export const androidApps = apps.filter(
  (a) => a.platform === "android" || a.platform === "both"
).length;
export const iosApps = apps.filter(
  (a) => a.platform === "ios" || a.platform === "both"
).length;
