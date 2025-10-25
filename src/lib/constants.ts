import { SocialLink } from "@/types/app"

export const SITE_CONFIG = {
  name: "Kyaw Zayar Tun",
  title: "Kyaw Zayar Tun - Mobile Developer",
  description:
    "Passionate mobile developer dedicated to creating seamless, user-friendly applications.",
  url: "https://kyawzayartun.com",
  author: "Kyaw Zayar Tun",
  email: "kyawzayartun.contact@gmail.com",
}

export const SOCIAL_LINKS: SocialLink[] = [
  {
    name: "GitHub",
    url: "https://github.com/mixin27",
    icon: "github",
    color: "",
  },
  {
    name: "LinkedIn",
    url: "https://linkedin.com/in/kyaw-zayar-tun-7574a917a",
    icon: "linkedin",
    color: "hover:text-blue-600",
  },
  {
    name: "Twitter",
    url: "https://twitter.com/kyawzayartun98",
    icon: "twitter",
    color: "hover:text-blue-400",
  },
  {
    name: "Email",
    url: "mailto:kyawzayartun.contact@gmail.com",
    icon: "mail",
    color: "hover:text-red-400",
  },
]

export const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Projects", href: "/projects" },
  { name: "Contact", href: "/contact" },
]

export const FOOTER_LINKS = {
  main: [
    { name: "Home", href: "/" },
    { name: "Projects", href: "/projects" },
    { name: "Blog", href: "/blog" },
    { name: "Apps", href: "/apps" },
    { name: "Tools", href: "/tools" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/legal/privacy" },
    { name: "Terms of Service", href: "/legal/terms" },
    { name: "Cookie Policy", href: "/legal/cookie-policy" },
  ],
}

export const SKILLS = [
  { name: "Flutter", level: 95, category: "mobile" as const },
  { name: "React Native", level: 90, category: "mobile" as const },
  { name: "Swift", level: 85, category: "mobile" as const },
  { name: "Kotlin", level: 85, category: "mobile" as const },
  { name: "React", level: 90, category: "frontend" as const },
  { name: "Next.js", level: 88, category: "frontend" as const },
  { name: "TypeScript", level: 92, category: "frontend" as const },
  { name: "Node.js", level: 85, category: "backend" as const },
  { name: "Firebase", level: 90, category: "backend" as const },
  { name: "PostgreSQL", level: 80, category: "backend" as const },
  { name: "Figma", level: 88, category: "design" as const },
  { name: "UI/UX Design", level: 85, category: "design" as const },
]

export const PROJECT_CATEGORIES = [
  { value: "all", label: "All Projects" },
  { value: "mobile", label: "Mobile Apps" },
  { value: "web", label: "Web Apps" },
  { value: "design", label: "Design" },
  { value: "library", label: "Library" },
  { value: "package", label: "Package" },
]
