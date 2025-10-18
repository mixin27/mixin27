import { getAllApps, getAppById, getCompiledAppPrivacy } from '@/lib/apps'
import { Metadata } from 'next'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, Calendar, Shield } from 'lucide-react'
import { notFound } from 'next/navigation'
import { generateOGMetadata } from '@/lib/og'

interface PageProps {
  params: Promise<{
    appId: string
  }>
}

// Generate static params for all apps
export async function generateStaticParams() {
  const apps = getAllApps()
  return apps.map((app) => ({
    appId: app.id,
  }))
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const appId = (await params).appId
  const app = getAppById(appId)

  if (!app) {
    return {
      title: 'Privacy Policy Not Found',
    }
  }

  return generateOGMetadata({
    title: `Privacy Policy - ${app.name}`,
    description: `Privacy policy for ${app.name}. Learn how we collect, use, and protect your data.`,
    url: `/apps/${appId}/privacy`,
  })
}

export default async function AppPrivacyPage({ params }: PageProps) {
  const appId = (await params).appId
  const privacyData = await getCompiledAppPrivacy(appId)

  if (!privacyData) {
    notFound()
  }

  const { app, content, sections } = privacyData

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container py-4">
          <Link
            href="/apps"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-4" />
            Back to Apps
          </Link>
        </div>
      </header>

      <div className="container py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Sidebar */}
          <aside className="lg:col-span-3">
            <div className="sticky top-24 space-y-6">
              {/* App Info */}
              <div className="rounded-lg border bg-card p-6">
                <div className="flex items-start gap-4">
                  {/* App Icon */}
                  <div className="size-16 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xl shrink-0">
                    {app.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-lg truncate">
                      {app.name}
                    </h2>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {app.description}
                    </p>
                  </div>
                </div>

                {/* Store Links */}
                <div className="mt-4 space-y-2">
                  {app.storeLinks.playStore && (
                    <a
                      href={app.storeLinks.playStore}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      <ExternalLink className="size-3.5" />
                      Google Play Store
                    </a>
                  )}
                  {app.storeLinks.appStore && (
                    <a
                      href={app.storeLinks.appStore}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      <ExternalLink className="size-3.5" />
                      Apple App Store
                    </a>
                  )}
                </div>

                {/* Metadata */}
                <div className="mt-6 pt-6 border-t space-y-3">
                  <div className="flex items-start gap-3">
                    <Calendar className="size-4 text-muted-foreground mt-0.5" />
                    <div className="text-sm">
                      <p className="text-muted-foreground">Last Updated</p>
                      <p className="font-medium">
                        {formatDate(app.privacyPolicy.lastUpdated)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="size-4 text-muted-foreground mt-0.5" />
                    <div className="text-sm">
                      <p className="text-muted-foreground">Version</p>
                      <p className="font-medium">{app.privacyPolicy.version}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Table of Contents */}
              {sections && sections.length > 0 && (
                <nav className="rounded-lg border bg-card p-6">
                  <h3 className="font-semibold mb-4">On This Page</h3>
                  <ul className="space-y-2">
                    {sections.map((section) => (
                      <li key={section.slug}>
                        <a
                          href={`#${section.slug}`}
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors block"
                        >
                          {section.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-9">
            <article className="prose prose-slate dark:prose-invert max-w-none">
              {content}
            </article>

            {/* Footer Notice */}
            <div className="mt-12 pt-8 border-t">
              <div className="rounded-lg bg-muted p-6">
                <h3 className="font-semibold mb-2">
                  Questions About This Policy?
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  If you have any questions about our privacy policy, please
                  don't hesitate to contact us.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  Contact Us
                  <ExternalLink className="size-3.5" />
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
