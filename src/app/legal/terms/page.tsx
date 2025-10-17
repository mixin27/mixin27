import { Metadata } from 'next'
import { formatDate, generateMetadata as genMeta } from '@/lib/utils'

export const metadata: Metadata = genMeta({
  title: 'Terms of Service',
  description: 'Terms and conditions for using our website and services.',
  url: '/legal/terms',
})

const lastUpdated = '2024-10-15'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Terms of Service
            </h1>
            <p className="text-muted-foreground">
              Last updated: {formatDate(lastUpdated)}
            </p>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Agreement to Terms</h2>
              <p className="text-muted-foreground mb-4">
                By accessing or using kyawzayartun.com (the "Website"), you
                agree to be bound by these Terms of Service and all applicable
                laws and regulations. If you do not agree with any of these
                terms, you are prohibited from using or accessing this site.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Use License</h2>
              <p className="text-muted-foreground mb-4">
                Permission is granted to temporarily view the materials
                (information or software) on the Website for personal,
                non-commercial transitory viewing only. This is the grant of a
                license, not a transfer of title, and under this license you may
                not:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Modify or copy the materials</li>
                <li>
                  Use the materials for any commercial purpose or public display
                </li>
                <li>
                  Attempt to decompile or reverse engineer any software on the
                  Website
                </li>
                <li>
                  Remove any copyright or proprietary notations from the
                  materials
                </li>
                <li>
                  Transfer the materials to another person or "mirror" the
                  materials on any other server
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Disclaimer</h2>
              <p className="text-muted-foreground mb-4">
                The materials on the Website are provided on an 'as is' basis.
                We make no warranties, expressed or implied, and hereby disclaim
                and negate all other warranties including, without limitation,
                implied warranties or conditions of merchantability, fitness for
                a particular purpose, or non-infringement of intellectual
                property or other violation of rights.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Limitations</h2>
              <p className="text-muted-foreground mb-4">
                In no event shall Kyaw Zayar Tun or its suppliers be liable for
                any damages (including, without limitation, damages for loss of
                data or profit, or due to business interruption) arising out of
                the use or inability to use the materials on the Website.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Accuracy of Materials</h2>
              <p className="text-muted-foreground mb-4">
                The materials appearing on the Website could include technical,
                typographical, or photographic errors. We do not warrant that
                any of the materials on the Website are accurate, complete, or
                current. We may make changes to the materials contained on the
                Website at any time without notice.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Links</h2>
              <p className="text-muted-foreground mb-4">
                We have not reviewed all of the sites linked to the Website and
                are not responsible for the contents of any such linked site.
                The inclusion of any link does not imply endorsement by us. Use
                of any such linked website is at the user's own risk.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Intellectual Property</h2>
              <p className="text-muted-foreground mb-4">
                All content on this Website, including but not limited to text,
                graphics, logos, images, and software, is the property of Kyaw
                Zayar Tun or its content suppliers and is protected by
                international copyright laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">User Content</h2>
              <p className="text-muted-foreground mb-4">
                If you submit any content to the Website (such as comments or
                feedback), you grant us a non-exclusive, worldwide, royalty-free
                license to use, reproduce, modify, and display such content in
                connection with operating the Website.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Modifications</h2>
              <p className="text-muted-foreground mb-4">
                We may revise these Terms of Service at any time without notice.
                By using this Website you are agreeing to be bound by the then
                current version of these Terms of Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Governing Law</h2>
              <p className="text-muted-foreground mb-4">
                These terms and conditions are governed by and construed in
                accordance with the laws of Myanmar and you irrevocably submit
                to the exclusive jurisdiction of the courts in that location.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
              <p className="text-muted-foreground mb-4">
                If you have any questions about these Terms of Service, please
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
