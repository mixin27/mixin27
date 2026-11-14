import { describe, expect, it } from "vitest"
import type { Client, Invoice, Quotation, Receipt, RecurringTemplate } from "@/types/invoice"
import {
  addMonths,
  buildInvoiceFromTemplate,
  dueDates,
  duplicateInvoice,
  duplicateQuotation,
  duplicateReceipt,
  nextDateAfter,
  resumeFrom,
  occurrenceDate,
  templateFromInvoice,
} from "../recurring"

const client: Client = { id: "c1", name: "Alice", email: "a@example.com", createdAt: "x" }
let seq = 0
const ids = (number: string) => ({ id: "new", token: "tok", number, now: "2026-11-14T00:00:00Z", newItemId: () => `item-${++seq}` })

const template = (over: Partial<RecurringTemplate> = {}): RecurringTemplate => ({
  id: "t1",
  name: "Retainer",
  clientId: "c1",
  client,
  items: [{ id: "a", description: "Monthly retainer", quantity: 1, rate: 500, amount: 500 }],
  taxRate: 5,
  discount: 10,
  discountType: "percentage",
  currency: "USD",
  interval: "monthly",
  startDate: "2026-01-31",
  generatedCount: 0,
  nextDate: "2026-01-31",
  paymentTermsDays: 14,
  active: true,
  createdAt: "x",
  updatedAt: "x",
  ...over,
})

describe("dates", () => {
  it("clamps month ends without drifting", () => {
    expect(addMonths("2026-01-31", 1)).toBe("2026-02-28")
    expect(addMonths("2028-01-31", 1)).toBe("2028-02-29")
    expect(addMonths("2026-11-30", 3)).toBe("2027-02-28")
    expect([0, 1, 2, 3].map((n) => occurrenceDate("2026-01-31", "monthly", n))).toEqual([
      "2026-01-31",
      "2026-02-28",
      "2026-03-31",
      "2026-04-30",
    ])
    expect(occurrenceDate("2026-11-14", "weekly", 2)).toBe("2026-11-28")
    expect(occurrenceDate("2024-02-29", "yearly", 1)).toBe("2025-02-28")
  })

  it("lists every missed date up to today, respecting the end date and pause", () => {
    expect(dueDates(template(), "2026-04-15")).toEqual(["2026-01-31", "2026-02-28", "2026-03-31"])
    expect(dueDates(template({ generatedCount: 2 }), "2026-04-15")).toEqual(["2026-03-31"])
    expect(dueDates(template({ endDate: "2026-03-01" }), "2026-04-15")).toEqual(["2026-01-31", "2026-02-28"])
    expect(dueDates(template({ active: false }), "2026-04-15")).toEqual([])
    expect(dueDates(template({ startDate: "2020-01-01" }), "2026-04-15", 5)).toHaveLength(5)
    expect(nextDateAfter(template({ endDate: "2026-03-01" }), 2)).toBeNull()
    expect(nextDateAfter(template(), 3)).toBe("2026-04-30")
    expect(resumeFrom(template({ generatedCount: 1 }), "2026-04-15")).toEqual({ generatedCount: 3, nextDate: "2026-04-30" })
    expect(resumeFrom(template({ generatedCount: 1 }), "2026-02-01")).toEqual({ generatedCount: 1, nextDate: "2026-02-28" })
  })
})

describe("buildInvoiceFromTemplate", () => {
  it("creates a linked draft with recalculated totals and due date", () => {
    const inv = buildInvoiceFromTemplate(template(), "2026-02-28", ids("INV-0009"))
    expect(inv).toMatchObject({
      invoiceNumber: "INV-0009",
      status: "draft",
      issueDate: "2026-02-28",
      dueDate: "2026-03-14",
      subtotal: 500,
      taxAmount: 22.5,
      total: 472.5,
      recurringTemplateId: "t1",
      clientId: "c1",
    })
    expect(inv.items[0].id).not.toBe("a")
  })

  it("prefills a template from an invoice", () => {
    const inv = buildInvoiceFromTemplate(template(), "2026-02-28", ids("INV-1"))
    const t = templateFromInvoice(inv, "2026-11-14")
    expect(t).toMatchObject({ name: "Monthly retainer", interval: "monthly", startDate: "2026-03-28", paymentTermsDays: 14, clientId: "c1" })
  })
})

describe("duplicate", () => {
  it("copies an invoice as a fresh draft without payments or links", () => {
    const source = {
      ...buildInvoiceFromTemplate(template(), "2026-01-01", ids("INV-1")),
      status: "paid",
      dueDate: "2026-01-31",
      payments: [{ id: "p", date: "x", amount: 1, method: "cash" }],
      sourceQuotationId: "q",
      installment: { index: 1, count: 2, label: "x", mode: "percent", value: 50 },
    } as Invoice
    const copy = duplicateInvoice(source, ids("INV-2"), "2026-11-14")
    expect(copy).toMatchObject({ id: "new", invoiceNumber: "INV-2", status: "draft", issueDate: "2026-11-14", dueDate: "2026-12-14", total: source.total })
    expect(copy).not.toHaveProperty("payments")
    expect(copy).not.toHaveProperty("sourceQuotationId")
    expect(copy).not.toHaveProperty("installment")
    expect(copy).not.toHaveProperty("recurringTemplateId")
  })

  it("copies quotations and receipts", () => {
    const q = { id: "q", invoiceNumber: "QUO-1", client, issueDate: "2026-01-01", dueDate: "2026-01-15", validUntil: "2026-01-15", status: "accepted", items: [], subtotal: 0, taxRate: 0, taxAmount: 0, discount: 0, discountType: "fixed", total: 0, currency: "USD", invoiceIds: ["i"], splitPlan: [], createdAt: "x", updatedAt: "x" } as Quotation
    const qc = duplicateQuotation(q, ids("QUO-2"), "2026-11-14")
    expect(qc).toMatchObject({ status: "draft", validUntil: "2026-11-28", dueDate: "2026-11-28" })
    expect(qc).not.toHaveProperty("invoiceIds")
    expect(qc).not.toHaveProperty("splitPlan")
    const r = { id: "r", receiptNumber: "REC-1", client, paymentDate: "2026-01-02", paymentMethod: "cash", invoiceId: "i", paymentId: "p", relatedInvoiceNumber: "INV-1", items: [], subtotal: 0, taxRate: 0, taxAmount: 0, discount: 0, discountType: "fixed", total: 0, amountPaid: 10, currency: "USD", createdAt: "x", updatedAt: "x" } as Receipt
    const rc = duplicateReceipt(r, ids("REC-2"), "2026-11-14")
    expect(rc).toMatchObject({ receiptNumber: "REC-2", paymentDate: "2026-11-14", amountPaid: 10 })
    expect(rc).not.toHaveProperty("paymentId")
    expect(rc).not.toHaveProperty("invoiceId")
  })
})
