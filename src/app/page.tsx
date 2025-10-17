import Link from 'next/link'
import {
  ArrowRight,
  Code,
  Smartphone,
  Zap,
  Github,
  Linkedin,
  Mail,
  Twitter,
} from 'lucide-react'
import { SITE_CONFIG, SOCIAL_LINKS } from '@/lib/constants'

const iconMap: { [key: string]: any } = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  mail: Mail,
}

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-background to-background" />
        <div
          className="absolute inset-0 -z-10 opacity-[0.02]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className="container">
          <div className="flex min-h-[calc(100vh-4rem)] flex-col justify-center py-16 md:py-24">
            <div className="max-w-3xl">
              {/* Badge */}
              <div className="animate-fade-in-up inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary mb-6">
                <span className="size-2 rounded-full bg-primary animate-pulse" />
                Available for new projects
              </div>

              {/* Main Heading */}
              <h1 className="animate-fade-in-up animation-delay-100 text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
                Hello, I'm{' '}
                <span className="text-primary">{SITE_CONFIG.author}</span>
              </h1>

              <p className="animate-fade-in-up animation-delay-200 text-xl md:text-2xl text-muted-foreground mb-8">
                A passionate{' '}
                <span className="font-semibold text-foreground">
                  mobile developer
                </span>{' '}
                dedicated to creating seamless, user-friendly applications that
                bring ideas to life.
              </p>

              {/* CTA Buttons */}
              <div className="animate-fade-in-up animation-delay-300 flex flex-wrap gap-4 mb-12">
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  View My Work
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-lg border bg-background px-6 py-3 text-sm font-medium hover:bg-accent transition-colors"
                >
                  Get In Touch
                </Link>
              </div>

              {/* Social Links */}
              <div className="animate-fade-in-up animation-delay-400 flex items-center gap-4">
                {SOCIAL_LINKS.map((social) => {
                  const Icon = iconMap[social.icon]
                  return (
                    <a
                      key={social.name}
                      href={social.url}
                      target={
                        social.url.startsWith('http') ? '_blank' : undefined
                      }
                      rel={
                        social.url.startsWith('http')
                          ? 'noopener noreferrer'
                          : undefined
                      }
                      className="rounded-md p-2 hover:bg-accent transition-colors"
                      aria-label={social.name}
                    >
                      <Icon className="size-5" />
                    </a>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div
            className="size-6 rounded-full border-2 flex items-center justify-center"
            style={{ borderColor: 'hsl(var(--primary) / 0.5)' }}
          >
            <div className="size-2 rounded-full bg-primary" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t bg-muted/20">
        <div className="container py-16 md:py-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What I Do Best
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Specializing in mobile app development with a focus on quality,
              performance, and user experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group rounded-lg border bg-card p-6 hover:shadow-lg transition-all">
              <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Smartphone className="size-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Mobile Development</h3>
              <p className="text-muted-foreground">
                Building native and cross-platform mobile applications for iOS
                and Android using modern frameworks and best practices.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group rounded-lg border bg-card p-6 hover:shadow-lg transition-all">
              <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Code className="size-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Clean Code</h3>
              <p className="text-muted-foreground">
                Writing maintainable, scalable, and well-documented code that
                follows industry standards and best practices.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group rounded-lg border bg-card p-6 hover:shadow-lg transition-all">
              <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Zap className="size-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Performance</h3>
              <p className="text-muted-foreground">
                Optimizing applications for speed, efficiency, and smooth user
                experience across all devices and platforms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t">
        <div className="container py-16 md:py-24">
          <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Let's Build Something Amazing
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Have a project in mind? I'm always interested in hearing about new
              opportunities and challenges. Let's discuss how we can work
              together.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Start a Project
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 rounded-lg border bg-background px-6 py-3 text-sm font-medium hover:bg-accent transition-colors"
              >
                View Portfolio
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
