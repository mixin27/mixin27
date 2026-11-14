// Splitting a quotation into installment invoices (e.g. 40/40/20).
import type { Invoice, Quotation, SplitPart } from "@/types/invoice"
import { roundMoney } from "./totals"

export interface AllocatedPart extends SplitPart {
  /** 1-based position. */
  index: number
  /** Pre-tax amount of this part. */
  taxable: number
  tax: number
  /** taxable + tax; all parts add up exactly to the quotation total. */
  total: number
  /** Share of the quotation total, for display. */
  percentOfTotal: number
}

export interface AllocationResult {
  parts: AllocatedPart[]
  errors: string[]
}

export const SPLIT_PRESETS: { id: string; label: string; percents: number[]; labels: string[] }[] = [
  { id: "50-50", label: "50 / 50", percents: [50, 50], labels: ["Deposit", "Final payment"] },
  { id: "40-40-20", label: "40 / 40 / 20", percents: [40, 40, 20], labels: ["Deposit", "Milestone", "Final payment"] },
  { id: "30-40-30", label: "30 / 40 / 30", percents: [30, 40, 30], labels: ["Deposit", "Milestone", "Final payment"] },
  { id: "40-30-30", label: "40 / 30 / 30", percents: [40, 30, 30], labels: ["Deposit", "Milestone", "Final payment"] },
]

