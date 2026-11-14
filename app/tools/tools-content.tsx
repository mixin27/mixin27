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
  Users,
  DatabaseBackup,
  Repeat,
  BarChart3,
} from "lucide-react"
import { SectionLabel } from "@/components/ui/section-label"
import { RecurringDueBanner } from "@/components/tools/RecurringDueBanner"
import { ToolsDashboard } from "@/components/tools/ToolsDashboard"

const tools = [
  {
    name: "Clients",
    description: "Keep client details in one place and see what each one owes",
    icon: Users,
    href: "/tools/clients",
  },
  {
    name: "Invoices",
    description: "Create and manage professional invoices for your clients",
    icon: FileText,
    href: "/tools/invoices",
  },
  {
    name: "Recurring Invoices",
    description: "Set up retainers and subscriptions once, then generate each invoice in one click",
    icon: Repeat,
    href: "/tools/invoices/recurring",
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
    name: "Reports",
    description: "Invoices, payments received and unpaid balances by age, with CSV export",
    icon: BarChart3,
    href: "/tools/reports",
  },
  {
    name: "Backup & Restore",
    description: "Back up your data to Google Drive or a file, and restore it on any device",
    icon: DatabaseBackup,
    href: "/tools/backup",
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
    description: "Your data stays in your browser. Optional backups go to your own Google Drive, never to our servers.",
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
          <SectionLabel className="mb-4">Free web app</SectionLabel>
          <h1 className="mb-4 text-4xl md:text-5xl font-bold tracking-tight">
            KZT Freelance Tools
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
            KZT Freelance Tools helps freelancers and small businesses run the
            paperwork side of their work: create quotations, turn them into
            invoices (including split payments), record payments and receipts,
            manage clients, and keep contracts and timesheets. It&apos;s free,
            needs no account, and keeps your data in your own browser.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            <a href="#about" className="text-purple-400 hover:underline">How it works and how your data is handled</a>
            {" · "}
            <Link href="/legal/privacy#freelance-tools" className="text-purple-400 hover:underline">Privacy Policy</Link>
            {" · "}
            <Link href="/legal/terms" className="text-purple-400 hover:underline">Terms</Link>
          </p>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="mx-auto max-w-7xl px-6 py-20">
        <RecurringDueBanner className="mb-6" />
        <ToolsDashboard />
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

      {/* About the app and Google data (public, for users and Google's OAuth review) */}
      <section id="about" className="scroll-mt-24 border-t border-border/70 py-20">
        <div className="mx-auto max-w-3xl px-6 space-y-10">
          <div>
            <SectionLabel className="mb-4">About this app</SectionLabel>
            <h2 className="mb-4 text-3xl font-bold">How KZT Freelance Tools works</h2>
            <p className="leading-relaxed text-muted-foreground">
              KZT Freelance Tools is made by Kyaw Zayar Tun and runs entirely in
              your web browser. Anyone can use it without signing up. Everything
              you create &mdash; clients, quotations, invoices, payments,
              receipts, contracts, timesheets and resumes &mdash; is saved in
              your browser&apos;s local storage on your device. It is not sent to
              or stored on our servers.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-xl font-semibold">Optional Google Drive backup</h3>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              Because your data lives in one browser, you can choose to back it
              up to your own Google Drive and restore it on another device. This
              is optional; the rest of the app works without a Google account.
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                When you click <strong>Connect Google Drive</strong> on the{" "}
                <Link href="/tools/backup" className="text-purple-400 hover:underline">Backup &amp; Restore</Link>{" "}
                page, Google asks you to allow access to the app&apos;s own
                hidden folder in your Drive (the <code>drive.appdata</code>{" "}
                permission).
              </li>
              <li>
                The app uses this only to save backup files of your Tools data,
                list them, restore them and delete them when you ask. It cannot
                see, open or change any of your other Drive files.
              </li>
              <li>
                It also reads your Google account email address from Drive to
                show which account is connected.
              </li>
              <li>
                Your Google data goes directly between your browser and Google.
                It is never sent to our servers, shared with anyone, sold, or
                used for advertising or to train AI models.
              </li>
              <li>
                Google&apos;s access token is kept only in memory while the tab is
                open. You can disconnect at any time on the Backup &amp; Restore
                page or at{" "}
                <a href="https://myaccount.google.com/permissions" className="text-purple-400 hover:underline" rel="noopener noreferrer" target="_blank">
                  myaccount.google.com/permissions
                </a>
                .
              </li>
            </ul>
          </div>

          <p className="text-sm text-muted-foreground">
            KZT Freelance Tools&apos; use and transfer of information received
            from Google APIs adheres to the{" "}
            <a
              href="https://developers.google.com/terms/api-services-user-data-policy"
              className="text-purple-400 hover:underline"
              rel="noopener noreferrer"
              target="_blank"
            >
              Google API Services User Data Policy
            </a>
            , including the Limited Use requirements. Read the full{" "}
            <Link href="/legal/privacy#freelance-tools" className="text-purple-400 hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  )
}
