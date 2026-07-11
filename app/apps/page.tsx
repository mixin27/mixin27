import type { Metadata } from "next"
import { apps, totalApps, activeApps, androidApps, iosApps } from "@/data/apps"
import { AppCard } from "@/components/apps/app-card"
import { SectionLabel } from "@/components/ui/section-label"

export const metadata: Metadata = {
  title: "My Apps - Privacy Policies",
  description: "View privacy policies for all my mobile applications.",
}

const grouped = {
  productivity: apps.filter((a) => a.category === "productivity"),
  social: apps.filter((a) => a.category === "social"),
  other: apps.filter((a) => a.category === "other"),
}

const categoryLabels: Record<string, string> = {
  productivity: "Productivity Apps",
  social: "Social Apps",
  other: "Other Apps",
}

const headerStats = [
  { value: totalApps.toString(), label: "Total Apps" },
  { value: activeApps.toString(), label: "Active" },
  { value: androidApps.toString(), label: "Android" },
  { value: iosApps.toString(), label: "iOS" },
]

export default async function AppsPage() {
  return (
    <>
      {/* Header */}
      <div className="relative border-b border-border/70 pt-32 pb-20">
        <div
          className="pointer-events-none absolute -top-10 right-0 size-[500px] rounded-full bg-purple-500/8 blur-[120px]"
          aria-hidden="true"
        />
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-4 flex items-center gap-2">
            <SectionLabel>Privacy Policies</SectionLabel>
          </div>
          <h1 className="mb-4 text-5xl font-bold tracking-tight">
            My Mobile Apps
          </h1>
          <p className="mb-10 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Privacy policies and information for all applications I&apos;ve
            developed. Your privacy and data security are my top priorities.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap items-center gap-8">
            {headerStats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="bg-linear-to-br from-purple-400 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">
                  {value}
                </p>
                <p className="mt-1 font-mono text-[11px] tracking-widest text-muted-foreground/80 uppercase">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* App groups */}
      <div className="mx-auto max-w-7xl space-y-20 px-6 py-16">
        {(Object.keys(grouped) as Array<keyof typeof grouped>).map(
          (category) => {
            const group = grouped[category]
            if (group.length === 0) return null
            return (
              <section key={category} aria-labelledby={`cat-${category}`}>
                <h2
                  id={`cat-${category}`}
                  className="mb-8 font-mono text-xs tracking-widest text-muted-foreground uppercase"
                >
                  {categoryLabels[category]}
                </h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {group.map((app) => (
                    <AppCard key={app.id} app={app} />
                  ))}
                </div>
              </section>
            )
          }
        )}
      </div>

      {/* Privacy questions CTA */}
      <section className="border-t border-border/70 py-20">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="mb-3 text-2xl font-bold">Questions About Privacy?</h2>
          <p className="mx-auto mb-8 max-w-xl text-muted-foreground">
            If you have any questions or concerns about how your data is handled
            in any of my applications, please feel free to reach out.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 rounded-xl bg-purple-500 px-7 py-3.5 font-semibold text-white transition-colors hover:bg-purple-400"
          >
            Contact Me
          </a>
        </div>
      </section>
    </>
  )
}
