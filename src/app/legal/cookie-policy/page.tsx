import { Metadata } from 'next'
import { formatDate } from '@/lib/utils'
import { generateOGMetadata } from '@/lib/og'

export const metadata: Metadata = generateOGMetadata({
  title: 'Cookie Policy',
  description: 'Learn about how we use cookies on our website.',
  url: '/legal/cookie-policy',
})

const lastUpdated = '2025-10-16'

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Cookie Policy
            </h1>
            <p className="text-muted-foreground">
              Last updated: {formatDate(lastUpdated)}
            </p>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">What Are Cookies</h2>
              <p className="text-muted-foreground mb-4">
                Cookies are small text files that are placed on your computer or
                mobile device when you visit a website. They are widely used to
                make websites work more efficiently and provide information to
                website owners.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">How We Use Cookies</h2>
              <p className="text-muted-foreground mb-4">
                We use cookies for the following purposes:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>
                  <strong>Essential Cookies:</strong> These cookies are
                  necessary for the website to function properly. They enable
                  basic functions like page navigation and access to secure
                  areas of the website.
                </li>
                <li>
                  <strong>Preference Cookies:</strong> These cookies remember
                  your preferences, such as your preferred language or theme
                  (dark/light mode).
                </li>
                <li>
                  <strong>Analytics Cookies:</strong> These cookies help us
                  understand how visitors interact with our website by
                  collecting and reporting information anonymously.
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">
                Types of Cookies We Use
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Session Cookies
                  </h3>
                  <p className="text-muted-foreground">
                    These are temporary cookies that expire when you close your
                    browser. They help us maintain your session while you
                    navigate through our website.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Persistent Cookies
                  </h3>
                  <p className="text-muted-foreground">
                    These cookies remain on your device for a set period or
                    until you delete them. They help us remember your
                    preferences for future visits.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Third-Party Cookies
                  </h3>
                  <p className="text-muted-foreground">
                    We may use third-party services (such as analytics
                    providers) that also set cookies on your device. These
                    cookies are controlled by the third party, and you should
                    check their privacy policies for more information.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Cookies We Use</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-border">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border px-4 py-2 text-left">
                        Cookie Name
                      </th>
                      <th className="border border-border px-4 py-2 text-left">
                        Purpose
                      </th>
                      <th className="border border-border px-4 py-2 text-left">
                        Duration
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border px-4 py-2">theme</td>
                      <td className="border border-border px-4 py-2">
                        Stores your theme preference (dark/light)
                      </td>
                      <td className="border border-border px-4 py-2">1 year</td>
                    </tr>
                    <tr>
                      <td className="border border-border px-4 py-2">
                        session_id
                      </td>
                      <td className="border border-border px-4 py-2">
                        Maintains your session
                      </td>
                      <td className="border border-border px-4 py-2">
                        Session
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border px-4 py-2">_ga</td>
                      <td className="border border-border px-4 py-2">
                        Google Analytics - tracks visitors
                      </td>
                      <td className="border border-border px-4 py-2">
                        2 years
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Managing Cookies</h2>
              <p className="text-muted-foreground mb-4">
                You have the right to decide whether to accept or reject
                cookies. You can exercise your cookie preferences by:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>
                  <strong>Browser Settings:</strong> Most web browsers
                  automatically accept cookies, but you can modify your browser
                  settings to decline cookies if you prefer. However, this may
                  prevent you from taking full advantage of the website.
                </li>
                <li>
                  <strong>Browser Add-ons:</strong> You can install browser
                  add-ons that block or manage cookies.
                </li>
                <li>
                  <strong>Third-Party Tools:</strong> You can opt out of
                  third-party cookies by visiting the third party's opt-out
                  page.
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">
                How to Control Cookies in Your Browser
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Google Chrome</h3>
                  <p className="text-sm text-muted-foreground">
                    Settings → Privacy and security → Cookies and other site
                    data
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Mozilla Firefox</h3>
                  <p className="text-sm text-muted-foreground">
                    Settings → Privacy & Security → Cookies and Site Data
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Safari</h3>
                  <p className="text-sm text-muted-foreground">
                    Preferences → Privacy → Cookies and website data
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Microsoft Edge</h3>
                  <p className="text-sm text-muted-foreground">
                    Settings → Privacy, search, and services → Cookies and site
                    permissions
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">
                Updates to This Policy
              </h2>
              <p className="text-muted-foreground mb-4">
                We may update this Cookie Policy from time to time to reflect
                changes in our practices or for other operational, legal, or
                regulatory reasons. We encourage you to review this policy
                periodically.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
              <p className="text-muted-foreground mb-4">
                If you have any questions about our use of cookies, please
                contact us:
              </p>
              <ul className="list-none space-y-2 text-muted-foreground">
                <li>
                  <strong>Email:</strong> contact@kyawzayartun.com
                </li>
                <li>
                  <strong>Website:</strong>{' '}
                  <a
                    href="https://kyawzayartun.com"
                    className="text-primary hover:underline"
                  >
                    https://kyawzayartun.com
                  </a>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
