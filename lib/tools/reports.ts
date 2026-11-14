// Dashboard and report numbers. Pure functions; nothing is converted between
// currencies, so every figure is for one currency at a time.
import type { Client, Invoice, Quotation, Receipt } from "@/types/invoice"
import { addDays } from "./split"
import { deriveInvoiceStatus, invoicePaidAmount } from "./payments"
import { roundMoney } from "./totals"

export interface PaymentEvent {
  date: string
  amount: number
  currency: string
  clientId?: string
  clientName: string
  invoiceId?: string
  invoiceNumber?: string
  receiptNumber?: string
  method?: string
  source: "payment" | "receipt" | "marked_paid"
}

const docClientId = (d: { clientId?: string; client?: Client }) => d.clientId ?? d.client?.id
const upper = (c: string) => (c || "USD").toUpperCase()

/** Currencies used by invoices and receipts, most used first. */
export function currenciesInUse(invoices: Invoice[], receipts: Receipt[]): string[] {
  const counts = new Map<string, number>()
  for (const d of [...invoices, ...receipts]) counts.set(upper(d.currency), (counts.get(upper(d.currency)) ?? 0) + 1)
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([c]) => c)
}

/**
 * Every payment received, with its date: recorded invoice payments, receipts
 * not tied to a recorded payment, and the unrecorded remainder of invoices
 * that were simply marked paid (dated when the invoice was last updated).
 */
export function paymentEvents(invoices: Invoice[], receipts: Receipt[]): PaymentEvent[] {
  const events: PaymentEvent[] = []
  const invoicesById = new Map(invoices.map((i) => [i.id, i]))
  const receiptsById = new Map(receipts.map((r) => [r.id, r]))

  for (const inv of invoices) {
    for (const p of inv.payments ?? []) {
      events.push({
        date: p.date,
        amount: p.amount,
        currency: upper(inv.currency),
        clientId: docClientId(inv),
        clientName: inv.client.name,
        invoiceId: inv.id,
        invoiceNumber: inv.invoiceNumber,
        receiptNumber: p.receiptId ? receiptsById.get(p.receiptId)?.receiptNumber : undefined,
        method: p.method,
        source: "payment",
      })
    }
  }

  for (const r of receipts) {
    if (r.paymentId && r.invoiceId && invoicesById.get(r.invoiceId)?.payments?.some((p) => p.id === r.paymentId)) continue
    const inv = r.invoiceId ? invoicesById.get(r.invoiceId) : undefined
    events.push({
      date: r.paymentDate,
      amount: r.amountPaid,
      currency: upper(r.currency),
      clientId: docClientId(r),
      clientName: r.client.name,
      invoiceId: inv?.id,
      invoiceNumber: inv?.invoiceNumber ?? r.relatedInvoiceNumber,
      receiptNumber: r.receiptNumber,
      method: r.paymentMethod,
      source: "receipt",
    })
  }

  // Invoices set to "paid" by hand with no payment records for the rest.
  for (const inv of invoices) {
    if (inv.status !== "paid") continue
    const own = receipts.filter((r) => r.invoiceId === inv.id && !r.paymentId)
    const recorded =
      (inv.payments ?? []).reduce((s, p) => s + p.amount, 0) + own.reduce((s, r) => s + r.amountPaid, 0)
    const missing = roundMoney(inv.total - recorded, inv.currency)
    if (missing > 0) {
      events.push({
        date: (inv.updatedAt || inv.issueDate).slice(0, 10),
        amount: missing,
        currency: upper(inv.currency),
        clientId: docClientId(inv),
        clientName: inv.client.name,
        invoiceId: inv.id,
        invoiceNumber: inv.invoiceNumber,
        source: "marked_paid",
      })
    }
  }

  return events.sort((a, b) => b.date.localeCompare(a.date))
}

export interface InvoiceRow {
  invoice: Invoice
  status: Invoice["status"]
  paid: number
  balance: number
  daysOverdue: number
}

const daysBetween = (from: string, to: string) =>
  Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86_400_000)

export function invoiceRows(invoices: Invoice[], receipts: Receipt[], today: string): InvoiceRow[] {
  return invoices.map((invoice) => {
    const paid = invoicePaidAmount(invoice, receipts)
    const balance = roundMoney(invoice.total - paid, invoice.currency)
    const status = deriveInvoiceStatus(invoice, receipts, today)
    return {
      invoice,
      status,
      paid,
      balance,
      daysOverdue: status === "overdue" ? Math.max(0, daysBetween(invoice.dueDate, today)) : 0,
    }
  })
}

