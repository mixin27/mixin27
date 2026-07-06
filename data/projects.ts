import type { Project } from "@/types";

export const projects: Project[] = [
  // ── FEATURED ──────────────────────────────────────────────
  {
    id: "collectra",
    slug: "collectra",
    name: "Collectra: Collection Tracker",
    shortDesc:
      "Catalog collections, track value, tags, loans, and backups in one app.",
    fullDesc:
      "Collectra helps you catalog collections, track value, manage tags and loans, and keep backups with export/import. Built with Flutter and published on the Play Store.",
    category: "flutter",
    tags: ["collection", "tracker", "catalog"],
    featured: true,
    links: {
      github: "https://github.com/mixin27/collection_tracker",
      releases:
        "https://github.com/mixin27/collection_tracker/releases/latest",
    },
    image: "/images/projects/collectra/logo.png",
  },
  {
    id: "myanmar-calendar-dart",
    slug: "myanmar-calendar-dart",
    name: "Myanmar Calendar Dart",
    shortDesc:
      "A comprehensive Dart package for Myanmar calendar with date conversions, astrological calculations, and multi-language support.",
    fullDesc:
      "A comprehensive Dart package published on pub.dev providing full Myanmar traditional calendar functionality, including Buddhist era calculations, astrological data, and multi-language support.",
    category: "dart",
    tags: ["dart", "myanmar-calendar", "burmese"],
    featured: true,
    links: {
      github: "https://github.com/mixin27/myanmar_calendar_dart",
      pubDev: "https://pub.dev/packages/myanmar_calendar_dart",
    },
    image: "/images/projects/dart.png",
  },
  {
    id: "finance-wallet",
    slug: "finance-wallet",
    name: "FinWallet",
    shortDesc:
      "A modern finance wallet application with beautiful UI/UX.",
    fullDesc:
      "A privacy-first personal finance tracker with offline storage, budget planning, and visual spending analytics built with Flutter.",
    category: "flutter",
    tags: ["wallet", "finance", "account"],
    featured: true,
    links: {
      github: "https://github.com/mixin27/finance-wallet",
    },
    image: "/images/projects/finance-wallet/logo.png",
  },
  {
    id: "mynmar-calendar",
    slug: "mynmar-calendar",
    name: "Myanmar Calendar",
    shortDesc:
      "A modern Myanmar calendar app with calendar views, astrology, events, conversion tools, and printable calendar generation.",
    fullDesc:
      "A full-featured Myanmar traditional calendar app supporting Gregorian and Buddhist Era dates, public holidays, auspicious days, astrology, events, and printable calendars.",
    category: "flutter",
    tags: ["burmese", "calendar", "myanmar-calendar"],
    featured: true,
    links: {
      github: "https://github.com/mixin27/mmcalendar",
      releases: "https://github.com/mixin27/mmcalendar/releases/latest",
    },
    image: "/images/projects/myanmar-calendar/logo.png",
  },
  {
    id: "billion-sport-live",
    slug: "billion-sport-live",
    name: "Billion Sport Live",
    shortDesc: "Sport live stream mobile application.",
    fullDesc:
      "A real-time sports live stream app delivering live scores and match results for football leagues built with Flutter.",
    category: "flutter",
    tags: ["live", "live-stream", "football"],
    featured: true,
    links: {
      github: "https://github.com/mixin27/vs-live-flutter",
    },
    image: "/images/projects/billion-sport-live/logo.png",
  },
  {
    id: "yoyo-chatt",
    slug: "yoyo-chatt",
    name: "Yoyo Chatt",
    shortDesc:
      "An innovative chat application developed using Flutter and Firebase.",
    fullDesc:
      "A real-time chat app with end-to-end messaging, media sharing, and group conversation support built on Flutter and Firebase.",
    category: "flutter",
    tags: ["chat", "social", "communication"],
    featured: true,
    links: {
      github: "https://github.com/mixin27/yoyo_chatt",
    },
    image: "/images/projects/yoyo-chatt/logo.png",
  },
  {
    id: "beads-math",
    slug: "beads-math",
    name: "Beads Math",
    shortDesc: "Mobile application to improve maths calculation skills.",
    fullDesc:
      "Gamified mathematics learning app inspired by traditional abacus mechanics with flashcards, text-to-speech, and progressive difficulty.",
    category: "flutter",
    tags: ["flashcard", "abacus", "text-to-speech"],
    featured: true,
    links: {},
    image: "/images/projects/beads-math/logo.png",
  },
  {
    id: "flutter-mmcalendar",
    slug: "flutter-mmcalendar",
    name: "Flutter MMCalendar",
    shortDesc:
      "A comprehensive Flutter package for Myanmar calendar with date conversions, astrological calculations, and multi-language support.",
    fullDesc:
      "A drop-in Flutter widget package published on pub.dev that adds Myanmar Calendar display and calculation capabilities to any Flutter app.",
    category: "flutter",
    tags: ["flutter", "myanmar-calendar", "burmese"],
    featured: true,
    links: {
      github: "https://github.com/mixin27/flutter-mmcalendar",
      pubDev: "https://pub.dev/packages/flutter_mmcalendar",
    },
    image: "/images/projects/flutter-mmcalendar/logo.png",
  },

  // ── MORE PROJECTS ─────────────────────────────────────────
  {
    id: "myanmar-calendar-wear",
    slug: "myanmar-calendar-wear",
    name: "Myanmar Calendar WearOS",
    shortDesc:
      "A complete WearOS application for displaying Myanmar calendar information with support for multiple languages.",
    fullDesc:
      "A full WearOS companion app that brings Myanmar calendar information to your wrist with multi-language support.",
    category: "flutter",
    tags: ["burmese", "calendar", "myanmar-calendar"],
    featured: false,
    links: {
      github: "https://github.com/mixin27/myanmar_calendar_wear",
      releases:
        "https://github.com/mixin27/myanmar_calendar_wear/releases/latest",
    },
    image: "/images/projects/myanmar-calendar/logo.png",
  },
  {
    id: "myanmar-calendar-dart-cli",
    slug: "myanmar-calendar-dart-cli",
    name: "Myanmar Calendar Dart CLI",
    shortDesc:
      "Myanmar calendar utility CLI powered by myanmar_calendar_dart.",
    fullDesc:
      "A command-line tool for Myanmar calendar calculations, powered by the myanmar_calendar_dart package.",
    category: "dart",
    tags: ["dart", "myanmar-calendar", "burmese"],
    featured: false,
    links: {
      github: "https://github.com/mixin27/myanmar_calendar_dart_cli",
      pubDev: "https://pub.dev/packages/myanmar_calendar_dart_cli",
    },
    image: "/images/projects/dart.png",
  },
  {
    id: "app-permissions",
    slug: "app-permissions",
    name: "App Permissions",
    shortDesc:
      "Centralized permission management system with automatic requests, status tracking, rationale dialogs, and graceful degradation.",
    fullDesc:
      "A Flutter package providing a unified permission management API with automatic requests, status tracking, and rationale dialogs.",
    category: "flutter",
    tags: ["flutter", "permissions", "permissions-handler"],
    featured: false,
    links: {
      github: "https://github.com/mixin27/app_permissions",
      pubDev: "https://pub.dev/packages/app_permissions",
    },
    image: "/images/projects/dart.png",
  },
  {
    id: "app-storage",
    slug: "app-storage",
    name: "App Storage",
    shortDesc:
      "A simple and secure local storage package with support for primitives, collections, and JSON serialization.",
    fullDesc:
      "Type-safe local storage package for Flutter with optional encryption, support for shared_preferences and flutter_secure_storage.",
    category: "flutter",
    tags: ["flutter", "shared_preferences", "flutter_secure_storage"],
    featured: false,
    links: {
      github: "https://github.com/mixin27/app_storage",
      pubDev: "https://pub.dev/packages/app_storage",
    },
    image: "/images/projects/dart.png",
  },
  {
    id: "promo-carousel",
    slug: "promo-carousel",
    name: "Promo Carousel",
    shortDesc:
      "A flexible, customizable promotional carousel package for Flutter.",
    fullDesc:
      "A feature-rich Flutter carousel widget with auto-scroll, custom indicators, network image support, and high customizability.",
    category: "flutter",
    tags: ["flutter", "promo", "carousel"],
    featured: false,
    links: {
      github: "https://github.com/mixin27/promo_carousel",
      pubDev: "https://pub.dev/packages/promo_carousel",
    },
    image: "/images/projects/promo-carousel/logo.png",
  },
  {
    id: "finance-wallet-api",
    slug: "finance-wallet-api",
    name: "Finance Wallet API",
    shortDesc: "Spring Boot Web API service for FinWallet application.",
    fullDesc:
      "A RESTful backend API built with Spring Boot powering the FinWallet mobile application with user management and transaction handling.",
    category: "web",
    tags: ["wallet", "finance", "account"],
    featured: false,
    links: {
      github: "https://github.com/mixin27/finance-wallet-api",
    },
    image: "/images/projects/finance-wallet/logo.png",
  },
  {
    id: "cashbook-app",
    slug: "cashbook-app",
    name: "MyCashbook",
    shortDesc: "Cashbook – Personal Finance Manager.",
    fullDesc:
      "Offline-first cashbook app for personal and small business finance tracking with income, expense, and balance management.",
    category: "flutter",
    tags: ["cashbook", "income", "expense"],
    featured: false,
    links: {
      github: "https://github.com/mixin27/cashbook_app",
    },
    image: "/images/projects/cashbook-app/logo.png",
  },
  {
    id: "weather-app",
    slug: "weather-app",
    name: "Simple Weather App",
    shortDesc: "Weather forecast application.",
    fullDesc:
      "Native Android weather app built with Jetpack Compose providing daily and hourly forecasts.",
    category: "android",
    tags: ["wallet", "finance", "account"],
    featured: false,
    links: {
      github:
        "https://github.com/mixin27/weather-app-jetpack-compose",
    },
    image: "/images/projects/weather-app/logo.png",
  },
  {
    id: "app-update-manager",
    slug: "app-update-manager",
    name: "App Update Manager",
    shortDesc:
      "A comprehensive Flutter package for managing app updates across Play Store, App Store, and custom backends with flexible update strategies.",
    fullDesc:
      "Flexible update management package for Flutter with configurable force update, optional update dialogs, and version comparison utilities.",
    category: "flutter",
    tags: ["flutter", "app-update", "manager"],
    featured: false,
    links: {
      github: "https://github.com/mixin27/app_update_manager",
      pubDev: "https://pub.dev/packages/app_update_manager",
    },
    image: "/images/projects/app-update-manager/logo.png",
  },
  {
    id: "maun-news",
    slug: "maun-news",
    name: "Maun News",
    shortDesc:
      "Maun News is a news app that provides news from various sources in Myanmar.",
    fullDesc:
      "A Myanmar news aggregator app pulling articles from multiple local sources with categorization, bookmarking, and offline reading.",
    category: "flutter",
    tags: ["maun", "news", "article"],
    featured: false,
    links: {},
    image: "/images/projects/maun-news/logo.png",
  },
  {
    id: "sumeer",
    slug: "sumeer",
    name: "Sumeer",
    shortDesc: "CV and Resume builder application.",
    fullDesc:
      "A Flutter-based CV and resume builder app allowing users to create, customize, and export professional resumes.",
    category: "flutter",
    tags: ["resume", "cv", "builder"],
    featured: false,
    links: {
      github: "https://github.com/mixin27/sumeer",
    },
    image: "/images/projects/sumeer/logo.png",
  },
  {
    id: "grab-and-go",
    slug: "grab-and-go",
    name: "G&G",
    shortDesc: "Branch management system for Grab & Go.",
    fullDesc:
      "An Android branch management system app for the Grab & Go business, handling branch operations and management tasks.",
    category: "android",
    tags: ["branch", "management", "g&g"],
    featured: false,
    links: {},
    image: "/images/projects/grab-and-go/logo.png",
  },
  {
    id: "native-id",
    slug: "native-id",
    name: "Native ID",
    shortDesc:
      "Flutter unique identifier plugin for Android and iOS.",
    fullDesc:
      "A Flutter plugin that provides native unique device identifiers for both Android and iOS platforms.",
    category: "flutter",
    tags: ["id", "native"],
    featured: false,
    links: {
      github: "https://github.com/mixin27/flutter_native_id",
      pubDev: "https://pub.dev/packages/native_id",
    },
    image: "/images/projects/native-id/logo.png",
  },
  {
    id: "armo-farmer",
    slug: "armo-farmer",
    name: "Armo Farmer",
    shortDesc: "Useful application for farmers.",
    fullDesc:
      "A Flutter application providing useful information and tools for farmers to support agricultural work.",
    category: "flutter",
    tags: ["farming", "farmer", "information"],
    featured: false,
    links: {},
    image: "/images/projects/armo-farmer/logo.png",
  },
  {
    id: "lucky-diamond-myanmar",
    slug: "lucky-diamond-myanmar",
    name: "Lucky Diamond Myanmar",
    shortDesc: "Cash request application for staffs.",
    fullDesc:
      "An internal mobile application for Lucky Diamond Myanmar staff to manage and submit cash requests.",
    category: "flutter",
    tags: ["luckydiamondmyanmar", "luckydiamondmyanmar", "mobile"],
    featured: false,
    links: {},
    image: "/images/projects/lucky-diamond-myanmar/logo.png",
  },
  {
    id: "sate-cha-service",
    slug: "sate-cha-service",
    name: "Sate Cha Service",
    shortDesc: "Test kits management for Sate Cha clinics.",
    fullDesc:
      "A Flutter app for managing HIV/AIDS test kits across Sate Cha clinics, supporting inventory and usage tracking.",
    category: "flutter",
    tags: ["clinic", "hiv/aids", "test-kits"],
    featured: false,
    links: {},
    image: "/images/projects/sate-cha-service/logo.png",
  },
  {
    id: "sky-cargo-terminal",
    slug: "sky-cargo-terminal",
    name: "Sky Cargo Terminal Service",
    shortDesc:
      "Forwarder appointment application for Sky Cargo Terminal.",
    fullDesc:
      "A Flutter app for cargo forwarders to schedule and manage appointments at the Sky Cargo Terminal.",
    category: "flutter",
    tags: ["cargo", "terminal", "forwarder"],
    featured: false,
    links: {},
    image: "/images/projects/sky-cargo-terminal-service/logo.png",
  },
  {
    id: "kudos-to-you",
    slug: "kudos-to-you",
    name: "KUDOS TO YOU",
    shortDesc: "E-learning Platform Application.",
    fullDesc:
      "A Flutter-based e-learning platform with course management and learning content delivery.",
    category: "flutter",
    tags: ["e-learning", "course"],
    featured: false,
    links: {},
    image: "/images/projects/kudos-to-you/logo.png",
  },
  {
    id: "speaking-partners",
    slug: "speaking-partners",
    name: "Speaking Partners",
    shortDesc:
      "An Android application for people who want to practice foreign language.",
    fullDesc:
      "A native Android app connecting language learners with speaking partners for foreign language practice.",
    category: "android",
    tags: ["partners", "speaking", "language"],
    featured: false,
    links: {
      github: "https://github.com/mixin27/speakingpartners",
    },
    image: "/images/projects/speaking-partners/logo.png",
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
export const totalProjects = projects.length;
