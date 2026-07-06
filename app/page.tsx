import type { Metadata } from "next"
import Link from "next/link"
import { siteConfig, experience } from "@/data/config"
import { featuredProjects } from "@/data/projects"
import { ProjectCard } from "@/components/projects/project-card"
import { SectionLabel } from "@/components/ui/section-label"
import { Badge } from "@/components/ui/badge"
import { ArrowRightIcon } from "@/components/ui/social-icons"
import { HeroEmblem } from "@/components/ui/hero-emblem"
import {
  AndroidNativeIcon,
  BackendApiIcon,
  FlutterDartIcon,
  GridIcon,
  WebReactIcon,
} from "@/components/ui/portfolio-icons"

export const metadata: Metadata = {
  title: `${siteConfig.name} - ${siteConfig.role}`,
  description: siteConfig.tagline,
}

const companyCount = new Set(experience.map((item) => item.company)).size

const heroStats = [
  { value: `${siteConfig.totalProjects}+`, label: "Total Projects" },
  { value: siteConfig.featuredProjects.toString(), label: "Featured" },
  { value: `${siteConfig.yearsExperience}+`, label: "Years Exp" },
  { value: companyCount.toString(), label: "Companies" },
]

const skillCards = [
  {
    title: "Flutter & Dart",
    description:
      "Cross-platform mobile apps with polished UI, custom interactions, and native-feeling performance using Flutter's rendering engine.",
    tags: ["Flutter", "Dart", "BLoC", "Riverpod"],
    Icon: FlutterDartIcon,
  },
  {
    title: "Android Native",
    description:
      "Native Android development with Kotlin, Jetpack Compose, and scalable architecture for robust, maintainable mobile products.",
    tags: ["Kotlin", "Compose", "MVVM", "Room"],
    Icon: AndroidNativeIcon,
  },
  {
    title: "Backend & APIs",
    description:
      "Node.js services, Firebase integrations, GraphQL endpoints, and REST APIs that support reliable mobile experiences end to end.",
    tags: ["Node.js", "NestJS", "Firebase", "GraphQL", "REST"],
    Icon: BackendApiIcon,
  },
  {
    title: "Web & React",
    description:
      "Modern React and Next.js interfaces with TypeScript and Tailwind CSS for dashboards, landing pages, and product companions.",
    tags: ["React", "Next.js", "TypeScript", "Tailwind"],
    Icon: WebReactIcon,
  },
]