const isBilled = (s: Invoice["status"]) => s !== "draft" && s !== "cancelled"

export interface MonthTotal {
  /** YYYY-MM */
  month: string
  amount: number
}

/** The last `count` calendar months ending with today's month, oldest first. */
export function lastMonths(today: string, count = 12): string[] {
  const [y, m] = today.split("-").map(Number)
  return Array.from({ length: count }, (_, i) => {
    const total = y * 12 + (m - 1) - (count - 1 - i)
    return `${Math.floor(total / 12)}-${String((total % 12) + 1).padStart(2, "0")}`
  })
}

export function revenueByMonth(events: PaymentEvent[], currency: string, today: string, count = 12): MonthTotal[] {
  const months = lastMonths(today, count)
  const totals = new Map(months.map((m) => [m, 0]))
  for (const e of events) {
    if (e.currency !== currency) continue
    const key = e.date.slice(0, 7)
    if (totals.has(key)) totals.set(key, totals.get(key)! + e.amount)
  }
  return months.map((month) => ({ month, amount: roundMoney(totals.get(month)!, currency) }))
}

export interface DashboardData {
  currency: string
  outstanding: number
  outstandingCount: number
  overdue: number
  overdueCount: number
  paidThisMonth: number
  paidLastMonth: number
  openQuotations: number
  openQuotationsCount: number
  revenue: MonthTotal[]
  overdueInvoices: InvoiceRow[]
  expiringQuotations: Quotation[]
  topClients: { clientId: string; name: string; amount: number }[]
}

/** An open quotation: sent or accepted, not expired, and not invoiced yet. */
export function isOpenQuotation(q: Quotation, today: string): boolean {
  if (q.status !== "sent" && q.status !== "accepted") return false
  if (q.invoiceIds?.length) return false
  return q.status === "accepted" || !q.validUntil || q.validUntil >= today
}

export function buildDashboard(
  input: { invoices: Invoice[]; receipts: Receipt[]; quotations: Quotation[] },
  currency: string,
  today: string,
): DashboardData {
  const cur = upper(currency)
  const rows = invoiceRows(input.invoices.filter((i) => upper(i.currency) === cur), input.receipts, today).filter((r) =>
    isBilled(r.status),
  )
  const open = rows.filter((r) => r.balance > 0)
  const overdue = open.filter((r) => r.status === "overdue").sort((a, b) => b.daysOverdue - a.daysOverdue)
  const events = paymentEvents(input.invoices, input.receipts).filter((e) => e.currency === cur)
  const [lastMonth, thisMonth] = lastMonths(today, 2)
  const sumMonth = (m: string) => roundMoney(events.filter((e) => e.date.startsWith(m)).reduce((s, e) => s + e.amount, 0), cur)

  const quotations = input.quotations.filter((q) => upper(q.currency) === cur && isOpenQuotation(q, today))
  const soon = addDays(today, 7)
  const expiring = input.quotations
    .filter((q) => upper(q.currency) === cur && q.status === "sent" && !q.invoiceIds?.length && q.validUntil >= today && q.validUntil <= soon)
    .sort((a, b) => a.validUntil.localeCompare(b.validUntil))

  const byClient = new Map<string, { clientId: string; name: string; amount: number }>()
  const yearAgo = lastMonths(today, 12)[0]
  for (const e of events) {
    if (e.date.slice(0, 7) < yearAgo) continue
    const key = e.clientId ?? e.clientName
    const entry = byClient.get(key) ?? { clientId: e.clientId ?? "", name: e.clientName, amount: 0 }
    entry.amount = roundMoney(entry.amount + e.amount, cur)
    byClient.set(key, entry)
  }

  return {
    currency: cur,
    outstanding: roundMoney(open.reduce((s, r) => s + r.balance, 0), cur),
    outstandingCount: open.length,
    overdue: roundMoney(overdue.reduce((s, r) => s + r.balance, 0), cur),
    overdueCount: overdue.length,
    paidThisMonth: sumMonth(thisMonth),
    paidLastMonth: sumMonth(lastMonth),
    openQuotations: roundMoney(quotations.reduce((s, q) => s + q.total, 0), cur),
    openQuotationsCount: quotations.length,
    revenue: revenueByMonth(events, cur, today),
    overdueInvoices: overdue.slice(0, 5),
    expiringQuotations: expiring.slice(0, 5),
    topClients: [...byClient.values()].sort((a, b) => b.amount - a.amount).slice(0, 5),
  }
}

