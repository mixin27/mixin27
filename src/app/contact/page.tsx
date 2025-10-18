import { Metadata } from 'next'
import { Mail, MapPin, Phone, Github, Linkedin, Twitter } from 'lucide-react'
import { SITE_CONFIG, SOCIAL_LINKS } from '@/lib/constants'
import { ContactForm } from '@/components/contact-form'
import { generateOGMetadata } from '@/lib/og'

export const metadata: Metadata = generateOGMetadata({
  title: 'Contact Me',
  description:
    'Get in touch with me for project collaborations, job opportunities, or just to say hello.',
  url: '/contact',
})

const email = SITE_CONFIG.email
const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: email,
    href: `mailto:${email}`,
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'Myanmar',
    href: null,
  },
]

const iconMap: { [key: string]: any } = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  mail: Mail,
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="border-b bg-gradient-to-b from-background to-muted/20">
        <div className="container py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              Let's Connect
            </h1>
            <p className="text-xl text-muted-foreground">
              I'm always interested in hearing about new projects,
              opportunities, or just having a friendly chat. Feel free to reach
              out!
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="container py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Contact Info */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Get In Touch</h2>

            {/* Contact Methods */}
            <div className="space-y-4 mb-8">
              {contactInfo.map((item) => (
                <div
                  key={item.label}
                  className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
                >
                  <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <item.icon className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {item.label}
                    </p>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="font-medium hover:text-primary transition-colors"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="font-medium">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div>
              <h3 className="font-semibold mb-4">Follow Me</h3>
              <div className="flex gap-3">
                {SOCIAL_LINKS.map((social) => {
                  const Icon = iconMap[social.icon]
                  return (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`rounded-lg border bg-card p-3 transition-all hover:shadow-md ${social.color}`}
                      aria-label={social.name}
                    >
                      <Icon className="size-6" />
                    </a>
                  )
                })}
              </div>
            </div>

            {/* Availability */}
            <div className="mt-8 p-6 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <span className="size-2 rounded-full bg-green-500 animate-pulse" />
                <p className="font-semibold">Available for Work</p>
              </div>
              <p className="text-sm text-muted-foreground">
                I'm currently available for freelance projects and full-time
                opportunities. Let's discuss how we can work together!
              </p>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div>
            <ContactForm />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="border-t bg-muted/20">
        <div className="container py-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <div className="rounded-lg border bg-card p-6">
                <h3 className="font-semibold mb-2">
                  What services do you offer?
                </h3>
                <p className="text-muted-foreground">
                  I specialize in mobile app development for iOS and Android,
                  including native and cross-platform solutions using Flutter
                  and React Native.
                </p>
              </div>

              <div className="rounded-lg border bg-card p-6">
                <h3 className="font-semibold mb-2">
                  What's your typical response time?
                </h3>
                <p className="text-muted-foreground">
                  I usually respond to emails within 24-48 hours on business
                  days. For urgent matters, please mention it in the subject
                  line.
                </p>
              </div>

              {/* <div className="rounded-lg border bg-card p-6">
                <h3 className="font-semibold mb-2">
                  Do you work with international clients?
                </h3>
                <p className="text-muted-foreground">
                  Yes! I work with clients worldwide and am comfortable with
                  remote collaboration across different time zones.
                </p>
              </div> */}

              <div className="rounded-lg border bg-card p-6">
                <h3 className="font-semibold mb-2">
                  What's your development process?
                </h3>
                <p className="text-muted-foreground">
                  I follow an agile approach with regular updates, clear
                  communication, and iterative development to ensure your
                  project meets all requirements.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
