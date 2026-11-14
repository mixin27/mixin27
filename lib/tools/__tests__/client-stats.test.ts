import { describe, expect, it } from "vitest"
import type { Client, Invoice, Receipt } from "@/types/invoice"
import { hasDocuments, invoicePaidAmount, summarizeClient, type ClientDocuments } from "../client-stats"

const alice: Client = { id: "c1", name: "Alice", email: "a@example.com", createdAt: "2026-01-01" }

const invoice = (over: Partial<Invoice>): Invoice => ({
  id: "i",
  invoiceNumber: "INV-1",
  client: alice,
  clientId: "c1",
  issueDate: "2026-01-01",
  dueDate: "2026-02-01",
  status: "sent",
  items: [],
  subtotal: 100,
  taxRate: 0,
  taxAmount: 0,
  discount: 0,
  discountType: "fixed",
  total: 100,
  currency: "USD",
  createdAt: "2026-01-01",
  updatedAt: "2026-01-01",
  ...over,
})

const receipt = (over: Partial<Receipt>): Receipt => ({
  id: "r",
  receiptNumber: "REC-1",
  client: alice,
  clientId: "c1",
  paymentDate: "2026-01-05",
  paymentMethod: "cash",
  items: [],
  subtotal: 0,
  taxRate: 0,
  taxAmount: 0,
  discount: 0,
  discountType: "fixed",
  total: 0,
  amountPaid: 0,
  currency: "USD",
  createdAt: "2026-01-05",
  updatedAt: "2026-01-05",
  ...over,
})

const empty: ClientDocuments = { quotations: [], invoices: [], receipts: [], contracts: [], timeEntries: [] }

describe("invoicePaidAmount", () => {
  it("prefers recorded payments, then linked receipts, and caps at the total", () => {
    const inv = invoice({ id: "i1", payments: [{ id: "p", date: "x", amount: 30, method: "cash" }] })
    expect(invoicePaidAmount(inv, [receipt({ invoiceId: "i1", amountPaid: 99 })])).toBe(30)
    expect(invoicePaidAmount(invoice({ id: "i1" }), [receipt({ invoiceId: "i1", amountPaid: 40 })])).toBe(40)
    expect(invoicePaidAmount(invoice({ id: "i1" }), [receipt({ invoiceId: "i1", amountPaid: 500 })])).toBe(100)
    expect(invoicePaidAmount(invoice({ status: "paid" }), [])).toBe(100)
  })
})

describe("summarizeClient", () => {
  const docs: ClientDocuments = {
    ...empty,
    invoices: [
      invoice({ id: "i1", total: 100, dueDate: "2026-01-15", updatedAt: "2026-01-02" }),
      invoice({ id: "i2", total: 50000, currency: "MMK", dueDate: "2026-12-01" }),
      invoice({ id: "i3", status: "draft", total: 999 }),
      invoice({ id: "i4", clientId: "other", total: 7 }),
      // old data without clientId falls back to the snapshot id
      invoice({ id: "i5", clientId: undefined, status: "paid", total: 20, updatedAt: "2026-03-01" }),
    ],
    receipts: [
      receipt({ invoiceId: "i1", amountPaid: 40 }),
      receipt({ id: "r2", amountPaid: 5, updatedAt: "2026-02-01" }),
    ],
  }
  const s = summarizeClient(alice, docs, "2026-02-01")

  it("groups money by currency and skips drafts", () => {
    expect(s.invoiced).toEqual({ USD: 120, MMK: 50000 })
    expect(s.paid).toEqual({ USD: 65 })
    expect(s.outstanding).toEqual({ USD: 60, MMK: 50000 })
  })

  it("counts overdue balances only", () => {
    expect(s.overdue).toEqual({ USD: 60 })
    expect(s.overdueCount).toBe(1)
  })

  it("counts documents and the latest activity", () => {
    expect(s.documentCount).toBe(6)
    expect(s.lastActivity).toBe("2026-03-01")
  })

  it("knows when a client has no documents", () => {
    expect(hasDocuments("c1", docs)).toBe(true)
    expect(hasDocuments("nobody", docs)).toBe(false)
  })
})
