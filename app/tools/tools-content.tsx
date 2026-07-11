"use client"

import Link from "next/link"
import {
  FileText,
  FileCheck,
  FileSignature,
  Receipt,
  Clock,
  Settings,
  Calculator,
} from "lucide-react"
import { SectionLabel } from "@/components/ui/section-label"

const tools = [
  {
    name: "Invoices",
    description: "Create and manage professional invoices for your clients",
    icon: FileText,
    href: "/tools/invoices",
  },
  {
    name: "Quotations",
    description: "Generate professional quotes and proposals",
    icon: FileCheck,
    href: "/tools/quotations",
  },
  {
    name: "Receipts",
    description: "Generate payment receipts for your clients",
    icon: Receipt,
    href: "/tools/receipts",
  },
  {
    name: "Contracts",
    description: "Use pre-made contract templates for your services",
    icon: FileSignature,
    href: "/tools/contracts",
  },
  {
    name: "Resumes",
    description: "Create and manage professional Resumes/CV",
    icon: FileText,
    href: "/tools/resumes",
  },
  {
    name: "Fee Calculator",
    description: "Estimate project pricing with templates and day rates",
    icon: Calculator,
    href: "/tools/pricing-calculator",
  },
  {
    name: "Time Tracking",
    description: "Track billable hours and generate timesheets",
    icon: Clock,
    href: "/tools/timesheet",
  },
  {
    name: "Settings",
    description: "Configure your business information and preferences",
    icon: Settings,
    href: "/tools/settings",
  },
]

const features = [
  {
    title: "100% Free",
    description: "No subscriptions, no hidden fees. All tools are completely free.",
  },
  {
    title: "Privacy First",
    description: "All data stored locally in your browser. No cloud, no tracking.",
  },
  {
    title: "Professional",
    description: "Beautiful, print-ready documents that look professional.",
  },
  {
    title: "Easy to Use",
    description: "Simple interface, generate documents in minutes.",
  },
]

export default function ToolsContent() {
  return (
    <>
      {/* Header */}
      <div className="relative border-b border-border/70 pt-32 pb-20">
        <div
          className="pointer-events-none absolute -top-10 right-0 size-[500px] rounded-full bg-purple-500/8 blur-[120px]"
          aria-hidden="true"
        />
        <div className="mx-auto max-w-7xl px-6">
          <SectionLabel className="mb-4">Tools</SectionLabel>
          <h1 className="mb-4 text-5xl font-bold tracking-tight">
            Freelance Tools
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
            Professional tools to manage your freelance business. Create
            invoices, quotations, contracts, and more &mdash; all free and
            private.
          </p>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => {
            const Icon = tool.icon
            return (
              <Link
                key={tool.name}
                href={tool.href}
                className="group rounded-2xl border border-border bg-card/60 p-6 shadow-sm transition-all hover:border-purple-500/25 hover:bg-card"
              >
                <span className="mb-4 flex size-10 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
                  <Icon className="size-5" />
                </span>
                <h3 className="mb-1.5 text-sm font-semibold text-foreground group-hover:text-purple-300 transition-colors">
                  {tool.name}
                </h3>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {tool.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 font-mono text-[11px] tracking-widest text-purple-400 uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                  Open
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </span>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Features */}
      <section className="border-t border-border/70 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <SectionLabel className="mb-4">Why Use These Tools</SectionLabel>
          <h2 className="mb-12 text-3xl font-bold">Everything You Need</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {features.map((f) => (
              <div
                key={f.title}
                className="flex items-start gap-4 rounded-2xl border border-border bg-card/60 p-6 shadow-sm"
              >
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-purple-500/10">
                  <span className="text-sm text-purple-400">✓</span>
                </span>
                <div>
                  <h3 className="mb-1 font-semibold text-foreground">
                    {f.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {f.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
