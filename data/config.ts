import type { NavItem, SocialLink } from "@/types"

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
} as const

export const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Blog", href: "/blog" },
  { label: "Apps", href: "/apps" },
  { label: "Tools", href: "/tools" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
]

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
]

export const experience = [
  {
    period: "Mar 2026 – Present",
    role: "Mid Mobile Developer",
    company: "Cannopy Technologies",
    type: "Full-time",
    description: "Develop and maintain mobile application for iOS and Android.",
    bullets: [
      "Developing a large-scale Point of Sale (POS) application using Flutter.",
      "Implementing inventory, sales, customer, and transaction management modules.",
      "Building scalable feature-based architecture for long-term maintainability.",
      "Collaborating with backend engineers, QA engineers, and product stakeholders.",
      "Participating in code reviews and maintaining coding standards.",
      "Optimizing application performance and improving user experience.",
      "Contributing to application architecture and technical decision-making.",
    ],
  },
  {
    period: "Nov 2023 – Present",
    role: "Freelance Mobile Developer",
    company: "Freelance",
    type: "Remote",
    description: "Building independent projects that clients need.",
    bullets: [
      "Designed and developed multiple Flutter applications from concept to production.",
      "Architected scalable applications using Clean Architecture principles.",
      "Integrated REST APIs and implemented complex business workflows.",
      "Managed complete application lifecycle from development to deployment.",
      "Collaborated directly with clients to gather requirements and deliver solutions.",
      "Diagnosed and resolved production issues to improve application stability.",
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
      "Developed and maintained enterprise-grade Flutter applications.",
      "Migrated legacy Android and Xamarin applications to Flutter.",
      "Built reusable Flutter components, reducing development effort by approximately 20%.",
      "Collaborated with designers, QA engineers, and project managers.",
      "Participated in code reviews and implementation planning.",
      "Contributed to application architecture and development best practices.",
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
      "Developed Android applications using Java and Kotlin.",
      "Fixed bugs and improved application performance.",
      "Participated in QA testing and debugging activities.",
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
]

export const skills = {
  mobile: ["Flutter", "React Native", "Android (Kotlin/Jetpack Compose)"],
  backend: ["Node.js", "Firebase", "REST APIs", "GraphQL"],
  frontend: ["React", "Next.js"],
  tools: ["Git & GitHub", "CI/CD"],
}

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
]
