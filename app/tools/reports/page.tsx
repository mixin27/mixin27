"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Download } from "lucide-react"
import { ToolsPageHeader } from "@/components/tools/ClientForm"
import { SearchParamsWrapper } from "@/components/search-params-wrapper"
import { getClients, getInvoices, getReceipts } from "@/lib/storage/tools-storage"
import {
  AGING_BUCKETS,
  RANGE_LABELS,
  agingReport,
  currenciesInUse,
  inRange,
  invoiceRows,
  paymentEvents,
  rangeFor,
  type RangePreset,
} from "@/lib/tools/reports"
import { paymentMethodLabel } from "@/lib/tools/payments"
import { downloadCsv, toCsv } from "@/lib/tools/csv"
import { formatMoney, roundMoney } from "@/lib/tools/totals"
import type { Client, Invoice, Payment, Receipt } from "@/types/invoice"

type View = "invoices" | "payments" | "aging"
const VIEWS: { key: View; label: string }[] = [
  { key: "invoices", label: "Invoices" },
  { key: "payments", label: "Payments received" },
  { key: "aging", label: "Unpaid by age" },
]

const controlClass = "rounded-xl border border-border bg-background/80 px-3 py-2 text-sm outline-none focus:border-purple-500/50"
const thClass = "px-3 py-2 font-medium whitespace-nowrap"
const tdClass = "px-3 py-2 whitespace-nowrap"

