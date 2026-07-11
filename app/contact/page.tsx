import type { Metadata } from "next"
import { siteConfig } from "@/data/config"
import { ContactForm } from "@/components/contact/contact-form"
import { SectionLabel } from "@/components/ui/section-label"
import { Badge } from "@/components/ui/badge"
import {
  GithubIcon,
  LinkedinIcon,
  TwitterIcon,
  EmailIcon,
} from "@/components/ui/social-icons"

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch to discuss your project or collaboration.",
}

const contactCards = [
  {
    icon: EmailIcon,
    label: "Email",
    value: siteConfig.email,
    href: `mailto:${siteConfig.email}`,
  },
  {
    icon: GithubIcon,
    label: "GitHub",
    value: "github.com/mixin27",
    href: siteConfig.github,
  },
  {
    icon: LinkedinIcon,
    label: "LinkedIn",
    value: "linkedin.com/in/kyaw-zayar-tun-7574a917a",
    href: siteConfig.linkedin,
  },
  {
    icon: TwitterIcon,
    label: "Twitter",
    value: siteConfig.twitterHandle,
    href: siteConfig.twitter,
  },
]

export default function ContactPage() {
  return (
    <>
      {/* Header */}
      <div className="relative border-b border-border/70 pt-32 pb-20">
        <div
          className="pointer-events-none absolute -top-10 right-0 size-[500px] rounded-full bg-purple-500/8 blur-[120px]"
          aria-hidden="true"
        />
        <div className="mx-auto max-w-7xl px-6">
          <SectionLabel className="mb-4">Get In Touch</SectionLabel>
          <h1 className="mb-4 text-5xl font-bold tracking-tight">
            Let&apos;s Work Together
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
            Have a project in mind? I&apos;m always interested in hearing about
            new projects and opportunities.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-5">
          {/* Left: info */}
          <div className="space-y-8 lg:col-span-2">
            <div>
              <Badge variant="available" className="mb-6">
                Available for new projects
              </Badge>
              <p className="leading-relaxed text-muted-foreground">
                I&apos;m currently taking on new freelance projects and
                consulting work. Whether you need a full mobile app built from
                scratch or want to improve an existing product, I&apos;d love to
                hear your idea.
              </p>
            </div>

            {/* Contact cards */}
            <div className="space-y-3">
              {contactCards.map(({ icon: Icon, label, value, href }) => (
                <a
                  key={label}
                  href={href}
                  target={label !== "Email" ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 rounded-xl border border-border bg-card/60 px-5 py-4 shadow-sm transition-all hover:border-purple-500/25 hover:bg-card"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
                    <Icon className="size-4" />
                  </span>
                  <div>
                    <p className="mb-0.5 font-mono text-[11px] tracking-widest text-muted-foreground/80 uppercase">
                      {label}
                    </p>
                    <p className="text-sm break-all text-foreground/80 transition-colors group-hover:text-purple-300">
                      {value}
                    </p>
                  </div>
                </a>
              ))}
            </div>

            {/* Response time */}
            <div className="flex items-center gap-3 rounded-xl border border-border bg-card/60 px-5 py-4 shadow-sm">
              <span
                className="size-2 animate-pulse rounded-full bg-emerald-400"
                aria-hidden="true"
              />
              <p className="text-sm text-muted-foreground">
                Usually responds within{" "}
                <span className="font-medium text-foreground/80">24 hours</span>
              </p>
            </div>
          </div>

          {/* Right: form */}
          <div className="lg:col-span-3">
            <ContactForm />
          </div>
        </div>
      </div>
    </>
  )
}
