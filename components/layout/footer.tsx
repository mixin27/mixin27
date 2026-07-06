import Link from "next/link"
import { navItems, socialLinks, siteConfig } from "@/data/config"
import { KztLogo } from "@/components/ui/kzt-logo"
import {
  GithubIcon,
  LinkedinIcon,
  TwitterIcon,
  EmailIcon,
  RssIcon,
} from "@/components/ui/social-icons"

const iconMap = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  twitter: TwitterIcon,
  email: EmailIcon,
  rss: RssIcon,
}

const legalLinks = [
  { label: "Privacy Policy", href: "/legal/privacy" },
  { label: "Terms of Service", href: "/legal/terms" },
  { label: "Cookie Policy", href: "/legal/cookie-policy" },
]

export function Footer() {
  return (
    <footer
      className="border-t border-border/70 bg-card/50 backdrop-blur-sm"
      role="contentinfo"
    >
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link
              href="/"
              className="group mb-4 inline-flex items-center gap-2.5"
              aria-label="Home"
            >
              <KztLogo className="size-7" />
              <span className="font-mono text-sm font-semibold tracking-wider text-foreground">
                {siteConfig.handle}
                <span className="text-purple-400">.</span>
              </span>
            </Link>

            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {siteConfig.tagline}
            </p>

            {/* Socials */}
            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map((s) => {
                const Icon = iconMap[s.icon]
                return (
                  <a
                    key={s.href}
                    href={s.href}
                    target={s.icon !== "email" ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-purple-500/40 hover:text-purple-400"
                  >
                    <Icon className="size-4" />
                  </a>
                )
              })}
              <a
                href="/feed.xml"
                aria-label="RSS Feed"
                className="flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-purple-500/40 hover:text-purple-400"
              >
                <RssIcon className="size-4" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="mb-4 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
              Navigation
            </h3>
            <ul className="space-y-2.5" role="list">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
              Legal
            </h3>
            <ul className="space-y-2.5" role="list">
              {legalLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get in touch */}
          <div>
            <h3 className="mb-4 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
              Get In Touch
            </h3>
            <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
              Have a project in mind? Let&apos;s work together to create
              something amazing.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-lg border border-purple-500/20 bg-purple-500/10 px-4 py-2.5 text-sm font-medium text-purple-400 transition-colors hover:border-purple-500/40 hover:bg-purple-500/20"
            >
              Contact Me
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border/70 pt-8 sm:flex-row">
          <p className="font-mono text-xs text-muted-foreground/80">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <p className="font-mono text-xs text-muted-foreground/80">
            Built with Next.js &amp; Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  )
}
