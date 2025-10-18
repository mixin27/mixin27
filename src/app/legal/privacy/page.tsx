import { Metadata } from 'next'
import { formatDate } from '@/lib/utils'
import { generateOGMetadata } from '@/lib/og'

export const metadata: Metadata = generateOGMetadata({
  title: 'Privacy Policy',
  description:
    'Learn how we collect, use, and protect your personal information.',
  url: '/legal/privacy',
})

const lastUpdated = '2024-10-15'

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground">
              Last updated: {formatDate(lastUpdated)}
            </p>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Introduction</h2>
              <p className="text-muted-foreground mb-4">
                This Privacy Policy describes how Kyaw Zayar Tun ("we", "our",
                or "us") collects, uses, and shares your personal information
                when you visit our website at kyawzayartun.com (the "Website").
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">
                Information We Collect
              </h2>
              <p className="text-muted-foreground mb-4">
                We collect information that you provide directly to us,
                including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
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
              <h2 className="text-2xl font-bold mb-4">
                How We Use Your Information
              </h2>
              <p className="text-muted-foreground mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
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
              <h2 className="text-2xl font-bold mb-4">
                Sharing Your Information
              </h2>
              <p className="text-muted-foreground mb-4">
                We do not sell, trade, or otherwise transfer your personal
                information to third parties except in the following
                circumstances:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
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

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Cookies and Tracking</h2>
              <p className="text-muted-foreground mb-4">
                Our Website uses cookies to enhance your browsing experience.
                Cookies are small text files stored on your device that help us
                remember your preferences and understand how you use our
                Website.
              </p>
              <p className="text-muted-foreground mb-4">
                You can control cookies through your browser settings. However,
                disabling cookies may limit your ability to use certain features
                of our Website.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Data Security</h2>
              <p className="text-muted-foreground mb-4">
                We implement appropriate technical and organizational measures
                to protect your personal information against unauthorized
                access, alteration, disclosure, or destruction. However, no
                method of transmission over the Internet or electronic storage
                is 100% secure.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Your Rights</h2>
              <p className="text-muted-foreground mb-4">
                Depending on your location, you may have certain rights
                regarding your personal information, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
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
              <p className="text-muted-foreground mt-4">
                To exercise these rights, please contact us at
                contact@kyawzayartun.com.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Children's Privacy</h2>
              <p className="text-muted-foreground mb-4">
                Our Website is not intended for children under the age of 13. We
                do not knowingly collect personal information from children
                under 13. If you believe we have collected information from a
                child under 13, please contact us immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Third-Party Links</h2>
              <p className="text-muted-foreground mb-4">
                Our Website may contain links to third-party websites. We are
                not responsible for the privacy practices or content of these
                external sites. We encourage you to review the privacy policies
                of any third-party sites you visit.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">
                Changes to This Privacy Policy
              </h2>
              <p className="text-muted-foreground mb-4">
                We may update this Privacy Policy from time to time. We will
                notify you of any changes by posting the new Privacy Policy on
                this page and updating the "Last updated" date at the top.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
              <p className="text-muted-foreground mb-4">
                If you have any questions about this Privacy Policy, please
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