export default function HomePage() {
  return (
    <>
      <section
        className="relative overflow-hidden pt-28 pb-20 sm:pt-32 sm:pb-24"
        aria-labelledby="hero-heading"
      >
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-60" />
        <div className="pointer-events-none absolute -top-24 -right-24 size-[520px] rounded-full bg-(--app-accent-glow) blur-[120px]" />
        <div className="pointer-events-none absolute bottom-10 left-[8%] size-[280px] rounded-full bg-(--app-accent-glow) opacity-70 blur-[110px]" />

        <div className="relative mx-auto grid max-w-7xl gap-16 px-6 lg:min-h-[calc(100vh-8rem)] lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <div className="mb-6">
              <Badge variant="available">Available for projects</Badge>
            </div>

            <p className="mb-6 font-mono text-[0.95rem] tracking-[0.04em] text-(--app-accent-primary)">
              {"// Mobile Developer"}
            </p>

            <h1
              id="hero-heading"
              className="font-heading text-[clamp(2.9rem,8vw,5rem)] leading-[0.94] tracking-[-0.04em]"
            >
              Kyaw
              <br />
              <span className="app-gradient-text">Zayar Tun</span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-8 text-(--app-text-secondary) sm:text-[1.05rem]">
              Crafting seamless, user-centric mobile experiences across iOS and
              Android. Flutter specialist with a passion for clean architecture
              and performant interfaces.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/projects"
                className="app-btn-primary inline-flex items-center gap-2 rounded-xl bg-(--app-accent-primary) px-7 py-4 font-heading text-sm font-semibold text-white transition-all"
              >
                <GridIcon className="size-4" />
                View Projects
              </Link>
              <Link
                href="/contact"
                className="app-btn-outline inline-flex items-center gap-2 rounded-xl px-7 py-4 font-heading text-sm font-semibold text-foreground transition-all"
              >
                Contact Me
              </Link>
            </div>

            <div className="mt-14 flex flex-wrap gap-x-9 gap-y-6 border-t border-(--app-neon-line) pt-8">
              {heroStats.map((stat) => (
                <div key={stat.label}>
                  <div className="app-gradient-text font-heading text-4xl font-extrabold tracking-[-0.04em]">
                    {stat.value}
                  </div>
                  <div className="mt-1 font-mono text-[11px] tracking-[0.12em] text-(--app-text-muted) uppercase">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative hidden items-center justify-center lg:flex">
            <HeroEmblem />
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24" aria-labelledby="skills-heading">
        <div className="mx-auto max-w-7xl px-6">
          <div>
            <SectionLabel className="mb-4">What I Do</SectionLabel>
            <h2
              id="skills-heading"
              className="max-w-3xl font-heading text-[clamp(2.15rem,5vw,3.2rem)] leading-[1.05] tracking-[-0.03em]"
            >
              Building <span className="app-gradient-text">Pixel-Perfect</span>{" "}
              Experiences
            </h2>
            <p className="mt-4 max-w-xl text-[1.02rem] leading-8 text-(--app-text-secondary)">
              Full-cycle mobile development from architecture to deployment,
              with a strong focus on performance, clarity, and user delight.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {skillCards.map(({ title, description, tags, Icon }) => (
              <div key={title} className="app-glass-card rounded-2xl p-7">
                <Icon className="mb-5 size-12 text-(--app-accent-primary)" />
                <h3 className="font-heading text-xl font-bold tracking-[-0.02em]">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-(--app-text-secondary)">
                  {description}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="app-tag rounded-md px-2.5 py-1 font-mono text-[10px] tracking-[0.08em] uppercase"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="py-20 sm:py-24"
        style={{ background: "var(--app-bg-secondary)" }}
        aria-labelledby="featured-heading"
      >
        <div className="mx-auto max-w-7xl px-6">
          <div>
            <SectionLabel className="mb-4">Selected Work</SectionLabel>
            <h2
              id="featured-heading"
              className="font-heading text-[clamp(2.15rem,5vw,3.2rem)] leading-[1.05] tracking-[-0.03em]"
            >
              <span className="app-gradient-text">Featured</span> Projects
            </h2>
            <p className="mt-4 max-w-xl text-[1.02rem] leading-8 text-(--app-text-secondary)">
              A curated selection of apps and tools built across mobile and web
              platforms, focused on quality and long-term usability.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {featuredProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/projects"
              className="app-btn-outline inline-flex items-center gap-2 rounded-xl px-7 py-4 font-heading text-sm font-semibold text-foreground transition-all"
            >
              View All {siteConfig.totalProjects} Projects
              <ArrowRightIcon className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <section
        className="border-y py-14 sm:py-16"
        style={{ borderColor: "var(--app-neon-line)" }}
        aria-label="Portfolio statistics"
      >
        <div className="mx-auto grid max-w-7xl gap-10 px-6 text-center sm:grid-cols-2 xl:grid-cols-4">
          {heroStats.map((stat) => (
            <div key={stat.label}>
              <div className="app-gradient-text font-heading text-5xl font-extrabold tracking-[-0.04em]">
                {stat.value}
              </div>
              <div className="mt-2 font-mono text-[11px] tracking-[0.12em] text-(--app-text-muted) uppercase">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 sm:py-24" aria-labelledby="experience-heading">
        <div className="mx-auto max-w-7xl px-6">
          <SectionLabel className="mb-4">Career</SectionLabel>
          <h2
            id="experience-heading"
            className="font-heading text-[clamp(2.15rem,5vw,3.2rem)] leading-[1.05] tracking-[-0.03em]"
          >
            Work <span className="app-gradient-text">Experience</span>
          </h2>

          <div className="mt-12 max-w-[640px]">
            <div className="relative pl-8 before:absolute before:top-0 before:bottom-0 before:left-0 before:w-px before:bg-[linear-gradient(to_bottom,var(--app-accent-primary),transparent)]">
              {experience.map((item) => (
                <div
                  key={`${item.company}-${item.period}`}
                  className="relative pb-10"
                >
                  <span className="absolute top-1 left-[-37px] size-2.5 rounded-full bg-(--app-accent-primary) shadow-[0_0_12px_var(--app-accent-primary)]" />
                  <p className="mb-2 font-mono text-[11px] tracking-widest text-(--app-accent-primary) uppercase">
                    {item.period}
                  </p>
                  <h3 className="font-heading text-xl font-bold tracking-[-0.02em] text-foreground">
                    {item.role}
                  </h3>
                  <p className="mt-1 text-sm text-(--app-text-secondary)">
                    {item.company} · {item.type}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-(--app-text-muted)">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        className="relative overflow-hidden py-20 sm:py-24"
        aria-labelledby="cta-heading"
      >
        <div className="pointer-events-none absolute top-1/2 left-1/2 h-[300px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-(--app-accent-glow) blur-[100px]" />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <SectionLabel className="mb-4 justify-center">
            Let&apos;s Build
          </SectionLabel>
          <h2
            id="cta-heading"
            className="mx-auto max-w-[600px] font-heading text-[clamp(2.15rem,5vw,3.2rem)] leading-[1.05] tracking-[-0.03em]"
          >
            Have a <span className="app-gradient-text">Project</span> in Mind?
          </h2>
          <p className="mx-auto mt-5 max-w-[460px] text-[1.02rem] leading-8 text-(--app-text-secondary)">
            I&apos;m available for freelance projects and collaborations.
            Let&apos;s turn your idea into a beautiful mobile experience.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="app-btn-primary inline-flex items-center gap-2 rounded-xl bg-(--app-accent-primary) px-7 py-4 font-heading text-sm font-semibold text-white transition-all"
            >
              Start a Project
            </Link>
            <Link
              href="/about"
              className="app-btn-outline inline-flex items-center gap-2 rounded-xl px-7 py-4 font-heading text-sm font-semibold text-foreground transition-all"
            >
              Learn More About Me
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
