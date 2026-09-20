import Link from "next/link"
import Image from "next/image"
import { GithubIcon, ExternalLinkIcon } from "@/components/ui/social-icons"
import type { App } from "@/types"
import { cn } from "@/lib/utils"

interface AppCardProps {
  app: App
}

const legalLinks = (app: App) => [
  { label: "Privacy Policy", href: app.links.privacy },
  //   { label: "Terms of Service", href: `/apps/${app.slug}/terms` },
  //   { label: "Data Safety", href: `/apps/${app.slug}/data-safety` },
  //   { label: "Support", href: `/apps/${app.slug}/support` },
  //   { label: "Contact", href: "/contact" },
  //   { label: "Delete Account", href: `/apps/${app.slug}/delete-account` },
]

export function AppCard({ app }: AppCardProps) {
  return (
    <article className="app-glass-card flex flex-col rounded-2xl p-6">
      {/* Header */}
      <div className="mb-4 flex items-start gap-4">
        <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border/80 bg-muted/30 p-1.5 shadow-[0_0_20px_var(--app-accent-glow)]">
          <Image
            src={app.image}
            alt={`${app.name} icon`}
            width={56}
            height={56}
            className="size-full object-contain"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <span
              className={cn(
                "rounded-md border px-2 py-0.5 font-mono text-[10px] tracking-widest uppercase",
                app.status === "active"
                  ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                  : "border-border bg-muted/70 text-muted-foreground"
              )}
            >
              {app.status}
            </span>
            <span className="rounded-md border border-border bg-muted/60 px-2 py-0.5 font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
              {app.platform}
            </span>
          </div>
          <h3 className="text-sm leading-snug font-semibold text-foreground">
            {app.name}
          </h3>
        </div>
      </div>

      <p className="mb-5 flex-1 text-sm leading-relaxed text-muted-foreground">
        {app.description}
      </p>

      {/* Store links */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        {[
          { href: app.links.live, label: "Visit website", primary: true },
          { href: app.links.playStore, label: "Google Play", primary: !app.links.live },
          {
            href: app.links.appStore,
            label: "App Store",
            primary: !app.links.live && !app.links.playStore,
          },
        ]
          .filter((link): link is { href: string; label: string; primary: boolean } => Boolean(link.href))
          .map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all",
                link.primary
                  ? "border-(--app-accent-primary) bg-(--app-accent-primary) text-white hover:-translate-y-0.5 hover:opacity-90"
                  : "border-border bg-muted/60 text-foreground hover:border-(--app-accent-border)"
              )}
            >
              {link.label}
              <ExternalLinkIcon className="size-3" />
            </a>
          ))}
        {app.links.github && (
          <a
            href={app.links.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${app.name} on GitHub`}
            className="text-muted-foreground/80 transition-colors hover:text-foreground"
          >
            <GithubIcon className="size-4" />
          </a>
        )}
      </div>

      {/* Legal links */}
      <div className="border-t border-border/70 pt-4">
        <p className="mb-3 font-mono text-[10px] tracking-widest text-muted-foreground/80 uppercase">
          Compliance
        </p>
        <div className="flex flex-wrap gap-2">
          {legalLinks(app).map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="rounded-md border border-border bg-muted/50 px-2.5 py-1 font-mono text-[10px] text-muted-foreground transition-colors hover:border-foreground/15 hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </article>
  )
}
