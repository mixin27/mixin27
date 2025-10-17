import { Metadata } from 'next'
import Link from 'next/link'
import { Shield, ExternalLink, Smartphone, Apple } from 'lucide-react'
import { getAllApps, getAppStats } from '@/lib/apps'
import { generateMetadata as genMeta } from '@/lib/utils'

export const metadata: Metadata = genMeta({
  title: 'My Apps - Privacy Policies',
  description: 'View privacy policies for all my mobile applications.',
  url: '/apps',
})

export default function AppsPage() {
  const apps = getAllApps()
  const stats = getAppStats()

  // Group apps by category
  const appsByCategory = apps.reduce(
    (acc, app) => {
      if (!acc[app.category]) {
        acc[app.category] = []
      }
      acc[app.category].push(app)
      return acc
    },
    {} as Record<string, typeof apps>,
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="border-b bg-gradient-to-b from-background to-muted/20">
        <div className="container py-16 md:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary mb-4">
              <Shield className="size-4" />
              Privacy Policies
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              My Mobile Apps
            </h1>
            <p className="text-xl text-muted-foreground">
              Privacy policies and information for all applications I've
              developed. Your privacy and data security are my top priorities.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            <div className="rounded-lg border bg-card p-4">
              <p className="text-3xl font-bold">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Total Apps</p>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <p className="text-3xl font-bold">{stats.active}</p>
              <p className="text-sm text-muted-foreground">Active</p>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <p className="text-3xl font-bold">{stats.android}</p>
              <p className="text-sm text-muted-foreground">Android</p>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <p className="text-3xl font-bold">{stats.ios}</p>
              <p className="text-sm text-muted-foreground">iOS</p>
            </div>
          </div>
        </div>
      </section>

      {/* Apps Grid */}
      <section className="container py-16">
        {apps.length === 0 ? (
          <div className="text-center py-12">
            <Shield className="size-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">No Apps Yet</h2>
            <p className="text-muted-foreground">
              Check back soon for privacy policies of my mobile applications.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(appsByCategory).map(([category, categoryApps]) => (
              <div key={category}>
                <h2 className="text-2xl font-bold capitalize mb-6">
                  {category} Apps
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryApps.map((app) => (
                    <article
                      key={app.id}
                      className="group rounded-lg border bg-card overflow-hidden hover:shadow-lg transition-all"
                    >
                      {/* App Header */}
                      <div className="p-6">
                        <div className="flex items-start gap-4 mb-4">
                          {/* App Icon */}
                          <div className="size-14 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xl shrink-0 group-hover:bg-primary/20 transition-colors">
                            {app.name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg mb-1 truncate">
                              {app.name}
                            </h3>
                            <div className="flex items-center gap-2 text-xs">
                              {(app.platform === 'android' ||
                                app.platform === 'both') && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-green-600 dark:text-green-400">
                                  <Smartphone className="size-3" />
                                  Android
                                </span>
                              )}
                              {(app.platform === 'ios' ||
                                app.platform === 'both') && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 text-blue-600 dark:text-blue-400">
                                  <Apple className="size-3" />
                                  iOS
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {app.description}
                        </p>

                        {/* Status Badge */}
                        <div className="mb-4">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                              app.status === 'active'
                                ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                                : app.status === 'development'
                                  ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
                                  : 'bg-gray-500/10 text-gray-600 dark:text-gray-400'
                            }`}
                          >
                            <span className="size-1.5 rounded-full bg-current" />
                            {app.status.charAt(0).toUpperCase() +
                              app.status.slice(1)}
                          </span>
                        </div>

                        {/* Store Links */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {app.storeLinks.playStore && (
                            <a
                              href={app.storeLinks.playStore}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <ExternalLink className="size-3" />
                              Play Store
                            </a>
                          )}
                          {app.storeLinks.appStore && (
                            <a
                              href={app.storeLinks.appStore}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <ExternalLink className="size-3" />
                              App Store
                            </a>
                          )}
                          {app.storeLinks.github && (
                            <a
                              href={app.storeLinks.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <ExternalLink className="size-3" />
                              Github
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="border-t bg-muted/30 p-4">
                        <Link
                          href={`/apps/${app.id}/privacy`}
                          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                        >
                          <Shield className="size-4" />
                          View Privacy Policy
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="border-t bg-muted/20">
        <div className="container py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Questions About Privacy?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            If you have any questions or concerns about how your data is handled
            in any of my applications, please feel free to reach out.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Contact Me
            <ExternalLink className="size-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
