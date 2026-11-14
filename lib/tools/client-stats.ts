import type { Client, Contract, Invoice, Quotation, Receipt, TimeEntry } from "@/types/invoice"
import { roundMoney } from "./totals"
import { invoicePaidAmount } from "./payments"

export { invoicePaidAmount }

/** Amounts keyed by currency code; nothing is converted between currencies. */
export type MoneyByCurrency = Record<string, number>

export interface ClientDocuments {
  quotations: Quotation[]
  invoices: Invoice[]
  receipts: Receipt[]
  contracts: Contract[]
  timeEntries: TimeEntry[]
}

export interface ClientSummary {
  client: Client
  documentCount: number
  invoiced: MoneyByCurrency
  paid: MoneyByCurrency
  outstanding: MoneyByCurrency
  overdue: MoneyByCurrency
  overdueCount: number
  lastActivity: string | null
}

/** The client a document belongs to: its link, or the snapshot's id for old data. */
export function documentClientId(doc: { clientId?: string; client?: Client }): string | undefined {
  return doc.clientId ?? doc.client?.id
}

function add(map: MoneyByCurrency, currency: string, amount: number) {
  if (!amount) return
  const code = (currency || "USD").toUpperCase()
  map[code] = roundMoney((map[code] ?? 0) + amount, code)
}

/** Invoices that are billed to the client (not drafts or cancelled). */
export function isBilled(invoice: Invoice): boolean {
  return invoice.status !== "draft" && invoice.status !== "cancelled"
}

export function filterDocumentsForClient(clientId: string, docs: ClientDocuments): ClientDocuments {
  const mine = <T extends { clientId?: string; client?: Client }>(list: T[]) =>
    list.filter((d) => documentClientId(d) === clientId)
  return {
    quotations: mine(docs.quotations),
    invoices: mine(docs.invoices),
    receipts: mine(docs.receipts),
    contracts: mine(docs.contracts),
    timeEntries: docs.timeEntries.filter((t) => t.clientId === clientId),
  }
}

export function summarizeClient(
  client: Client,
  docs: ClientDocuments,
  today: string = new Date().toISOString().slice(0, 10),
): ClientSummary {
  const own = filterDocumentsForClient(client.id, docs)
  const invoiced: MoneyByCurrency = {}
  const paid: MoneyByCurrency = {}
  const outstanding: MoneyByCurrency = {}
  const overdue: MoneyByCurrency = {}
  let overdueCount = 0

  for (const invoice of own.invoices) {
    if (!isBilled(invoice)) continue
    const paidAmount = invoicePaidAmount(invoice, own.receipts)
    const balance = roundMoney(invoice.total - paidAmount, invoice.currency)
    add(invoiced, invoice.currency, invoice.total)
    add(paid, invoice.currency, paidAmount)
    add(outstanding, invoice.currency, balance)
    if (balance > 0 && invoice.dueDate && invoice.dueDate < today) {
      add(overdue, invoice.currency, balance)
      overdueCount++
    }
  }
  // Receipts not tied to an invoice still count as money received.
  for (const receipt of own.receipts) {
    if (!receipt.invoiceId) add(paid, receipt.currency, receipt.amountPaid)
  }

  const dates = [
    ...own.quotations.map((d) => d.updatedAt),
    ...own.invoices.map((d) => d.updatedAt),
    ...own.receipts.map((d) => d.updatedAt),
    ...own.contracts.map((d) => d.updatedAt),
    ...own.timeEntries.map((d) => d.updatedAt),
  ].filter(Boolean)

  return {
    client,
    documentCount:
      own.quotations.length + own.invoices.length + own.receipts.length + own.contracts.length,
    invoiced,
    paid,
    outstanding,
    overdue,
    overdueCount,
    lastActivity: dates.length ? dates.sort().at(-1)! : null,
  }
}

export function hasDocuments(clientId: string, docs: ClientDocuments): boolean {
  const own = filterDocumentsForClient(clientId, docs)
  return (
    own.quotations.length + own.invoices.length + own.receipts.length + own.contracts.length + own.timeEntries.length > 0
  )
}

/** Largest single-currency amount, used for sorting. */
export function primaryAmount(map: MoneyByCurrency): number {
  return Object.values(map).reduce((max, v) => Math.max(max, v), 0)
}

export function isMoneyEmpty(map: MoneyByCurrency): boolean {
  return Object.values(map).every((v) => !v)
}
