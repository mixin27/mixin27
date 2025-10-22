import { Metadata } from 'next'
import Link from 'next/link'
import {
  FileText,
  FileCheck,
  FileSignature,
  Receipt,
  Clock,
  Settings,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Freelance Tools',
  description:
    'Professional tools for freelancers - invoices, quotations, contracts, and more.',
}

const tools = [
  {
    name: 'Invoices',
    description: 'Create and manage professional invoices for your clients',
    icon: FileText,
    href: '/tools/invoices',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-950',
    available: true,
  },
  {
    name: 'Quotations',
    description: 'Generate professional quotes and proposals',
    icon: FileCheck,
    href: '/tools/quotations',
    color: 'text-green-600',
    bgColor: 'bg-green-50 dark:bg-green-950',
    available: true,
  },
  {
    name: 'Contracts',
    description: 'Use pre-made contract templates for your services',
    icon: FileSignature,
    href: '/tools/contracts',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 dark:bg-purple-950',
    available: false,
  },
  {
    name: 'Receipts',
    description: 'Generate payment receipts for your clients',
    icon: Receipt,
    href: '/tools/receipts',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 dark:bg-orange-950',
    available: false,
  },
  {
    name: 'Time Tracking',
    description: 'Track billable hours and generate timesheets',
    icon: Clock,
    href: '/tools/timesheet',
    color: 'text-pink-600',
    bgColor: 'bg-pink-50 dark:bg-pink-950',
    available: false,
  },
  {
    name: 'Clients',
    description: 'Manage your client information',
    icon: Clock,
    href: '/tools/invoices/clients',
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50 dark:bg-cyan-950',
    available: true,
  },
  {
    name: 'Settings',
    description: 'Configure your business information and preferences',
    icon: Settings,
    href: '/tools/settings',
    color: 'text-gray-600',
    bgColor: 'bg-gray-50 dark:bg-gray-950',
    available: true,
  },
]

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="border-b bg-gradient-to-b from-background to-muted/20">
        <div className="container py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              Freelance Tools
            </h1>
            <p className="text-xl text-muted-foreground">
              Professional tools to manage your freelance business. Create
              invoices, quotations, contracts, and more - all free and private.
            </p>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => {
            const Icon = tool.icon
            const isAvailable = tool.available

            return (
              <Link
                key={tool.name}
                href={isAvailable ? tool.href : '#'}
                className={`group relative rounded-lg border bg-card p-6 hover:shadow-lg transition-all ${
                  !isAvailable ? 'opacity-60 cursor-not-allowed' : ''
                }`}
                // onClick={(e) => !isAvailable && e.preventDefault()}
              >
                {/* Icon */}
                <div
                  className={`size-12 rounded-lg ${tool.bgColor} flex items-center justify-center mb-4`}
                >
                  <Icon className={`size-6 ${tool.color}`} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {tool.name}
                  {!isAvailable && (
                    <span className="ml-2 text-xs font-normal text-muted-foreground">
                      (Coming Soon)
                    </span>
                  )}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {tool.description}
                </p>

                {/* Arrow */}
                {isAvailable && (
                  <div className="mt-4 inline-flex items-center text-sm text-primary">
                    Open Tool
                    <svg
                      className="ml-1 size-4 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                )}
              </Link>
            )
          })}
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t bg-muted/20">
        <div className="container py-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Why Use These Tools?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-primary font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">100% Free</h3>
                  <p className="text-sm text-muted-foreground">
                    No subscriptions, no hidden fees. All tools are completely
                    free.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-primary font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Privacy First</h3>
                  <p className="text-sm text-muted-foreground">
                    All data stored locally in your browser. No cloud, no
                    tracking.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-primary font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Professional</h3>
                  <p className="text-sm text-muted-foreground">
                    Beautiful, print-ready documents that look professional.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-primary font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Easy to Use</h3>
                  <p className="text-sm text-muted-foreground">
                    Simple interface, generate documents in minutes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
