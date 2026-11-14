import { describe, expect, it } from "vitest"
import { computeTotals, currencyDecimals, lineAmount, roundMoney } from "../totals"

describe("roundMoney", () => {
  it("uses 0 decimals for MMK and 2 for USD", () => {
    expect(currencyDecimals("MMK")).toBe(0)
    expect(currencyDecimals("mmk")).toBe(0)
    expect(currencyDecimals("USD")).toBe(2)
    expect(roundMoney(1234.5, "MMK")).toBe(1235)
    expect(roundMoney(1.005, "USD")).toBe(1.01)
    expect(roundMoney(2.675, "USD")).toBe(2.68)
  })

  it("rounds negatives half away from zero and never returns -0", () => {
    expect(roundMoney(-1.005, "USD")).toBe(-1.01)
    expect(Object.is(roundMoney(-0.001, "USD"), 0)).toBe(true)
  })

  it("treats non-finite values as 0", () => {
    expect(roundMoney(Number.NaN, "USD")).toBe(0)
    expect(roundMoney(1e-7, "USD")).toBe(0)
    expect(roundMoney(1e21, "MMK")).toBe(1e21)
  })
})

describe("computeTotals", () => {
  it("applies percentage discount before tax", () => {
    const t = computeTotals({
      items: [{ amount: 100 }, { amount: 50.555 }],
      discount: 10,
      discountType: "percentage",
      taxRate: 5,
      currency: "USD",
    })
    // items rounded: 100 + 50.56 = 150.56; discount 15.06; taxable 135.5; tax 6.78
    expect(t).toEqual({
      subtotal: 150.56,
      discountAmount: 15.06,
      taxableAmount: 135.5,
      taxAmount: 6.78,
      total: 142.28,
    })
  })

  it("rounds every step for MMK", () => {
    const t = computeTotals({
      items: [{ amount: lineAmount(3, 333_333.4, "MMK") }],
      discount: 0,
      discountType: "fixed",
      taxRate: 5,
      currency: "MMK",
    })
    expect(t.subtotal).toBe(1_000_000)
    expect(t.taxAmount).toBe(50_000)
    expect(t.total).toBe(1_050_000)
  })

  it("caps a fixed discount at the subtotal", () => {
    const t = computeTotals({
      items: [{ amount: 40 }],
      discount: 100,
      discountType: "fixed",
      taxRate: 10,
      currency: "USD",
    })
    expect(t.discountAmount).toBe(40)
    expect(t.total).toBe(0)
  })
})
