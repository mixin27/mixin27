import type { Metadata } from "next"
import Link from "next/link"
import { experience, values, skills } from "@/data/config"
import { SectionLabel } from "@/components/ui/section-label"
import { ArrowRightIcon } from "@/components/ui/social-icons"
import {
  CleanCodeIcon,
  InnovationIcon,
  QualityFirstIcon,
  UserCentricIcon,
} from "@/components/ui/portfolio-icons"

export const metadata: Metadata = {
  title: "About Me",
  description:
    "Learn more about my journey as a mobile developer, my skills, experience, and what drives my passion for creating great apps.",
}

const allSkills = [
  ...skills.mobile,
  ...skills.backend,
  ...skills.frontend,
  ...skills.tools,
]

const valueIconMap = {
  "clean-code": CleanCodeIcon,
  innovation: InnovationIcon,
  "user-centric": UserCentricIcon,
  "quality-first": QualityFirstIcon,
} as const

export default function AboutPage() {
  return (
    <>
      {/* Header */}
      <div className="relative border-b border-border/70 pt-32 pb-20">
        <div
          className="pointer-events-none absolute -top-10 right-0 size-[500px] rounded-full bg-purple-500/8 blur-[120px]"
          aria-hidden="true"
        />
        <div className="mx-auto max-w-7xl px-6">
          <SectionLabel className="mb-4">About Me</SectionLabel>
          <h1 className="mb-6 text-5xl font-bold tracking-tight">About Me</h1>
          <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
            I&apos;m a passionate mobile developer with a deep love for creating
            beautiful, functional, and user-friendly applications.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-20">
        {/* Bio + Values grid */}
        <div className="mb-24 grid grid-cols-1 gap-16 lg:grid-cols-2">
          {/* Bio */}
          <div>
            <SectionLabel className="mb-6">Who I Am</SectionLabel>
            <div className="space-y-5 leading-relaxed text-muted-foreground">
              <p>
                I&apos;m a passionate mobile developer with a deep love for
                creating beautiful, functional, and user-friendly applications.
              </p>
              <p>
                With over four years of experience in mobile development,
                I&apos;ve had the privilege of working on diverse projects, from
                startups to enterprise applications. My journey in tech has been
                driven by curiosity, continuous learning, and a commitment to
                excellence.
              </p>
              <p>
                I specialize in Flutter and Kotlin, with a deep appreciation for
                clean architecture and user-centric design. From publishing
                open-source Dart packages to shipping production apps with 10K+
                downloads, I bring both breadth and depth to every project.
              </p>
            </div>

            {/* Skills */}
            <div className="mt-10">
              <h3 className="mb-4 font-semibold text-foreground">
                Skills &amp; Expertise
              </h3>
              <div className="flex flex-wrap gap-2">
                {allSkills.map((skill) => (
                  <span
                    key={skill}
                    className="cursor-default rounded-lg border border-border bg-muted/50 px-3 py-1.5 font-mono text-[11px] text-muted-foreground transition-colors hover:border-purple-500/30 hover:text-purple-400"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Values */}
          <div>
            <SectionLabel className="mb-6">What I Value</SectionLabel>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {values.map((v) => {
                const Icon = valueIconMap[v.icon as keyof typeof valueIconMap]

                return (
                  <div key={v.title} className="app-glass-card rounded-2xl p-5">
                    <Icon className="mb-3 size-8 text-(--app-accent-primary)" />
                    <h4 className="mb-1.5 text-sm font-semibold text-foreground">
                      {v.title}
                    </h4>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {v.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Skills breakdown */}
        <div className="mb-24">
          <SectionLabel className="mb-6">Skills &amp; Expertise</SectionLabel>
          <h2 className="mb-10 text-3xl font-bold">Technical Skills</h2>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Mobile Development", items: skills.mobile },
              { label: "Backend & APIs", items: skills.backend },
              { label: "Frontend", items: skills.frontend },
              { label: "Tools & Practices", items: skills.tools },
            ].map(({ label, items }) => (
              <div
                key={label}
                className="rounded-2xl border border-border bg-card/60 p-6 shadow-sm"
              >
                <h3 className="mb-4 font-mono text-[11px] tracking-widest text-purple-400 uppercase">
                  {label}
                </h3>
                <ul className="space-y-2">
                  {items.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <span
                        className="size-1 rounded-full bg-purple-500/60"
                        aria-hidden="true"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Experience timeline */}
        <div className="mb-24">
          <SectionLabel className="mb-6">Experience</SectionLabel>
          <h2 className="mb-10 text-3xl font-bold">Work History</h2>

          <div className="relative max-w-3xl">
            <div
              className="absolute top-0 bottom-0 left-2 w-px bg-linear-to-b from-purple-500/80 to-transparent"
              aria-hidden="true"
            />

            <ol className="space-y-12 pl-10" role="list">
              {experience.map((item) => (
                <li key={item.company} className="relative">
                  <span
                    className="absolute top-1 left-[-37px] size-3 rounded-full bg-purple-500 ring-4 ring-background"
                    aria-hidden="true"
                  />
                  <time className="mb-1 block font-mono text-[11px] tracking-widest text-purple-400 uppercase">
                    {item.period}
                  </time>
                  <h3 className="mb-0.5 text-lg font-bold text-foreground">
                    {item.role}
                  </h3>
                  <p className="mb-3 text-sm text-muted-foreground">
                    {item.company} · {item.type}
                  </p>
                  <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                  <ul className="space-y-2">
                    {item.bullets.map((bullet, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <span
                          className="mt-2 size-1 shrink-0 rounded-full bg-purple-500/60"
                          aria-hidden="true"
                        />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Education */}
        <div className="mb-24">
          <SectionLabel className="mb-6">Education</SectionLabel>
          <h2 className="mb-10 text-3xl font-bold">Academic Background</h2>

          <div className="max-w-xl rounded-2xl border border-border bg-card/60 p-7 shadow-sm">
            <h3 className="mb-1 font-bold text-foreground">
              Samsung Mobile Application Training Certificate 2018
            </h3>
            <p className="mb-3 text-sm text-muted-foreground">
              Samsung Tech Institute, Yangon · 2018
            </p>
          </div>

          <div className="max-w-xl rounded-2xl border border-border bg-card/60 p-7 shadow-sm mt-4">
            <h3 className="mb-1 font-bold text-foreground">
              Bachelor of Computer Science
            </h3>
            <p className="mb-3 text-sm text-muted-foreground">
              University of Computer Studies, Yangon · 2014 – 2019
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Graduated with GPA grade{" "}
              <strong className="text-foreground/80">B</strong>, focusing on
              software engineering, data mining, and artificial intelligence.
              Completed various projects involving HTML, CSS3, JavaScript, Java,
              C# and Android development.
            </p>
          </div>

          
        </div>

        {/* CTA */}
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card/60 p-12 text-center shadow-sm">
          <div
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
            aria-hidden="true"
          >
            <div className="size-[400px] rounded-full bg-purple-500/10 blur-[80px]" />
          </div>
          <div className="relative">
            <h2 className="mb-3 text-2xl font-bold">
              Let&apos;s Work Together
            </h2>
            <p className="mx-auto mb-8 max-w-md text-muted-foreground">
              I&apos;m always interested in hearing about new projects and
              opportunities. Whether you have a question or just want to say hi,
              feel free to reach out!
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-purple-500 px-7 py-3.5 font-semibold text-white transition-colors hover:bg-purple-400"
            >
              Get In Touch
              <ArrowRightIcon className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
