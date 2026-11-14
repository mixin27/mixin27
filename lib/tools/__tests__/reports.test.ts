import { describe, expect, it } from "vitest"
import type { Client, Invoice, Quotation, Receipt } from "@/types/invoice"
import {
  agingReport,
  buildDashboard,
  compactNumber,
  currenciesInUse,
  invoiceRows,
  lastMonths,
  niceScale,
  paymentEvents,
  rangeFor,
  inRange,
} from "../reports"

const alice: Client = { id: "c1", name: "Alice", email: "a@example.com", createdAt: "x" }
const bob: Client = { id: "c2", name: "Bob", email: "b@example.com", createdAt: "x" }
const today = "2026-11-14"

const inv = (over: Partial<Invoice>): Invoice => ({
  id: "i",
  invoiceNumber: "INV",
  client: alice,
  clientId: "c1",
  issueDate: "2026-10-01",
  dueDate: "2026-12-01",
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
  updatedAt: "2026-10-01T00:00:00Z",
  ...over,
})

const rec = (over: Partial<Receipt>): Receipt => ({
  id: "r",
  receiptNumber: "REC",
  client: alice,
  clientId: "c1",
  paymentDate: "2026-11-02",
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

const invoices: Invoice[] = [
  // partly paid by a recorded payment (with a receipt) this month
  inv({ id: "i1", invoiceNumber: "INV-1", total: 1000, payments: [{ id: "p1", date: "2026-11-03", amount: 400, method: "cash", receiptId: "r1" }] }),
  // overdue by 45 days, nothing paid
  inv({ id: "i2", invoiceNumber: "INV-2", client: bob, clientId: "c2", total: 300, dueDate: "2026-09-30" }),
  // marked paid by hand last month, no records
  inv({ id: "i3", invoiceNumber: "INV-3", total: 200, status: "paid", updatedAt: "2026-10-20T10:00:00Z" }),
  // older receipt (no payment record) in August
  inv({ id: "i4", invoiceNumber: "INV-4", total: 50, dueDate: "2026-08-01" }),
  // other currency and a draft — excluded from USD figures
  inv({ id: "i5", invoiceNumber: "INV-5", total: 900000, currency: "MMK" }),
  inv({ id: "i6", invoiceNumber: "INV-6", total: 777, status: "draft" }),
]
const receipts: Receipt[] = [
  rec({ id: "r1", receiptNumber: "REC-1", invoiceId: "i1", paymentId: "p1", amountPaid: 400, paymentDate: "2026-11-03" }),
  rec({ id: "r2", receiptNumber: "REC-2", invoiceId: "i4", amountPaid: 50, paymentDate: "2026-08-10" }),
  rec({ id: "r3", receiptNumber: "REC-3", client: bob, clientId: "c2", amountPaid: 25, paymentDate: "2026-11-01" }),
]

describe("paymentEvents", () => {
  const events = paymentEvents(invoices, receipts)
  it("counts each payment once from the right source", () => {
    expect(events.map((e) => [e.date, e.amount, e.source, e.receiptNumber ?? e.invoiceNumber])).toEqual([
      ["2026-11-03", 400, "payment", "REC-1"],
      ["2026-11-01", 25, "receipt", "REC-3"],
      ["2026-10-20", 200, "marked_paid", "INV-3"],
      ["2026-08-10", 50, "receipt", "REC-2"],
    ])
  })
})

describe("buildDashboard", () => {
  const quotations = [
    { id: "q1", status: "sent", validUntil: "2026-11-18", invoiceIds: [], total: 500, currency: "USD" },
    { id: "q2", status: "accepted", validUntil: "2026-01-01", total: 250, currency: "USD" },
    { id: "q3", status: "sent", validUntil: "2026-11-01", total: 999, currency: "USD" },
    { id: "q4", status: "accepted", invoiceIds: ["i1"], validUntil: "2027-01-01", total: 999, currency: "USD" },
  ] as unknown as Quotation[]
  const d = buildDashboard({ invoices, receipts, quotations }, "usd", today)

  it("sums outstanding and overdue balances for billed invoices in one currency", () => {
    expect(d.outstanding).toBe(600 + 300)
    expect(d.outstandingCount).toBe(2)
    expect(d.overdue).toBe(300)
    expect(d.overdueInvoices[0]).toMatchObject({ daysOverdue: 45, balance: 300 })
  })

  it("totals money received by month", () => {
    expect(d.paidThisMonth).toBe(425)
    expect(d.paidLastMonth).toBe(200)
    expect(d.revenue).toHaveLength(12)
    expect(d.revenue.at(-1)).toEqual({ month: "2026-11", amount: 425 })
    expect(d.revenue.find((m) => m.month === "2026-08")?.amount).toBe(50)
  })

  it("finds open and soon-expiring quotations and top clients", () => {
    expect(d.openQuotationsCount).toBe(2)
    expect(d.openQuotations).toBe(750)
    expect(d.expiringQuotations.map((q) => q.id)).toEqual(["q1"])
    expect(d.topClients).toEqual([
      { clientId: "c1", name: "Alice", amount: 650 },
      { clientId: "c2", name: "Bob", amount: 25 },
    ])
  })
})

describe("aging and helpers", () => {
  it("buckets unpaid balances by days overdue", () => {
    const report = agingReport(invoiceRows(invoices, receipts, today), "USD")
    expect(report.totals).toEqual([600, 0, 300, 0, 0])
    expect(report.total).toBe(900)
    expect(report.clients.map((c) => c.name)).toEqual(["Alice", "Bob"])
  })

  it("lists currencies, months and axis scales", () => {
    expect(currenciesInUse(invoices, receipts)).toEqual(["USD", "MMK"])
    expect(lastMonths("2026-02-10", 3)).toEqual(["2025-12", "2026-01", "2026-02"])
    expect(niceScale(425)).toEqual({ max: 600, step: 150 })
    expect(niceScale(0)).toEqual({ max: 4, step: 1 })
    expect(niceScale(2_000_000)).toEqual({ max: 2_000_000, step: 500_000 })
    expect([950, 1200, 2050, 12_500, 3_400_000].map(compactNumber)).toEqual(["950", "1.2K", "2.1K", "13K", "3.4M"])
  })
})

describe("date ranges", () => {
  it("covers each preset", () => {
    expect(rangeFor("this_month", "2026-02-14")).toEqual({ from: "2026-02-01", to: "2026-02-28" })
    expect(rangeFor("last_month", "2026-01-14")).toEqual({ from: "2025-12-01", to: "2025-12-31" })
    expect(rangeFor("last_12_months", "2026-11-14")).toEqual({ from: "2025-12-01", to: "2026-11-14" })
    expect(rangeFor("all", "2026-11-14")).toEqual({ from: "", to: "" })
    expect(inRange("2026-01-31", "2026-01-01", "2026-01-31")).toBe(true)
    expect(inRange("2026-02-01", "2026-01-01", "2026-01-31")).toBe(false)
    expect(inRange("1999-01-01", "", "")).toBe(true)
  })
})
