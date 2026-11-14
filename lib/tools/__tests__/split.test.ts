import { describe, expect, it } from "vitest"
import type { Client, Invoice, Quotation, SplitPart } from "@/types/invoice"
import {
  addDays,
  allocateInstallments,
  buildInstallmentInvoice,
  invoicingState,
  linkedInvoices,
  missingInstallments,
  partsFromPreset,
} from "../split"
import { computeTotals } from "../totals"

const client: Client = { id: "c1", name: "Alice", email: "a@example.com", createdAt: "x" }

function quotation(over: Partial<Quotation> = {}): Quotation {
  return {
    id: "q1",
    invoiceNumber: "QUO-0012",
    clientId: "c1",
    client,
    issueDate: "2026-11-01",
    dueDate: "2026-11-30",
    validUntil: "2026-11-30",
    status: "accepted",
    items: [
      { id: "a", description: "Website redesign", quantity: 1, rate: 1000, amount: 1000 },
      { id: "b", description: "Hosting", quantity: 1, rate: 100, amount: 100 },
    ],
    subtotal: 1100,
    taxRate: 5,
    taxAmount: 55,
    discount: 0,
    discountType: "fixed",
    total: 1155,
    currency: "USD",
    createdAt: "2026-11-01",
    updatedAt: "2026-11-01",
    ...over,
  }
}

const pct = (...values: number[]): SplitPart[] =>
  values.map((value, i) => ({ label: `P${i + 1}`, mode: "percent", value, dueDate: "2026-12-01" }))

const sum = (xs: number[]) => Math.round(xs.reduce((a, b) => a + b, 0) * 100) / 100

describe("allocateInstallments", () => {
  it("splits 40/40/20 exactly, including tax", () => {
    const { parts, errors } = allocateInstallments(quotation(), pct(40, 40, 20))
    expect(errors).toEqual([])
    expect(parts.map((p) => p.total)).toEqual([462, 462, 231])
    expect(parts.map((p) => p.tax)).toEqual([22, 22, 11])
    expect(parts.map((p) => p.taxable)).toEqual([440, 440, 220])
  })

  it("gives rounding leftovers to the last part (33.33 x 3)", () => {
    const q = quotation({ total: 100, taxAmount: 0 })
    const { parts } = allocateInstallments(q, pct(33.33, 33.33, 0))
    expect(parts.map((p) => p.total)).toEqual([33.33, 33.33, 33.34])
    expect(sum(parts.map((p) => p.total))).toBe(100)
  })

  it("supports fixed amounts plus remainder", () => {
    const parts: SplitPart[] = [
      { label: "Deposit", mode: "fixed", value: 500, dueDate: "2026-11-15" },
      { label: "Final", mode: "percent", value: 0, dueDate: "2026-12-15" },
    ]
    const result = allocateInstallments(quotation(), parts)
    expect(result.errors).toEqual([])
    expect(result.parts.map((p) => p.total)).toEqual([500, 655])
    expect(sum(result.parts.map((p) => p.tax))).toBe(55)
    expect(result.parts[1].percentOfTotal).toBe(56.71)
  })

  it("keeps MMK whole numbers and sums exactly", () => {
    const q = quotation({ currency: "MMK", total: 1_000_001, taxAmount: 47_619 })
    const { parts } = allocateInstallments(q, pct(30, 40, 30))
    for (const p of parts) {
      expect(Number.isInteger(p.total)).toBe(true)
      expect(Number.isInteger(p.tax)).toBe(true)
    }
    expect(sum(parts.map((p) => p.total))).toBe(1_000_001)
    expect(sum(parts.map((p) => p.tax))).toBe(47_619)
  })

  it("reports problems", () => {
    expect(allocateInstallments(quotation(), pct(60, 50, 0)).errors[0]).toMatch(/nothing is left/)
    expect(allocateInstallments(quotation(), pct(0, 100)).errors).toContain("P1 must be more than zero.")
    expect(
      allocateInstallments(quotation(), [{ label: "", mode: "percent", value: 50, dueDate: "" }, ...pct(0)]).errors,
    ).toEqual(expect.arrayContaining(["Part 1 needs a label.", "Part 1 needs a due date."]))
    expect(allocateInstallments(quotation(), [{ label: "A", mode: "fixed", value: 2000, dueDate: "x" }, ...pct(0)]).errors[0]).toMatch(/nothing is left/)
  })

  it("matches the invoice form's own tax maths for each part", () => {
    const { parts } = allocateInstallments(quotation(), pct(40, 40, 20))
    for (const p of parts) {
      const t = computeTotals({ items: [{ amount: p.taxable }], discount: 0, discountType: "fixed", taxRate: 5, currency: "USD" })
      expect(t.total).toBe(p.total)
    }
  })
})

describe("presets and dates", () => {
  it("spaces due dates by the interval", () => {
    const parts = partsFromPreset([40, 40, 20], ["Deposit", "Milestone", "Final"], "2026-11-14")
    expect(parts.map((p) => p.dueDate)).toEqual(["2026-11-14", "2026-12-14", "2027-01-13"])
    expect(addDays("2026-01-31", 1)).toBe("2026-02-01")
  })
})

describe("installment invoices", () => {
  const q = quotation({ splitPlan: pct(40, 40, 20) })
  const { parts } = allocateInstallments(q, q.splitPlan!)
  const make = (i: number, over: Partial<Invoice> = {}) => ({
    ...buildInstallmentInvoice(q, parts[i], 3, {
      id: `i${i + 1}`,
      token: "t",
      invoiceNumber: `INV-${i + 1}`,
      issueDate: "2026-11-14",
      now: "2026-11-14T00:00:00Z",
    }),
    ...over,
  })

  it("builds a linked one-line invoice per part", () => {
    const inv = make(0)
    expect(inv).toMatchObject({
      sourceQuotationId: "q1",
      clientId: "c1",
      total: 462,
      taxAmount: 22,
      subtotal: 440,
      dueDate: "2026-12-01",
      installment: { index: 1, count: 3, label: "P1", mode: "percent", value: 40 },
    })
    expect(inv.items[0].description).toBe("P1 (40%) — QUO-0012: Website redesign (+1 more)")
  })

  it("tracks which parts exist", () => {
    const invoices = [make(0), make(2), make(1, { id: "x", status: "cancelled" }), make(1, { id: "other", sourceQuotationId: "q2" })]
    const linked = linkedInvoices(q, invoices)
    expect(linked.map((i) => i.id)).toEqual(["i1", "x", "i3"])
    expect(invoicingState(q, linked)).toBe("partial")
    expect(missingInstallments(q, linked).map((p) => p.index)).toEqual([2])
    expect(invoicingState(q, [...linked, make(1)])).toBe("full")
  })

  it("judges a plain conversion by amount", () => {
    const plain = quotation()
    expect(invoicingState(plain, [])).toBe("none")
    expect(invoicingState(plain, [make(0, { total: 1155, installment: undefined })])).toBe("full")
  })
})
