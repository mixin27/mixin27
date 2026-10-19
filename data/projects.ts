import type { Project } from "@/types"

export const projects: Project[] = [
  // ── FEATURED ──────────────────────────────────────────────
  {
    id: "fom-order-manager",
    slug: "fom-order-manager",
    name: "FOM Order Manager",
    shortDesc:
      "Full-stack e-commerce platform for Facebook-first shops with mobile app, web dashboard, and real-time messaging",
    fullDesc:
      "Full-stack e-commerce platform for Facebook-first shops with mobile app, web dashboard, and real-time messaging",
    category: "full-stack",
    tags: ["React", "Next.js", "Flutter", "NestJS", "PostgreSQL", "Docker"],
    featured: true,
    links: {
      live: "https://getfom.com",
      playStore: "https://play.google.com/store/apps/details?id=com.getfom.app",
      appStore: "https://apps.apple.com/us/app/fom-order-manager/id6808275627",
    },
    image: "/images/projects/fom-order-manager/logo.png",
  },
  {
    id: "cannopy-pos",
    slug: "cannopy-pos",
    name: "Cannopy POS",
    shortDesc:
      "Enterprise-grade local-first mobile Point of Sale (POS) system with cursor-based synchronization.",
    fullDesc:
      "A production-grade, offline-first retail Point of Sale (POS) application featuring Drift-backed local storage, cursor-based API sync, socket-based local LAN data replication, active cashier shift tracking, and ESC/POS thermal printing integrations.",
    category: "flutter",
    tags: [
      "offline-first",
      "p2p-sync",
      "clean-architecture",
      "bluetooth-printing",
      "inventory",
      "retail",
    ],
    featured: true,
    links: {
      live: "https://cannopypos.com/",
      playStore:
        "https://play.google.com/store/apps/details?id=com.cannopypos.retail",
      appStore: "https://apps.apple.com/mm/app/cannopy-pos/id6808059928",
    },
    image: "/images/projects/cannopy/logo.png",
  },
  {
    id: "astral-wealth-mobile",
    slug: "astral-wealth-mobile",
    name: "POCO Myanmar (Astral Wealth)",
    shortDesc:
      "Role-based field sales operations, real-time inventory tracking, and hierarchical reporting platform.",
    fullDesc:
      "An enterprise mobile platform for field team operations featuring dynamic role-based dashboards, offline-first barcode/IMEI scanning, counter stock assignments, and multi-level hierarchical sales analytics.",
    category: "flutter",
    tags: [
      "field-sales",
      "inventory",
      "data-visualization",
      "barcode-scanner",
      "push-notifications",
    ],
    featured: true,
    links: {},
    image: "/images/projects/poco/logo.png",
  },
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
      playStore:
        "https://play.google.com/store/apps/details?id=dev.mixin27.collection_tracker",
      appStore:
        "https://apps.apple.com/us/app/collectra-collection-tracker/id6811477706",
      releases: "https://github.com/mixin27/collection_tracker/releases/latest",
    },
    image: "/images/projects/collectra/logo.png",
  },
  {
    id: "myanmar-calendar",
    slug: "myanmar-calendar",
    name: "Myanmar Calendar",
    shortDesc:
      "A Myanmar calendar app with Myanmar and Western dates side by side, moon phases, astrology, holidays, class timetables and Calendar Studio for printable calendars.",
    fullDesc:
      "Every day in both calendars: the Myanmar date and moon, Sabbath, holidays and astrology, with 22 grid layouts, events with weekly timetables and multiple dates, holiday reminders, home-screen widgets on iOS and Android, and Calendar Studio for designing and exporting printable calendars.",
    category: "flutter",
    tags: ["burmese", "calendar", "myanmar-calendar"],
    featured: true,
    links: {
      github: "https://github.com/mixin27/mmcalendar",
      playStore:
        "https://play.google.com/store/apps/details?id=dev.mixin27.mmcalendar",
      appStore:
        "https://apps.apple.com/us/app/myanmar-calendar-pyatkadain/id6811349564",
      releases: "https://github.com/mixin27/mmcalendar/releases/latest",
    },
    image: "/images/projects/myanmar-calendar/logo.png",
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
    links: {
      live: "https://www.facebook.com/Kids-Brain-Work-114184707850861/",
    },
    image: "/images/projects/beads-math/logo.png",
  },
  {
    id: "myanlex",
    slug: "myanlex",
    name: "MyanLex",
    shortDesc:
      "Open-source toolkit for reliable Myanmar-language text processing.",
    fullDesc:
      "A deterministic Myanmar NLP toolkit for validation, conversion, syllabification, tokenization, and mixed-script analysis.",
    category: "full-stack",
    tags: [
      "burmese-orthography-validation",
      "conversion",
      "mixed-script-detection",
      "myanmar-language",
      "nlp",
      "syllabification",
      "tokenization",
    ],
    featured: true,
    links: {
      live: "https://myanlex-docs.vercel.app/",
      demo: "https://myanmar-data-review.vercel.app/",
    },
    image: "/images/projects/myanlex/logo.png",
  },
  {
    id: "myanmar-data-review",
    slug: "myanmar-data-review",
    name: "Myanmar Data Review",
    shortDesc:
      "A web tool for reviewing and analyzing Myanmar-language text data.",
    fullDesc:
      "Built with MyanLex to inspect encoding, normalization, orthography, tokenization, syllabification, and mixed-script issues in Myanmar text.",
    category: "web",
    tags: [
      "data-quality",
      "myanmar-language",
      "nlp",
      "text-analysis",
      "unicode",
      "zawgyi",
      "tokenization",
      "syllabification",
    ],
    featured: true,
    links: {
      live: "https://myanmar-data-review.vercel.app/",
    },
    image: "/images/projects/myanmar-data-review/logo.png",
  },

  // ── MORE PROJECTS ─────────────────────────────────────────
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
    featured: false,
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
    shortDesc: "A modern finance wallet application with beautiful UI/UX.",
    fullDesc:
      "A privacy-first personal finance tracker with offline storage, budget planning, and visual spending analytics built with Flutter.",
    category: "flutter",
    tags: ["wallet", "finance", "account"],
    featured: false,
    links: {
      github: "https://github.com/mixin27/finance-wallet",
    },
    image: "/images/projects/finance-wallet/logo.png",
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
    featured: false,
    links: {
      github: "https://github.com/mixin27/vs-live-flutter",
      playStore:
        "https://play.google.com/store/apps/details?id=com.billion.sport_live",
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
    featured: false,
    links: {
      github: "https://github.com/mixin27/yoyo_chatt",
    },
    image: "/images/projects/yoyo-chatt/logo.png",
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
    featured: false,
    links: {
      github: "https://github.com/mixin27/flutter-mmcalendar",
      pubDev: "https://pub.dev/packages/flutter_mmcalendar",
    },
    image: "/images/projects/flutter-mmcalendar/logo.png",
  },
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
    shortDesc: "Myanmar calendar utility CLI powered by myanmar_calendar_dart.",
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
      github: "https://github.com/mixin27/weather-app-jetpack-compose",
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
    links: {
      playStore:
        "https://play.google.com/store/apps/details?id=com.maun.news_mobile",
    },
    image: "/images/projects/maun-news/logo.png",
  },
  {
    id: "portfolio-site",
    slug: "portfolio-site",
    name: "Portfolio Site",
    shortDesc:
      "My personal portfolio built with Next.js 15, Tailwind CSS v4, and MDX.",
    fullDesc:
      "My personal portfolio site built with the Next.js App Router, Tailwind CSS v4, and a custom MDX pipeline.",
    category: "web",
    tags: ["next.js", "typescript", "tailwind-css", "mdx"],
    featured: false,
    links: {
      github: "https://github.com/mixin27/mixin27",
      demo: "https://kyawzayartun.com",
    },
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
    links: {
      playStore:
        "https://play.google.com/store/apps/details?id=com.systematic.gng_live",
    },
    image: "/images/projects/grab-and-go/logo.png",
  },
  {
    id: "native-id",
    slug: "native-id",
    name: "Native ID",
    shortDesc: "Flutter unique identifier plugin for Android and iOS.",
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
    links: {
      appStore: "https://apps.apple.com/us/app/armo-farmer/id1549131787",
      playStore:
        "https://play.google.com/store/apps/details?id=com.cluspedia.armo",
    },
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
    tags: ["cash-requests", "workflows", "mobile"],
    featured: false,
    links: {
      appStore:
        "https://apps.apple.com/us/app/lucky-diamond-myanmar/id6444782470",
      playStore:
        "https://play.google.com/store/apps/details?id=com.systematic.lucky_diamond",
    },
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
    links: {
      appStore:
        "https://apps.apple.com/us/app/satecha-service-hub/id1638288355",
      playStore:
        "https://play.google.com/store/apps/details?id=com.systematic.cpi",
    },
    image: "/images/projects/sate-cha-service/logo.png",
  },
  {
    id: "sky-cargo-terminal",
    slug: "sky-cargo-terminal",
    name: "Sky Cargo Terminal Service",
    shortDesc: "Forwarder appointment application for Sky Cargo Terminal.",
    fullDesc:
      "A Flutter app for cargo forwarders to schedule and manage appointments at the Sky Cargo Terminal.",
    category: "flutter",
    tags: ["cargo", "terminal", "forwarder"],
    featured: false,
    links: {
      appStore: "https://apps.apple.com/us/app/mcs-service/id1513511820",
      playStore:
        "https://play.google.com/store/apps/details?id=com.systematic.mcs_service",
    },
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
    links: {
      playStore:
        "https://play.google.com/store/apps/details?id=com.systematic.kudos",
    },
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
]

export const featuredProjects = projects.filter((p) => p.featured)
export const totalProjects = projects.length
