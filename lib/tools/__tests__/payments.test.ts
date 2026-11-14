import { describe, expect, it } from "vitest"
import type { Client, Invoice, Receipt } from "@/types/invoice"
import {
  deriveInvoiceStatus,
  invoiceBalance,
  invoicePaidAmount,
  storedStatusAfterPayments,
  validatePayment,
} from "../payments"

const client: Client = { id: "c1", name: "A", email: "a@example.com", createdAt: "x" }

const invoice = (over: Partial<Invoice> = {}): Invoice => ({
  id: "i1",
  invoiceNumber: "INV-1",
  client,
  issueDate: "2026-11-01",
  dueDate: "2026-11-30",
  status: "sent",
  items: [],
  subtotal: 100,
  taxRate: 0,
  taxAmount: 0,
  discount: 0,
  discountType: "fixed",
  total: 100,
  currency: "USD",
  createdAt: "x",
  updatedAt: "x",
  ...over,
})

const receipt = (over: Partial<Receipt>): Receipt => ({
  id: "r",
  receiptNumber: "R",
  client,
  paymentDate: "2026-11-05",
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
  createdAt: "x",
  updatedAt: "x",
  ...over,
})

const pay = (amount: number, id = "p" + amount) => ({ id, date: "2026-11-05", amount, method: "cash" as const })

describe("invoicePaidAmount", () => {
  it("adds payments and older receipts, without double counting receipts tied to a payment", () => {
    const inv = invoice({ payments: [pay(30, "p1")] })
    const receipts = [
      receipt({ id: "a", invoiceId: "i1", paymentId: "p1", amountPaid: 30 }),
      receipt({ id: "b", invoiceId: "i1", amountPaid: 20 }),
      receipt({ id: "c", invoiceId: "other", amountPaid: 99 }),
    ]
    expect(invoicePaidAmount(inv, receipts)).toBe(50)
    expect(invoiceBalance(inv, receipts)).toBe(50)
  })

  it("caps at the total and treats a manual 'paid' as full", () => {
    expect(invoicePaidAmount(invoice({ payments: [pay(150)] }), [])).toBe(100)
    expect(invoicePaidAmount(invoice({ status: "paid" }), [])).toBe(100)
  })
})

describe("deriveInvoiceStatus", () => {
  const today = "2026-11-14"
  it("follows payments", () => {
    expect(deriveInvoiceStatus(invoice({ payments: [pay(40)] }), [], today)).toBe("partially_paid")
    expect(deriveInvoiceStatus(invoice({ payments: [pay(40), pay(60)] }), [], today)).toBe("paid")
    expect(deriveInvoiceStatus(invoice({ status: "draft", payments: [pay(100)] }), [], today)).toBe("paid")
  })

  it("marks unpaid balances past the due date overdue", () => {
    expect(deriveInvoiceStatus(invoice({ dueDate: "2026-11-01" }), [], today)).toBe("overdue")
    expect(deriveInvoiceStatus(invoice({ dueDate: "2026-11-01", payments: [pay(40)] }), [], today)).toBe("overdue")
    expect(deriveInvoiceStatus(invoice({ dueDate: "2026-11-01", payments: [pay(100)] }), [], today)).toBe("paid")
  })

  it("keeps drafts and cancelled invoices, and resets stale statuses", () => {
    expect(deriveInvoiceStatus(invoice({ status: "draft", dueDate: "2026-01-01" }), [], today)).toBe("draft")
    expect(deriveInvoiceStatus(invoice({ status: "cancelled", payments: [pay(100)] }), [], today)).toBe("cancelled")
    expect(deriveInvoiceStatus(invoice({ status: "partially_paid" }), [], today)).toBe("sent")
  })

  it("never stores overdue", () => {
    expect(storedStatusAfterPayments(invoice({ dueDate: "2020-01-01", payments: [pay(10)] }), [])).toBe("partially_paid")
    expect(storedStatusAfterPayments(invoice({ dueDate: "2020-01-01" }), [])).toBe("sent")
  })
})

describe("validatePayment", () => {
  it("rejects zero, overpayment and missing dates", () => {
    const inv = invoice({ payments: [pay(60)] })
    expect(validatePayment(inv, [], { amount: 0, date: "2026-11-14", method: "cash" })).toMatch(/greater than zero/)
    expect(validatePayment(inv, [], { amount: 41, date: "2026-11-14", method: "cash" })).toMatch(/USD 40.00/)
    expect(validatePayment(inv, [], { amount: 40, date: "", method: "cash" })).toMatch(/date/)
    expect(validatePayment(inv, [], { amount: 40, date: "2026-11-14", method: "cash" })).toBeNull()
  })
})
