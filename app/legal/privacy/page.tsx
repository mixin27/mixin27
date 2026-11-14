import { Metadata } from "next"
import { formatDate } from "@/lib/utils"
import { generateOGMetadata } from "@/lib/og"

export const metadata: Metadata = generateOGMetadata({
  title: "Privacy Policy",
  description:
    "Learn how we collect, use, and protect your personal information.",
  url: "/legal/privacy",
})

const lastUpdated = "2026-11-14"

export default function PrivacyPolicyPage() {
  return (
    <>
      <div className="relative border-b border-border/70 pt-32 pb-20">
        <div className="pointer-events-none absolute -top-10 right-0 size-[500px] rounded-full bg-purple-500/8 blur-[120px]" aria-hidden="true" />
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12">
            <h1 className="mb-4 text-5xl font-bold tracking-tight">
              Privacy Policy
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
              Last updated: {formatDate(lastUpdated)}
            </p>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-bold">Introduction</h2>
              <p className="mb-4 text-muted-foreground">
                This Privacy Policy describes how Kyaw Zayar Tun ("we", "our",
                or "us") collects, uses, and shares your personal information
                when you visit our website at kyawzayartun.com (the "Website"),
                including the KZT Freelance Tools web app at
                kyawzayartun.com/tools (the "Tools"). How the Tools handle your
                data, including data from Google, is described in{" "}
                <a href="#freelance-tools" className="text-purple-400 hover:underline">
                  KZT Freelance Tools and Google user data
                </a>
                .
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-bold">
                Information We Collect
              </h2>
              <p className="mb-4 text-muted-foreground">
                We collect information that you provide directly to us,
                including:
              </p>
              <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
                <li>
                  <strong>Contact Information:</strong> When you contact us
                  through our contact form, we collect your name and email
                  address.
                </li>
                <li>
                  <strong>Usage Information:</strong> We automatically collect
                  certain information about your device and how you interact
                  with our Website, including your IP address, browser type,
                  pages visited, and the date and time of your visit.
                </li>
                <li>
                  <strong>Cookies and Similar Technologies:</strong> We use
                  cookies and similar tracking technologies to collect
                  information about your browsing activities.
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-bold">
                How We Use Your Information
              </h2>
              <p className="mb-4 text-muted-foreground">
                We use the information we collect to:
              </p>
              <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
                <li>Respond to your inquiries and provide customer support</li>
                <li>Improve and optimize our Website</li>
                <li>Analyze how visitors use our Website</li>
                <li>
                  Communicate with you about updates, news, and promotional
                  materials
                </li>
                <li>Protect against fraudulent or illegal activity</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-bold">
                Sharing Your Information
              </h2>
              <p className="mb-4 text-muted-foreground">
                We do not sell, trade, or otherwise transfer your personal
                information to third parties except in the following
                circumstances:
              </p>
              <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
                <li>
                  <strong>Service Providers:</strong> We may share your
                  information with third-party service providers who assist us
                  in operating our Website and conducting our business.
                </li>
                <li>
                  <strong>Legal Requirements:</strong> We may disclose your
                  information if required to do so by law or in response to
                  valid requests by public authorities.
                </li>
                <li>
                  <strong>Business Transfers:</strong> In the event of a merger,
                  acquisition, or sale of assets, your personal information may
                  be transferred.
                </li>
              </ul>
            </section>

            <section id="freelance-tools" className="mb-8 scroll-mt-24">
              <h2 className="mb-4 text-2xl font-bold">
                KZT Freelance Tools and Google User Data
              </h2>
              <p className="mb-4 text-muted-foreground">
                KZT Freelance Tools lets you create and manage clients,
                quotations, invoices, payments, receipts, contracts, timesheets
                and resumes. It works without an account.
              </p>

              <h3 className="mb-2 mt-6 text-xl font-semibold">Data you enter in the Tools</h3>
              <p className="mb-4 text-muted-foreground">
                Everything you enter in the Tools is stored in your web
                browser&apos;s local storage on your own device. We do not receive,
                collect or store this data on our servers. It stays on your
                device until you delete it or clear your browser data.
              </p>

              <h3 className="mb-2 mt-6 text-xl font-semibold">Google Drive backup (optional)</h3>
              <p className="mb-4 text-muted-foreground">
                You can choose to connect your Google account to back up your
                Tools data to your own Google Drive. If you do, the Tools request
                only the following Google permission:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-muted-foreground">
                <li>
                  <strong>
                    See, create, and delete its own configuration data in your
                    Google Drive
                  </strong>{" "}
                  (<code>https://www.googleapis.com/auth/drive.appdata</code>).
                  This gives access only to a hidden app folder that the Tools
                  create in your Drive. It does not give access to any of your
                  other Drive files.
                </li>
              </ul>
              <p className="mb-2 text-muted-foreground"><strong>What Google data we access:</strong></p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-muted-foreground">
                <li>The backup files that the Tools create in that hidden app folder (their content, names, sizes and dates).</li>
                <li>Your Google account email address, which Google Drive returns, so the Tools can show which account is connected.</li>
              </ul>
              <p className="mb-2 text-muted-foreground"><strong>How we use it:</strong></p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-muted-foreground">
                <li>To save a backup of your Tools data when you click &quot;Back up now&quot; or, if you turn it on, automatically after you make changes.</li>
                <li>To list, restore and delete those backups when you ask, and to keep only the newest 10 backups.</li>
                <li>To display the connected account&apos;s email address on the Backup &amp; Restore page.</li>
              </ul>
              <p className="mb-2 text-muted-foreground"><strong>Storage, sharing and protection:</strong></p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-muted-foreground">
                <li>
                  All requests to Google go directly from your browser to Google
                  over an encrypted (HTTPS) connection. Your Google data and
                  backup contents never pass through or get stored on our
                  servers.
                </li>
                <li>
                  The access token Google issues is kept only in your browser&apos;s
                  memory while the page is open. It is not saved to disk or sent
                  to us.
                </li>
                <li>
                  We do not sell, share or transfer your Google user data to
                  anyone, and we do not use it for advertising, for building
                  user profiles, or to develop, improve or train artificial
                  intelligence or machine-learning models.
                </li>
                <li>No person at kyawzayartun.com reads your Google user data.</li>
              </ul>
              <p className="mb-2 text-muted-foreground"><strong>Retention and deletion:</strong></p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-muted-foreground">
                <li>Backups stay in your Google Drive until you delete them. You can delete any backup on the Backup &amp; Restore page.</li>
                <li>
                  You can disconnect at any time on the Backup &amp; Restore page,
                  or remove access at{" "}
                  <a href="https://myaccount.google.com/permissions" className="text-purple-400 hover:underline" rel="noopener noreferrer" target="_blank">
                    myaccount.google.com/permissions
                  </a>
                  . To delete the hidden app folder and all backups, open Google
                  Drive, go to Settings &rarr; Manage apps, find KZT Freelance
                  Tools and choose &quot;Delete hidden app data&quot;.
                </li>
                <li>Data stored in your browser is removed when you clear your browser&apos;s site data for kyawzayartun.com.</li>
              </ul>
              <p className="mb-4 text-muted-foreground">
                KZT Freelance Tools&apos; use and transfer to any other app of
                information received from Google APIs will adhere to the{" "}
                <a
                  href="https://developers.google.com/terms/api-services-user-data-policy"
                  className="text-purple-400 hover:underline"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Google API Services User Data Policy
                </a>
                , including the Limited Use requirements.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-bold">Cookies and Tracking</h2>
              <p className="mb-4 text-muted-foreground">
                Our Website uses cookies to enhance your browsing experience.
                Cookies are small text files stored on your device that help us
                remember your preferences and understand how you use our
                Website.
              </p>
              <p className="mb-4 text-muted-foreground">
                You can control cookies through your browser settings. However,
                disabling cookies may limit your ability to use certain features
                of our Website.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-bold">Data Security</h2>
              <p className="mb-4 text-muted-foreground">
                We implement appropriate technical and organizational measures
                to protect your personal information against unauthorized
                access, alteration, disclosure, or destruction. However, no
                method of transmission over the Internet or electronic storage
                is 100% secure.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-bold">Your Rights</h2>
              <p className="mb-4 text-muted-foreground">
                Depending on your location, you may have certain rights
                regarding your personal information, including:
              </p>
              <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
                <li>The right to access your personal information</li>
                <li>
                  The right to correct inaccurate or incomplete information
                </li>
                <li>The right to delete your personal information</li>
                <li>
                  The right to restrict or object to our processing of your
                  information
                </li>
                <li>The right to data portability</li>
              </ul>
              <p className="mt-4 text-muted-foreground">
                To exercise these rights, please contact us at
                kyawzayartun.contact@gmail.com.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-bold">Children's Privacy</h2>
              <p className="mb-4 text-muted-foreground">
                Our Website is not intended for children under the age of 13. We
                do not knowingly collect personal information from children
                under 13. If you believe we have collected information from a
                child under 13, please contact us immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-bold">Third-Party Links</h2>
              <p className="mb-4 text-muted-foreground">
                Our Website may contain links to third-party websites. We are
                not responsible for the privacy practices or content of these
                external sites. We encourage you to review the privacy policies
                of any third-party sites you visit.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-bold">
                Changes to This Privacy Policy
              </h2>
              <p className="mb-4 text-muted-foreground">
                We may update this Privacy Policy from time to time. We will
                notify you of any changes by posting the new Privacy Policy on
                this page and updating the "Last updated" date at the top.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-bold">Contact Us</h2>
              <p className="mb-4 text-muted-foreground">
                If you have any questions about this Privacy Policy, please
                contact us:
              </p>
              <ul className="list-none space-y-2 text-muted-foreground">
                <li>
                  <strong>Email:</strong> kyawzayartun.contact@gmail.com
                </li>
                <li>
                  <strong>Website:</strong>{" "}
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
    </>
  )
}