function Reports() {
  const router = useRouter()
  const params = useSearchParams()
  const view = (VIEWS.some((v) => v.key === params.get("view")) ? params.get("view") : "invoices") as View
  const today = new Date().toISOString().slice(0, 10)

  const [data, setData] = useState<{ invoices: Invoice[]; receipts: Receipt[]; clients: Client[] } | null>(null)
  const [preset, setPreset] = useState<RangePreset>("this_year")
  const [custom, setCustom] = useState(() => rangeFor("this_year", today))
  const [clientId, setClientId] = useState("")
  const [currency, setCurrency] = useState("")

  useEffect(() => {
    Promise.all([getInvoices(), getReceipts(), getClients()]).then(([invoices, receipts, clients]) => {
      setData({ invoices, receipts, clients })
      setCurrency((c) => c || currenciesInUse(invoices, receipts)[0] || "USD")
    })
  }, [])

  const range = preset === "custom" ? custom : rangeFor(preset, today)
  const currencies = useMemo(() => (data ? currenciesInUse(data.invoices, data.receipts) : []), [data])
  const money = (v: number) => formatMoney(v, currency)
  const forClient = (id?: string) => !clientId || id === clientId

  const rows = useMemo(() => {
    if (!data) return []
    return invoiceRows(data.invoices, data.receipts, today)
      .filter((r) => r.invoice.currency.toUpperCase() === currency)
      .filter((r) => forClient(r.invoice.clientId ?? r.invoice.client.id))
      .sort((a, b) => b.invoice.issueDate.localeCompare(a.invoice.issueDate))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, currency, clientId, today])

  const invoiceList = rows.filter((r) => inRange(r.invoice.issueDate, range.from, range.to))
  const payments = useMemo(
    () =>
      data
        ? paymentEvents(data.invoices, data.receipts).filter(
            (e) => e.currency === currency && forClient(e.clientId) && inRange(e.date, range.from, range.to),
          )
        : [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, currency, clientId, range.from, range.to],
  )
  const aging = agingReport(rows, currency)

  const sum = (values: number[]) => roundMoney(values.reduce((s, v) => s + v, 0), currency)
  const rangeText = range.from || range.to ? `${range.from || "start"} to ${range.to || "today"}` : "all-time"
  const fileSuffix = `${currency}-${range.from || "all"}-${range.to || today}`.toLowerCase()

  const exportCsv = () => {
    if (view === "invoices") {
      downloadCsv(
        `invoices-${fileSuffix}.csv`,
        toCsv(
          ["Invoice", "Client", "Issue date", "Due date", "Status", "Currency", "Total", "Paid", "Balance"],
          invoiceList.map((r) => [
            r.invoice.invoiceNumber, r.invoice.client.name, r.invoice.issueDate, r.invoice.dueDate,
            r.status.replace(/_/g, " "), currency, r.invoice.total, r.paid, r.balance,
          ]),
        ),
      )
    } else if (view === "payments") {
      downloadCsv(
        `payments-${fileSuffix}.csv`,
        toCsv(
          ["Date", "Client", "Invoice", "Receipt", "Method", "Currency", "Amount"],
          payments.map((p) => [
            p.date, p.clientName, p.invoiceNumber ?? "", p.receiptNumber ?? "",
            p.method ? paymentMethodLabel(p.method as Payment["method"]) : p.source === "marked_paid" ? "Marked paid" : "",
            currency, p.amount,
          ]),
        ),
      )
    } else {
      downloadCsv(
        `unpaid-by-age-${currency.toLowerCase()}-${today}.csv`,
        toCsv(
          ["Client", ...AGING_BUCKETS, "Total"],
          [...aging.clients.map((c) => [c.name, ...c.buckets, c.total]), ["Total", ...aging.totals, aging.total]],
        ),
      )
    }
  }

  const setView = (v: View) => router.replace(`/tools/reports?view=${v}`, { scroll: false })

  return (
    <>
      <ToolsPageHeader
        backHref="/tools"
        backLabel="Back to Tools"
        title="Reports"
        subtitle="Invoices, payments received and unpaid balances. Amounts are shown one currency at a time."
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 md:py-16 space-y-6">
        <div role="tablist" aria-label="Report" className="flex gap-1 overflow-x-auto border-b border-border">
          {VIEWS.map((v) => (
            <button
              key={v.key}
              role="tab"
              type="button"
              aria-selected={view === v.key}
              onClick={() => setView(v.key)}
              className={`shrink-0 border-b-2 px-4 py-3 text-sm font-medium ${
                view === v.key ? "border-purple-500 text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-end gap-3">
          {view !== "aging" && (
            <label className="text-xs text-muted-foreground">
              Period
              <select className={`${controlClass} mt-1 block`} value={preset} onChange={(e) => setPreset(e.target.value as RangePreset)}>
                {(Object.keys(RANGE_LABELS) as RangePreset[]).map((p) => (
                  <option key={p} value={p}>{RANGE_LABELS[p]}</option>
                ))}
              </select>
            </label>
          )}
          {view !== "aging" && preset === "custom" && (
            <>
              <label className="text-xs text-muted-foreground">
                From
                <input type="date" className={`${controlClass} mt-1 block`} value={custom.from} onChange={(e) => setCustom((c) => ({ ...c, from: e.target.value }))} />
              </label>
              <label className="text-xs text-muted-foreground">
                To
                <input type="date" className={`${controlClass} mt-1 block`} value={custom.to} onChange={(e) => setCustom((c) => ({ ...c, to: e.target.value }))} />
              </label>
            </>
          )}
          <label className="text-xs text-muted-foreground">
            Client
            <select className={`${controlClass} mt-1 block max-w-[14rem]`} value={clientId} onChange={(e) => setClientId(e.target.value)}>
              <option value="">All clients</option>
              {(data?.clients ?? []).slice().sort((a, b) => a.name.localeCompare(b.name)).map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </label>
          {currencies.length > 1 && (
            <label className="text-xs text-muted-foreground">
              Currency
              <select className={`${controlClass} mt-1 block`} value={currency} onChange={(e) => setCurrency(e.target.value)}>
                {currencies.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
          )}
          <button
            type="button"
            onClick={exportCsv}
            disabled={!data}
            className="ml-auto inline-flex items-center gap-2 rounded-xl border border-border bg-card/60 px-4 py-2 text-sm font-semibold hover:bg-card disabled:opacity-50"
          >
            <Download className="size-4" />
            Export CSV
          </button>
        </div>

        {!data ? (
          <p className="py-16 text-center text-muted-foreground">Loading…</p>
        ) : view === "invoices" ? (
          <section aria-label="Invoices">
            <p className="mb-3 text-sm text-muted-foreground">
              {invoiceList.length} invoice{invoiceList.length === 1 ? "" : "s"} issued, {rangeText}. Drafts and cancelled invoices are listed but not totalled.
            </p>
            <div className="overflow-x-auto rounded-2xl border border-border bg-card/60">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-left text-xs text-muted-foreground">
                  <tr>
                    <th className={thClass}>Invoice</th>
                    <th className={thClass}>Client</th>
                    <th className={thClass}>Issued</th>
                    <th className={thClass}>Due</th>
                    <th className={thClass}>Status</th>
                    <th className={`${thClass} text-right`}>Total</th>
                    <th className={`${thClass} text-right`}>Paid</th>
                    <th className={`${thClass} text-right`}>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceList.map((r) => (
                    <tr key={r.invoice.id} className="border-t border-border/60">
                      <td className={tdClass}><Link href={`/tools/invoices/${r.invoice.id}`} className="font-medium hover:text-purple-400">{r.invoice.invoiceNumber}</Link></td>
                      <td className={tdClass}>{r.invoice.client.name}</td>
                      <td className={tdClass}>{r.invoice.issueDate}</td>
                      <td className={tdClass}>{r.invoice.dueDate}</td>
                      <td className={`${tdClass} capitalize`}>{r.status.replace(/_/g, " ")}</td>
                      <td className={`${tdClass} text-right tabular-nums`}>{money(r.invoice.total)}</td>
                      <td className={`${tdClass} text-right tabular-nums`}>{money(r.paid)}</td>
                      <td className={`${tdClass} text-right tabular-nums`}>{money(r.balance)}</td>
                    </tr>
                  ))}
                  {invoiceList.length === 0 && (
                    <tr><td colSpan={8} className="px-3 py-8 text-center text-muted-foreground">No invoices in this period.</td></tr>
                  )}
                </tbody>
                {invoiceList.length > 0 && (() => {
                  const billed = invoiceList.filter((r) => r.status !== "draft" && r.status !== "cancelled")
                  return (
                    <tfoot className="border-t border-border font-semibold">
                      <tr>
                        <td className={tdClass} colSpan={5}>Total billed ({currency})</td>
                        <td className={`${tdClass} text-right tabular-nums`}>{money(sum(billed.map((r) => r.invoice.total)))}</td>
                        <td className={`${tdClass} text-right tabular-nums`}>{money(sum(billed.map((r) => r.paid)))}</td>
                        <td className={`${tdClass} text-right tabular-nums`}>{money(sum(billed.map((r) => r.balance)))}</td>
                      </tr>
                    </tfoot>
                  )
                })()}
              </table>
            </div>
          </section>
        ) : view === "payments" ? (
          <section aria-label="Payments received">
            <p className="mb-3 text-sm text-muted-foreground">
              {payments.length} payment{payments.length === 1 ? "" : "s"} received, {rangeText}.
            </p>
            <div className="overflow-x-auto rounded-2xl border border-border bg-card/60">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-left text-xs text-muted-foreground">
                  <tr>
                    <th className={thClass}>Date</th>
                    <th className={thClass}>Client</th>
                    <th className={thClass}>Invoice</th>
                    <th className={thClass}>Receipt</th>
                    <th className={thClass}>Method</th>
                    <th className={`${thClass} text-right`}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p, i) => (
                    <tr key={`${p.date}-${p.invoiceId ?? ""}-${p.receiptNumber ?? ""}-${i}`} className="border-t border-border/60">
                      <td className={tdClass}>{p.date}</td>
                      <td className={tdClass}>{p.clientName}</td>
                      <td className={tdClass}>
                        {p.invoiceId ? <Link href={`/tools/invoices/${p.invoiceId}`} className="hover:text-purple-400">{p.invoiceNumber}</Link> : (p.invoiceNumber ?? "—")}
                      </td>
                      <td className={tdClass}>{p.receiptNumber ?? "—"}</td>
                      <td className={tdClass}>
                        {p.method ? paymentMethodLabel(p.method as Payment["method"]) : p.source === "marked_paid" ? "Marked paid" : "—"}
                      </td>
                      <td className={`${tdClass} text-right tabular-nums`}>{money(p.amount)}</td>
                    </tr>
                  ))}
                  {payments.length === 0 && (
                    <tr><td colSpan={6} className="px-3 py-8 text-center text-muted-foreground">No payments in this period.</td></tr>
                  )}
                </tbody>
                {payments.length > 0 && (
                  <tfoot className="border-t border-border font-semibold">
                    <tr>
                      <td className={tdClass} colSpan={5}>Total received ({currency})</td>
                      <td className={`${tdClass} text-right tabular-nums`}>{money(sum(payments.map((p) => p.amount)))}</td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </section>
        ) : (
          <section aria-label="Unpaid by age">
            <p className="mb-3 text-sm text-muted-foreground">
              What clients owe today, grouped by how long it has been overdue. Based on sent invoices in {currency}.
            </p>
            <div className="overflow-x-auto rounded-2xl border border-border bg-card/60">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-left text-xs text-muted-foreground">
                  <tr>
                    <th className={thClass}>Client</th>
                    {AGING_BUCKETS.map((b) => <th key={b} className={`${thClass} text-right`}>{b}</th>)}
                    <th className={`${thClass} text-right`}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {aging.clients.map((c) => (
                    <tr key={c.clientId} className="border-t border-border/60">
                      <td className={tdClass}>
                        {data.clients.some((x) => x.id === c.clientId) ? (
                          <Link href={`/tools/clients/${c.clientId}`} className="hover:text-purple-400">{c.name}</Link>
                        ) : c.name}
                      </td>
                      {c.buckets.map((v, i) => (
                        <td key={i} className={`${tdClass} text-right tabular-nums ${v ? "" : "text-muted-foreground"}`}>{v ? money(v) : "—"}</td>
                      ))}
                      <td className={`${tdClass} text-right font-medium tabular-nums`}>{money(c.total)}</td>
                    </tr>
                  ))}
                  {aging.clients.length === 0 && (
                    <tr><td colSpan={AGING_BUCKETS.length + 2} className="px-3 py-8 text-center text-muted-foreground">Nothing is owed. 🎉</td></tr>
                  )}
                </tbody>
                {aging.clients.length > 0 && (
                  <tfoot className="border-t border-border font-semibold">
                    <tr>
                      <td className={tdClass}>Total ({currency})</td>
                      {aging.totals.map((v, i) => <td key={i} className={`${tdClass} text-right tabular-nums`}>{money(v)}</td>)}
                      <td className={`${tdClass} text-right tabular-nums`}>{money(aging.total)}</td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </section>
        )}
      </div>
    </>
  )
}

export default function ReportsPage() {
  return (
    <SearchParamsWrapper>
      <Reports />
    </SearchParamsWrapper>
  )
}
