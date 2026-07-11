import type { NavItem, SocialLink } from "@/types";

export const siteConfig = {
  name: "Kyaw Zayar Tun",
  handle: "KZT",
  role: "Mobile Developer",
  tagline:
    "Crafting seamless, user-centric mobile experiences across iOS & Android. Flutter specialist with a passion for clean architecture and performant UIs.",
  email: "kyawzayartun.contact@gmail.com",
  url: "https://kyawzayartun.com",
  github: "https://github.com/mixin27",
  linkedin: "https://linkedin.com/in/kyaw-zayar-tun-7574a917a",
  twitter: "https://twitter.com/kyawzayartun98",
  twitterHandle: "@kyawzayartun98",
  totalProjects: 28,
  featuredProjects: 8,
  totalApps: 6,
  yearsExperience: 4,
} as const;

export const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Blog", href: "/blog" },
  { label: "Apps", href: "/apps" },
  { label: "Tools", href: "/tools" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const socialLinks: SocialLink[] = [
  { label: "GitHub", href: "https://github.com/mixin27", icon: "github" },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/kyaw-zayar-tun-7574a917a",
    icon: "linkedin",
  },
  {
    label: "Twitter",
    href: "https://twitter.com/kyawzayartun98",
    icon: "twitter",
  },
  {
    label: "Email",
    href: "mailto:kyawzayartun.contact@gmail.com",
    icon: "email",
  },
];

export const experience = [
  {
    period: "Nov 2023 – Present",
    role: "Freelance Mobile Developer",
    company: "Freelance",
    type: "Remote",
    description:
      "Building independent projects that clients need.",
    bullets: [
      "Developed and published multiple Flutter applications including Myanmar Calendar, Maun News, Beads Math, and Yoyo Chatt.",
      "Implemented real-time chat, multi-language support, date conversion, onboarding flows, ads monetization, and API integrations.",
      "Managed full development lifecycle: UI/UX → backend integration → testing → Play Store release.",
      "Built Myanmar Calendar (10K+ downloads), a multi-language Flutter app with date conversion & traditional Burmese calendar features.",
    ],
  },
  {
    period: "Mar 2022 – Oct 2024",
    role: "Mobile Developer",
    company: "SYSTEMATIC Business Solutions",
    type: "Full-time",
    description:
      "Developed and maintained multiple mobile applications for iOS and Android using Flutter.",
    bullets: [
      "Designed and developed production Flutter applications for business clients, collaborating with designers, backend developers, and QA teams.",
      "Migrated legacy Android and Xamarin apps to Flutter, reducing maintenance effort and improving cross-platform consistency.",
      "Built reusable Flutter components and internal frameworks, reducing overall development time by ~20% across projects.",
    ],
  },
  {
    period: "Oct 2019 – Apr 2020",
    role: "Junior Android Developer",
    company: "Etrade Myanmar",
    type: "Full-time",
    description:
      "Started my journey in mobile development, learning and growing with each project.",
    bullets: [
      "Assisted in developing Android applications using Java and Kotlin, following modern Android development practices.",
      "Fixed bugs, improved UI/UX, and optimized app performance under guidance from senior developers.",
    ],
  },
  {
    period: "May 2019 – Aug 2019",
    role: "Internship – Web Developer",
    company: "IrraHub",
    type: "Internship",
    description:
      "Started my journey in software development as an intern, learning and growing with each project.",
    bullets: [
      "Assisted in developing web applications using Node.js, React, and MySQL.",
      "Implemented frontend features and supported backend API integration.",
      "Worked closely with team members on feature implementation and basic testing.",
    ],
  },
];

export const skills = {
  mobile: ["Flutter", "React Native", "Android (Kotlin/Jetpack Compose)"],
  backend: ["Node.js", "Firebase", "REST APIs", "GraphQL"],
  frontend: ["React", "Next.js"],
  tools: ["Git & GitHub", "CI/CD"],
};

export const values = [
  {
    icon: "clean-code",
    title: "Clean Code",
    description:
      "Writing maintainable, scalable, and well-documented code that stands the test of time.",
  },
  {
    icon: "innovation",
    title: "Innovation",
    description:
      "Always exploring new technologies and approaches to solve problems more effectively.",
  },
  {
    icon: "user-centric",
    title: "User-Centric",
    description:
      "Every decision is made with the end user in mind, ensuring the best possible experience.",
  },
  {
    icon: "quality-first",
    title: "Quality First",
    description:
      "Committed to delivering high-quality work that exceeds expectations and industry standards.",
  },
];
