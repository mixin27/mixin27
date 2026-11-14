// Recurring invoice templates and duplicating documents (pure functions).
import type { Client, Invoice, InvoiceItem, Quotation, Receipt, RecurringInterval, RecurringTemplate } from "@/types/invoice"
import { addDays } from "./split"
import { computeTotals } from "./totals"

export const INTERVAL_LABELS: Record<RecurringInterval, string> = {
  weekly: "Every week",
  monthly: "Every month",
  yearly: "Every year",
}

/** Add whole months, clamping to the last day of shorter months (Jan 31 → Feb 28). */
export function addMonths(isoDate: string, months: number): string {
  const [y, m, d] = isoDate.split("-").map(Number)
  const total = y * 12 + (m - 1) + months
  const year = Math.floor(total / 12)
  const month = total - year * 12 // 0-based
  const lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate()
  const day = Math.min(d, lastDay)
  return `${String(year).padStart(4, "0")}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
}

/** The issue date of the n-th invoice (0-based), always counted from the start date. */
export function occurrenceDate(startDate: string, interval: RecurringInterval, n: number): string {
  switch (interval) {
    case "weekly":
      return addDays(startDate, n * 7)
    case "yearly":
      return addMonths(startDate, n * 12)
    default:
      return addMonths(startDate, n)
  }
}

/** Issue dates that are due (on or before today) and not generated yet. */
export function dueDates(
  template: Pick<RecurringTemplate, "startDate" | "interval" | "generatedCount" | "endDate" | "active">,
  today: string,
  limit = 24,
): string[] {
  if (!template.active) return []
  const dates: string[] = []
  for (let n = template.generatedCount; dates.length < limit; n++) {
    const date = occurrenceDate(template.startDate, template.interval, n)
    if (date > today) break
    if (template.endDate && date > template.endDate) break
    dates.push(date)
  }
  return dates
}

/**
 * Resume a paused template without back-filling the paused period: skip
 * occurrences before today so the next invoice is today or later.
 */
export function resumeFrom(
  template: Pick<RecurringTemplate, "startDate" | "interval" | "generatedCount">,
  today: string,
): { generatedCount: number; nextDate: string } {
  let n = template.generatedCount
  while (occurrenceDate(template.startDate, template.interval, n) < today) n++
  return { generatedCount: n, nextDate: occurrenceDate(template.startDate, template.interval, n) }
}

/** Next issue date after generating `count` invoices, or null when the template has ended. */
export function nextDateAfter(
  template: Pick<RecurringTemplate, "startDate" | "interval" | "endDate">,
  count: number,
): string | null {
  const date = occurrenceDate(template.startDate, template.interval, count)
  return template.endDate && date > template.endDate ? null : date
}

export interface NewDocIds {
  id: string
  token: string
  number: string
  now: string
  newItemId: () => string
}

/** Build the draft invoice for one occurrence of a template. */
export function buildInvoiceFromTemplate(
  template: RecurringTemplate,
  issueDate: string,
  ids: NewDocIds,
  client: Client = template.client,
): Invoice {
  const items: InvoiceItem[] = template.items.map((item) => ({ ...item, id: ids.newItemId() }))
  const totals = computeTotals({
    items,
    discount: template.discount,
    discountType: template.discountType,
    taxRate: template.taxRate,
    currency: template.currency,
  })
  return {
    id: ids.id,
    token: ids.token,
    invoiceNumber: ids.number,
    clientId: template.clientId,
    client,
    issueDate,
    dueDate: addDays(issueDate, Math.max(0, template.paymentTermsDays || 0)),
    status: "draft",
    items,
    subtotal: totals.subtotal,
    taxRate: template.taxRate,
    taxAmount: totals.taxAmount,
    discount: template.discount,
    discountType: template.discountType,
    total: totals.total,
    notes: template.notes,
    terms: template.terms,
    currency: template.currency,
    recurringTemplateId: template.id,
    createdAt: ids.now,
    updatedAt: ids.now,
  }
}

/** Template pre-filled from an existing invoice ("Make recurring"). */
export function templateFromInvoice(invoice: Invoice, today: string): Omit<RecurringTemplate, "id" | "createdAt" | "updatedAt"> {
  const termsDays = Math.max(
    0,
    Math.round((Date.parse(invoice.dueDate) - Date.parse(invoice.issueDate)) / 86_400_000) || 0,
  )
  return {
    name: invoice.items.find((i) => i.description.trim())?.description.trim() || `Recurring for ${invoice.client.name}`,
    clientId: invoice.clientId ?? invoice.client.id,
    client: invoice.client,
    items: invoice.items.map((i) => ({ ...i })),
    taxRate: invoice.taxRate,
    discount: invoice.discount,
    discountType: invoice.discountType,
    currency: invoice.currency,
    interval: "monthly",
    startDate: addMonths(invoice.issueDate || today, 1),
    generatedCount: 0,
    nextDate: addMonths(invoice.issueDate || today, 1),
    paymentTermsDays: termsDays,
    notes: invoice.notes,
    terms: invoice.terms,
    active: true,
  }
}

// ---------- Duplicating documents ----------

/** Same gap between issue and due dates, starting today. */
function shiftedDueDate(issueDate: string, dueDate: string, today: string): string {
  const gap = Math.round((Date.parse(dueDate) - Date.parse(issueDate)) / 86_400_000)
  return addDays(today, Number.isFinite(gap) && gap > 0 ? gap : 0)
}

const copyItems = (items: InvoiceItem[], newItemId: () => string) => items.map((item) => ({ ...item, id: newItemId() }))

/** A fresh draft copy of an invoice: new number, today's dates, no payments or links. */
export function duplicateInvoice(source: Invoice, ids: NewDocIds, today: string): Invoice {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { payments, installment, sourceQuotationId, recurringTemplateId, ...rest } = source
  return {
    ...rest,
    id: ids.id,
    token: ids.token,
    invoiceNumber: ids.number,
    issueDate: today,
    dueDate: shiftedDueDate(source.issueDate, source.dueDate, today),
    status: "draft",
    items: copyItems(source.items, ids.newItemId),
    createdAt: ids.now,
    updatedAt: ids.now,
  }
}

export function duplicateQuotation(source: Quotation, ids: NewDocIds, today: string): Quotation {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { invoiceIds, splitPlan, ...rest } = source
  const validUntil = shiftedDueDate(source.issueDate, source.validUntil, today)
  return {
    ...rest,
    id: ids.id,
    token: ids.token,
    invoiceNumber: ids.number,
    issueDate: today,
    validUntil,
    dueDate: validUntil,
    status: "draft",
    items: copyItems(source.items, ids.newItemId),
    createdAt: ids.now,
    updatedAt: ids.now,
  }
}

export function duplicateReceipt(source: Receipt, ids: NewDocIds, today: string): Receipt {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { invoiceId, paymentId, relatedInvoiceNumber, ...rest } = source
  return {
    ...rest,
    id: ids.id,
    token: ids.token,
    receiptNumber: ids.number,
    paymentDate: today,
    items: copyItems(source.items, ids.newItemId),
    createdAt: ids.now,
    updatedAt: ids.now,
  }
}