export function addDays(isoDate: string, days: number): string {
  const d = new Date(`${isoDate}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

/** Parts for a preset: first due on `start`, the rest every `intervalDays`. */
export function partsFromPreset(percents: number[], labels: string[], start: string, intervalDays = 30): SplitPart[] {
  return percents.map((value, i) => ({
    label:
      labels[i] ??
      (i === 0 ? "Deposit" : i === percents.length - 1 ? "Final payment" : `Milestone ${i}`),
    mode: "percent",
    value,
    dueDate: addDays(start, i * intervalDays),
  }))
}

/**
 * Work out each part's amount. Every part except the last uses its own value
 * (a percent of the total, or a fixed amount); the last part gets whatever is
 * left, so the parts always add up exactly to the quotation total. Tax is
 * spread across parts in proportion, with the last part absorbing rounding.
 */
export function allocateInstallments(
  quotation: Pick<Quotation, "total" | "taxAmount" | "currency">,
  parts: SplitPart[],
): AllocationResult {
  const { total, currency } = quotation
  const r = (v: number) => roundMoney(v, currency)
  const taxTotal = r(quotation.taxAmount || 0)
  const errors: string[] = []

  if (parts.length === 0) errors.push("Add at least one part.")
  if (parts.length > 12) errors.push("Use 12 parts or fewer.")
  if (!(total > 0)) errors.push("The quotation total must be more than zero.")

  const amounts: number[] = []
  parts.forEach((part, i) => {
    const name = part.label.trim() || `Part ${i + 1}`
    if (!part.label.trim()) errors.push(`Part ${i + 1} needs a label.`)
    if (!part.dueDate) errors.push(`${name} needs a due date.`)
    if (i === parts.length - 1) return
    const value = Number(part.value)
    if (!Number.isFinite(value) || value <= 0) {
      errors.push(`${name} must be more than zero.`)
      amounts.push(0)
      return
    }
    if (part.mode === "percent" && value >= 100) errors.push(`${name} must be less than 100%.`)
    amounts.push(part.mode === "percent" ? r((total * value) / 100) : r(value))
  })

  if (parts.length) {
    const used = r(amounts.reduce((sum, a) => sum + a, 0))
    const remainder = r(total - used)
    if (parts.length > 1 && remainder <= 0) {
      errors.push("The parts add up to the whole quotation or more, so nothing is left for the last part.")
    }
    amounts.push(remainder)
  }

  let taxUsed = 0
  const allocated = parts.map((part, i): AllocatedPart => {
    const amount = amounts[i] ?? 0
    const isLast = i === parts.length - 1
    const tax = isLast ? r(taxTotal - taxUsed) : total > 0 ? r((taxTotal * amount) / total) : 0
    taxUsed = r(taxUsed + tax)
    return {
      ...part,
      value: isLast && part.mode === "percent" && total > 0 ? r((amount / total) * 100) : part.value,
      index: i + 1,
      total: amount,
      tax,
      taxable: r(amount - tax),
      percentOfTotal: total > 0 ? Math.round((amount / total) * 10000) / 100 : 0,
    }
  })

  return { parts: allocated, errors }
}

/** Invoices that came from this quotation (by link on either side). */
export function linkedInvoices(quotation: Pick<Quotation, "id" | "invoiceIds">, invoices: Invoice[]): Invoice[] {
  const ids = new Set(quotation.invoiceIds ?? [])
  return invoices
    .filter((i) => i.sourceQuotationId === quotation.id || ids.has(i.id))
    .sort((a, b) => (a.installment?.index ?? 0) - (b.installment?.index ?? 0) || a.createdAt.localeCompare(b.createdAt))
}

export type InvoicingState = "none" | "partial" | "full"

/** Whether the quotation is fully invoiced, judging by its active linked invoices. */
export function invoicingState(quotation: Pick<Quotation, "total" | "splitPlan" | "currency">, linked: Invoice[]): InvoicingState {
  const active = linked.filter((i) => i.status !== "cancelled")
  if (!active.length) return "none"
  if (quotation.splitPlan?.length) {
    const present = new Set(active.map((i) => i.installment?.index).filter(Boolean))
    return quotation.splitPlan.every((_, i) => present.has(i + 1)) ? "full" : "partial"
  }
  const sum = roundMoney(active.reduce((s, i) => s + i.total, 0), quotation.currency)
  return sum >= quotation.total ? "full" : "partial"
}

/** Installments from the saved plan that have no active invoice. */
export function missingInstallments(quotation: Quotation, linked: Invoice[]): AllocatedPart[] {
  if (!quotation.splitPlan?.length) return []
  const present = new Set(
    linked.filter((i) => i.status !== "cancelled").map((i) => i.installment?.index),
  )
  return allocateInstallments(quotation, quotation.splitPlan).parts.filter((p) => !present.has(p.index))
}

export function installmentDescription(part: Pick<AllocatedPart, "label" | "mode" | "value" | "percentOfTotal">, quotation: Pick<Quotation, "invoiceNumber" | "items">): string {
  const share = part.mode === "percent" ? `${part.percentOfTotal}%` : null
  const subject = quotation.items.find((i) => i.description.trim())?.description.trim()
  const more = quotation.items.filter((i) => i.description.trim()).length - 1
  const what = subject ? `: ${subject}${more > 0 ? ` (+${more} more)` : ""}` : ""
  return `${part.label}${share ? ` (${share})` : ""} — ${quotation.invoiceNumber}${what}`
}

export interface InstallmentInvoiceInput {
  id: string
  token: string
  invoiceNumber: string
  issueDate: string
  now: string
}

/** Build (but don't save) the invoice for one installment. */
export function buildInstallmentInvoice(
  quotation: Quotation,
  part: AllocatedPart,
  count: number,
  input: InstallmentInvoiceInput,
): Invoice {
  return {
    id: input.id,
    token: input.token,
    invoiceNumber: input.invoiceNumber,
    clientId: quotation.clientId ?? quotation.client.id,
    client: quotation.client,
    issueDate: input.issueDate,
    dueDate: part.dueDate,
    status: "draft",
    items: [
      {
        id: `${input.id}-1`,
        description: installmentDescription(part, quotation),
        quantity: 1,
        rate: part.taxable,
        amount: part.taxable,
      },
    ],
    subtotal: part.taxable,
    taxRate: quotation.taxRate,
    taxAmount: part.tax,
    discount: 0,
    discountType: "fixed",
    total: part.total,
    notes: `Installment ${part.index} of ${count} for quotation ${quotation.invoiceNumber}.`,
    terms: quotation.terms,
    currency: quotation.currency,
    sourceQuotationId: quotation.id,
    installment: {
      index: part.index,
      count,
      label: part.label,
      mode: part.mode,
      value: part.mode === "percent" ? part.percentOfTotal : part.total,
    },
    createdAt: input.now,
    updatedAt: input.now,
  }
}