export const AGING_BUCKETS = ["Not yet due", "1–30 days", "31–60 days", "61–90 days", "Over 90 days"] as const

export interface AgingRow {
  clientId: string
  name: string
  buckets: number[]
  total: number
}

/** Unpaid balances by how long they are overdue, per client and in total. */
export function agingReport(rows: InvoiceRow[], currency: string): { clients: AgingRow[]; totals: number[]; total: number } {
  const cur = upper(currency)
  const clients = new Map<string, AgingRow>()
  const totals = AGING_BUCKETS.map(() => 0)
  for (const r of rows) {
    if (upper(r.invoice.currency) !== cur || !isBilled(r.status) || r.balance <= 0) continue
    const d = r.status === "overdue" ? r.daysOverdue : 0
    const bucket = d <= 0 ? 0 : d <= 30 ? 1 : d <= 60 ? 2 : d <= 90 ? 3 : 4
    const key = docClientId(r.invoice) ?? r.invoice.client.name
    const row = clients.get(key) ?? { clientId: key, name: r.invoice.client.name, buckets: AGING_BUCKETS.map(() => 0), total: 0 }
    row.buckets[bucket] = roundMoney(row.buckets[bucket] + r.balance, cur)
    row.total = roundMoney(row.total + r.balance, cur)
    totals[bucket] = roundMoney(totals[bucket] + r.balance, cur)
    clients.set(key, row)
  }
  return {
    clients: [...clients.values()].sort((a, b) => b.total - a.total),
    totals,
    total: roundMoney(totals.reduce((s, v) => s + v, 0), cur),
  }
}

/** Compact axis numbers: 950, 1.2K, 3.4M. */
export function compactNumber(value: number): string {
  const abs = Math.abs(value)
  // Round on whole numbers (2050 → 21 tenths) to avoid float artefacts like 2.05 → "2.0".
  if (abs >= 1_000_000) return `${Math.round(value / 100_000) / 10}M`
  if (abs >= 10_000) return `${Math.round(value / 1_000)}K`
  if (abs >= 1_000) return `${Math.round(value / 100) / 10}K`
  return String(Math.round(value))
}

/** A "nice" axis maximum and step for 4 gridlines. */
export function niceScale(max: number, ticks = 4): { max: number; step: number } {
  if (max <= 0) return { max: ticks, step: 1 }
  const raw = max / ticks
  const pow = 10 ** Math.floor(Math.log10(raw))
  const step = [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10].map((m) => m * pow).find((s) => s >= raw)!
  return { max: step * ticks, step }
}

export type RangePreset = "this_month" | "last_month" | "this_year" | "last_year" | "last_12_months" | "all" | "custom"

export const RANGE_LABELS: Record<RangePreset, string> = {
  this_month: "This month",
  last_month: "Last month",
  this_year: "This year",
  last_year: "Last year",
  last_12_months: "Last 12 months",
  all: "All time",
  custom: "Custom",
}

/** Inclusive YYYY-MM-DD range for a preset; empty strings mean unbounded. */
export function rangeFor(preset: RangePreset, today: string): { from: string; to: string } {
  const [y, m] = today.split("-").map(Number)
  const monthEnd = (year: number, month: number) => new Date(Date.UTC(year, month, 0)).toISOString().slice(0, 10)
  const pad = (n: number) => String(n).padStart(2, "0")
  switch (preset) {
    case "this_month":
      return { from: `${y}-${pad(m)}-01`, to: monthEnd(y, m) }
    case "last_month": {
      const [ly, lm] = m === 1 ? [y - 1, 12] : [y, m - 1]
      return { from: `${ly}-${pad(lm)}-01`, to: monthEnd(ly, lm) }
    }
    case "this_year":
      return { from: `${y}-01-01`, to: `${y}-12-31` }
    case "last_year":
      return { from: `${y - 1}-01-01`, to: `${y - 1}-12-31` }
    case "last_12_months":
      return { from: `${lastMonths(today, 12)[0]}-01`, to: today }
    default:
      return { from: "", to: "" }
  }
}

export const inRange = (date: string, from: string, to: string) =>
  (!from || date >= from) && (!to || date <= to)
