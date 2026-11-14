"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { AlertTriangle, BarChart3, CalendarClock, FileCheck, Wallet } from "lucide-react"
import { getInvoices, getQuotations, getReceipts } from "@/lib/storage/tools-storage"
import { buildDashboard, currenciesInUse } from "@/lib/tools/reports"
import { formatMoney } from "@/lib/tools/totals"
import type { Invoice, Quotation, Receipt } from "@/types/invoice"
import { RevenueChart } from "./RevenueChart"

const CURRENCY_PREF = "tools_dashboard_currency"

function readPref(): string | null {
  try {
    return localStorage.getItem(CURRENCY_PREF)
  } catch {
    return null
  }
}
function writePref(value: string) {
  try {
    localStorage.setItem(CURRENCY_PREF, value)
  } catch {
    /* ignore */
  }
}

function shortDate(iso: string) {
  const d = new Date(`${iso}T00:00:00`)
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString(undefined, { month: "short", day: "numeric" })
}

/** Business overview shown at the top of /tools once there is something to show. */
export function ToolsDashboard() {
  const [data, setData] = useState<{ invoices: Invoice[]; receipts: Receipt[]; quotations: Quotation[] } | null>(null)
  const [currency, setCurrency] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([getInvoices(), getReceipts(), getQuotations()]).then(([invoices, receipts, quotations]) => {
      setData({ invoices, receipts, quotations })
      const currencies = currenciesInUse(invoices, receipts)
      const pref = readPref()
      setCurrency(pref && currencies.includes(pref) ? pref : (currencies[0] ?? null))
    })
  }, [])

  const today = new Date().toISOString().slice(0, 10)
  const currencies = useMemo(() => (data ? currenciesInUse(data.invoices, data.receipts) : []), [data])
  const dash = useMemo(() => (data && currency ? buildDashboard(data, currency, today) : null), [data, currency, today])

  if (!data || !currency || !dash || data.invoices.length + data.quotations.length === 0) return null

  const money = (v: number) => formatMoney(v, dash.currency)
  const change = dash.paidLastMonth > 0 ? Math.round(((dash.paidThisMonth - dash.paidLastMonth) / dash.paidLastMonth) * 100) : null

  const tiles = [
    {
      label: "Outstanding",
      value: money(dash.outstanding),
      sub: `${dash.outstandingCount} unpaid invoice${dash.outstandingCount === 1 ? "" : "s"}`,
      icon: Wallet,
      href: "/tools/invoices",
    },
    {
      label: "Overdue",
      value: money(dash.overdue),
      sub: dash.overdueCount ? `${dash.overdueCount} past due date` : "Nothing overdue",
      icon: AlertTriangle,
      warn: dash.overdueCount > 0,
      href: "/tools/reports?view=aging",
    },
    {
      label: "Received this month",
      value: money(dash.paidThisMonth),
      sub:
        change === null
          ? "No payments last month"
          : `${change >= 0 ? "+" : "−"}${Math.abs(change)}% vs last month`,
      icon: BarChart3,
      href: "/tools/reports?view=payments",
    },
    {
      label: "Open quotations",
      value: money(dash.openQuotations),
      sub: `${dash.openQuotationsCount} awaiting invoice`,
      icon: FileCheck,
      href: "/tools/quotations",
    },
  ]

  return (
    <section aria-labelledby="dashboard-title" className="mb-10 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="dashboard-title" className="text-xl font-semibold">Overview</h2>
        <div className="flex items-center gap-3">
          {currencies.length > 1 && (
            <select
              aria-label="Currency"
              value={currency}
              onChange={(e) => {
                setCurrency(e.target.value)
                writePref(e.target.value)
              }}
              className="rounded-lg border border-border bg-background/80 px-3 py-1.5 text-sm"
            >
              {currencies.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          )}
          <Link href="/tools/reports" className="text-sm font-semibold text-purple-500 hover:underline">
            Reports →
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {tiles.map((t) => (
          <Link key={t.label} href={t.href} className="rounded-2xl border border-border bg-card/60 p-4 shadow-sm transition-colors hover:border-purple-500/30">
            <p className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
              <t.icon className={`size-3.5 ${t.warn ? "text-red-500" : ""}`} aria-hidden="true" />
              {t.label}
            </p>
            <p className="text-lg sm:text-2xl font-semibold tabular-nums break-all">
              <span className="mr-1 text-xs font-normal text-muted-foreground">{dash.currency}</span>
              {t.value}
            </p>
            <p className={`mt-1 text-xs ${t.warn ? "text-red-600 dark:text-red-400" : "text-muted-foreground"}`}>{t.sub}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card/60 p-4 sm:p-5 shadow-sm">
          <RevenueChart data={dash.revenue} currency={dash.currency} />
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card/60 p-4 shadow-sm">
            <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold">
              <AlertTriangle className="size-4 text-red-500" aria-hidden="true" />
              Overdue invoices
            </h3>
            {dash.overdueInvoices.length === 0 ? (
              <p className="text-sm text-muted-foreground">None. Nice.</p>
            ) : (
              <ul className="space-y-1.5 text-sm">
                {dash.overdueInvoices.map((r) => (
                  <li key={r.invoice.id}>
                    <Link href={`/tools/invoices/${r.invoice.id}`} className="flex items-baseline gap-2 hover:text-purple-400">
                      <span className="truncate">{r.invoice.client.name}</span>
                      <span className="shrink-0 text-xs text-muted-foreground">{r.daysOverdue}d</span>
                      <span className="ml-auto shrink-0 tabular-nums">{money(r.balance)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {dash.expiringQuotations.length > 0 && (
            <div className="rounded-2xl border border-border bg-card/60 p-4 shadow-sm">
              <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                <CalendarClock className="size-4 text-amber-500" aria-hidden="true" />
                Quotations expiring this week
              </h3>
              <ul className="space-y-1.5 text-sm">
                {dash.expiringQuotations.map((q) => (
                  <li key={q.id}>
                    <Link href={`/tools/quotations/${q.id}`} className="flex items-baseline gap-2 hover:text-purple-400">
                      <span className="truncate">{q.client.name}</span>
                      <span className="shrink-0 text-xs text-muted-foreground">{shortDate(q.validUntil)}</span>
                      <span className="ml-auto shrink-0 tabular-nums">{money(q.total)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="rounded-2xl border border-border bg-card/60 p-4 shadow-sm">
            <h3 className="mb-2 text-sm font-semibold">Top clients · last 12 months</h3>
            {dash.topClients.length === 0 ? (
              <p className="text-sm text-muted-foreground">No payments yet.</p>
            ) : (
              <ol className="space-y-1.5 text-sm">
                {dash.topClients.map((c) => (
                  <li key={c.clientId || c.name}>
                    <Link href={c.clientId ? `/tools/clients/${c.clientId}` : "/tools/clients"} className="flex items-baseline gap-2 hover:text-purple-400">
                      <span className="truncate">{c.name}</span>
                      <span className="ml-auto shrink-0 tabular-nums">{money(c.amount)}</span>
                    </Link>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
