import type { InvoiceItem } from "@/types/invoice"

const ZERO_DECIMAL_CURRENCIES = new Set(["MMK", "JPY", "KRW", "VND", "IDR"])

export function currencyDecimals(currency: string): number {
  return ZERO_DECIMAL_CURRENCIES.has(currency.trim().toUpperCase()) ? 0 : 2
}

/** Round to the currency's minor unit (half away from zero). */
export function roundMoney(value: number, currency: string): number {
  if (!Number.isFinite(value)) return 0
  const decimals = currencyDecimals(currency)
  // Shift via the decimal string ("1.005e2" = 100.5) to avoid binary float
  // errors like 1.005 * 100 = 100.49999999999999.
  const abs = Math.abs(value)
  // Exponent notation (very large/small numbers) can't take the string trick.
  const shifted = String(abs).includes("e")
    ? Math.round(abs * 10 ** decimals)
    : Math.round(Number(`${abs}e${decimals}`))
  const unshifted = String(shifted).includes("e")
    ? shifted / 10 ** decimals
    : Number(`${shifted}e-${decimals}`)
  const rounded = Math.sign(value) * unshifted
  return Object.is(rounded, -0) ? 0 : rounded
}

export function formatMoney(value: number, currency: string): string {
  const decimals = currencyDecimals(currency)
  return value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

export function lineAmount(quantity: number, rate: number, currency: string): number {
  return roundMoney((quantity || 0) * (rate || 0), currency)
}

export interface TotalsInput {
  items: Pick<InvoiceItem, "amount">[]
  discount: number
  discountType: "percentage" | "fixed"
  taxRate: number
  currency: string
}

export interface Totals {
  subtotal: number
  discountAmount: number
  taxableAmount: number
  taxAmount: number
  total: number
}

/**
 * subtotal = Σ item amounts; discount is % of subtotal or a fixed amount
 * (capped at the subtotal); tax = taxable × rate%; total = taxable + tax.
 * Every step is rounded to the currency's minor unit.
 */
export function computeTotals({
  items,
  discount,
  discountType,
  taxRate,
  currency,
}: TotalsInput): Totals {
  const r = (v: number) => roundMoney(v, currency)
  const subtotal = r(items.reduce((sum, item) => sum + r(item.amount || 0), 0))
  const rawDiscount =
    discountType === "percentage" ? subtotal * ((discount || 0) / 100) : discount || 0
  const discountAmount = r(Math.min(Math.max(rawDiscount, 0), Math.max(subtotal, 0)))
  const taxableAmount = r(subtotal - discountAmount)
  const taxAmount = r(taxableAmount * ((taxRate || 0) / 100))
  const total = r(taxableAmount + taxAmount)
  return { subtotal, discountAmount, taxableAmount, taxAmount, total }
}
