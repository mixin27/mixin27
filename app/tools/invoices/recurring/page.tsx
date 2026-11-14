"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { CalendarClock, Edit, Loader2, Pause, Play, Plus, Repeat, Trash2, Zap } from "lucide-react"
import { ToolsPageHeader } from "@/components/tools/ClientForm"
import {
  deleteRecurringTemplate,
  getRecurringTemplates,
  saveRecurringTemplate,
} from "@/lib/storage/tools-storage"
import { generateAllDueRecurring, generateRecurringInvoices } from "@/lib/document-conversions"
import { INTERVAL_LABELS, dueDates, resumeFrom } from "@/lib/tools/recurring"
import { computeTotals, formatMoney } from "@/lib/tools/totals"
import type { RecurringTemplate } from "@/types/invoice"

const todayIso = () => new Date().toISOString().slice(0, 10)

function formatDate(iso: string) {
  const d = new Date(`${iso}T00:00:00`)
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
}

const ghostButton =
  "inline-flex items-center gap-2 rounded-xl border border-border bg-card/60 px-3 py-2 text-sm font-semibold transition-colors hover:bg-card disabled:opacity-50"

export default function RecurringPage() {
  const [templates, setTemplates] = useState<RecurringTemplate[] | null>(null)
  const [busy, setBusy] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const load = async () => {
    const list = await getRecurringTemplates()
    setTemplates(list.sort((a, b) => Number(b.active) - Number(a.active) || a.nextDate.localeCompare(b.nextDate)))
  }

  useEffect(() => {
    load()
  }, [])

  const today = todayIso()
  const due = (templates ?? []).map((t) => ({ t, dates: dueDates(t, today) })).filter((x) => x.dates.length)
  const dueCount = due.reduce((n, x) => n + x.dates.length, 0)

  const announce = (n: number) =>
    setNotice(
      n === 0
        ? "Nothing was due."
        : `Created ${n} draft invoice${n === 1 ? "" : "s"}. Review and send ${n === 1 ? "it" : "them"} from Invoices.`,
    )

  const generate = async (id: string) => {
    setBusy(id)
    try {
      announce((await generateRecurringInvoices(id)).length)
      await load()
    } finally {
      setBusy(null)
    }
  }

  const generateAll = async () => {
    setBusy("all")
    try {
      announce((await generateAllDueRecurring()).length)
      await load()
    } finally {
      setBusy(null)
    }
  }

  const toggle = async (t: RecurringTemplate) => {
    const now = new Date().toISOString()
    if (t.active) {
      await saveRecurringTemplate({ ...t, active: false, updatedAt: now })
    } else {
      // Don't create invoices for the time it was paused.
      await saveRecurringTemplate({ ...t, ...resumeFrom(t, todayIso()), active: true, updatedAt: now })
    }
    await load()
  }

  const remove = async (t: RecurringTemplate) => {
    if (!confirm(`Delete the recurring template “${t.name}”? Invoices already generated are kept.`)) return
    await deleteRecurringTemplate(t.id)
    await load()
  }

  return (
    <>
      <ToolsPageHeader
        backHref="/tools/invoices"
        backLabel="Back to Invoices"
        title="Recurring Invoices"
        subtitle="Templates for retainers and subscriptions. Due invoices are created as drafts when you generate them."
        actions={
          <Link
            href="/tools/invoices/recurring/new"
            className="inline-flex items-center gap-2 rounded-xl bg-purple-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-purple-400"
          >
            <Plus className="size-4" />
            New Template
          </Link>
        }
      />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12 md:py-16 space-y-6">
        {notice && (
          <div role="status" className="flex items-start justify-between gap-4 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-700 dark:text-green-300">
            <span>
              {notice}{" "}
              <Link href="/tools/invoices" className="font-semibold underline">Open Invoices</Link>
            </span>
            <button type="button" onClick={() => setNotice(null)} aria-label="Dismiss">×</button>
          </div>
        )}

        {dueCount > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4">
            <p className="flex items-center gap-2 text-sm text-amber-800 dark:text-amber-200">
              <CalendarClock className="size-4 shrink-0" />
              {dueCount} invoice{dueCount === 1 ? " is" : "s are"} due from {due.length} template{due.length === 1 ? "" : "s"}.
            </p>
            <button
              type="button"
              onClick={generateAll}
              disabled={!!busy}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-50"
            >
              {busy === "all" ? <Loader2 className="size-4 animate-spin" /> : <Zap className="size-4" />}
              Generate all due
            </button>
          </div>
        )}

        {templates === null ? (
          <p className="py-16 text-center text-muted-foreground">Loading…</p>
        ) : templates.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card/60 p-10 text-center shadow-sm">
            <Repeat className="mx-auto mb-4 size-10 text-muted-foreground" />
            <h2 className="mb-2 text-xl font-semibold">No recurring invoices yet</h2>
            <p className="mb-6 text-muted-foreground">
              Create a template, or open an invoice and choose “Make recurring”.
            </p>
            <Link href="/tools/invoices/recurring/new" className="inline-flex items-center gap-2 rounded-xl bg-purple-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-purple-400">
              <Plus className="size-4" />
              New Template
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {templates.map((t) => {
              const dates = dueDates(t, today)
              const total = computeTotals({ items: t.items, discount: t.discount, discountType: t.discountType, taxRate: t.taxRate, currency: t.currency }).total
              const ended = !t.active && !!t.endDate && t.nextDate > t.endDate
              return (
                <li key={t.id} className="rounded-2xl border border-border bg-card/60 p-4 sm:p-5 shadow-sm">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link href={`/tools/invoices/recurring/${t.id}`} className="font-semibold hover:text-purple-400">{t.name}</Link>
                        {!t.active && (
                          <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">{ended ? "Ended" : "Paused"}</span>
                        )}
                        {dates.length > 0 && (
                          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                            {dates.length} due
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {t.client.name} · {INTERVAL_LABELS[t.interval]} · {t.currency} {formatMoney(total, t.currency)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t.active ? `Next: ${formatDate(dates[0] ?? t.nextDate)}` : "Not generating"}
                        {t.endDate && ` · ends ${formatDate(t.endDate)}`}
                        {t.generatedCount > 0 && ` · ${t.generatedCount} generated`}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {dates.length > 0 && (
                        <button type="button" onClick={() => generate(t.id)} disabled={!!busy} className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50">
                          {busy === t.id ? <Loader2 className="size-4 animate-spin" /> : <Zap className="size-4" />}
                          Generate {dates.length}
                        </button>
                      )}
                      {!ended && (
                        <button type="button" onClick={() => toggle(t)} disabled={!!busy} className={ghostButton}>
                          {t.active ? <Pause className="size-4" /> : <Play className="size-4" />}
                          {t.active ? "Pause" : "Resume"}
                        </button>
                      )}
                      <Link href={`/tools/invoices/recurring/${t.id}`} className={ghostButton}>
                        <Edit className="size-4" />
                        Edit
                      </Link>
                      <button type="button" onClick={() => remove(t)} disabled={!!busy} aria-label={`Delete ${t.name}`} className={`${ghostButton} text-destructive hover:bg-destructive/10`}>
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </>
  )
}
