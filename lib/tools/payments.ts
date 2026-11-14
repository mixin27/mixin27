// Payments recorded against invoices, and the status that follows from them.
import type { Invoice, Payment, Receipt } from "@/types/invoice"
import { formatMoney, roundMoney } from "./totals"

export const PAYMENT_METHODS: { value: Payment["method"]; label: string }[] = [
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "cash", label: "Cash" },
  { value: "kbz_pay", label: "KBZ KPay" },
  { value: "aya_pay", label: "AYA Pay" },
  { value: "cb_pay", label: "CB Pay" },
  { value: "wave_pay", label: "Wave Pay" },
  { value: "uab_pay", label: "UAB Pay" },
  { value: "credit_card", label: "Credit Card" },
  { value: "paypal", label: "PayPal" },
  { value: "check", label: "Check" },
  { value: "other", label: "Other" },
]

export const paymentMethodLabel = (method: Payment["method"]) =>
  PAYMENT_METHODS.find((m) => m.value === method)?.label ?? method

/**
 * Total paid on an invoice: recorded payments plus any older receipts linked
 * to it that aren't tied to a payment. A manually "paid" invoice counts in full.
 * Never more than the invoice total.
 */
export function invoicePaidAmount(invoice: Invoice, receipts: Receipt[]): number {
  const fromPayments = (invoice.payments ?? []).reduce((sum, p) => sum + (p.amount || 0), 0)
  const fromReceipts = receipts
    .filter((r) => r.invoiceId === invoice.id && !r.paymentId)
    .reduce((sum, r) => sum + (r.amountPaid || 0), 0)
  let paid = fromPayments + fromReceipts
  if (invoice.status === "paid") paid = Math.max(paid, invoice.total)
  return roundMoney(Math.min(paid, invoice.total), invoice.currency)
}

export function invoiceBalance(invoice: Invoice, receipts: Receipt[]): number {
  return roundMoney(invoice.total - invoicePaidAmount(invoice, receipts), invoice.currency)
}

/**
 * The status to show for an invoice today. Payments decide paid / partially
 * paid; an unpaid balance past the due date is overdue. Drafts and cancelled
 * invoices keep their status.
 */
export function deriveInvoiceStatus(
  invoice: Invoice,
  receipts: Receipt[],
  today: string = new Date().toISOString().slice(0, 10),
): Invoice["status"] {
  if (invoice.status === "cancelled") return "cancelled"
  const paid = invoicePaidAmount(invoice, receipts)
  if (invoice.total > 0 && paid >= invoice.total) return "paid"
  if (invoice.status === "draft" && paid <= 0) return "draft"
  const pastDue = !!invoice.dueDate && invoice.dueDate < today
  if (pastDue) return "overdue"
  if (paid > 0) return "partially_paid"
  // An invoice marked overdue/partially paid that no longer is goes back to sent.
  return invoice.status === "overdue" || invoice.status === "partially_paid" ? "sent" : invoice.status
}

/**
 * Status to store after payments change. Overdue depends on today's date, so
 * it is worked out when shown rather than stored.
 */
export function storedStatusAfterPayments(invoice: Invoice, receipts: Receipt[]): Invoice["status"] {
  // A date before any due date means "never overdue".
  return deriveInvoiceStatus(invoice, receipts, "0000-00-00")
}

export interface PaymentInput {
  amount: number
  date: string
  method: Payment["method"]
  reference?: string
}

export function validatePayment(invoice: Invoice, receipts: Receipt[], input: PaymentInput): string | null {
  const balance = invoiceBalance(invoice, receipts)
  const amount = roundMoney(input.amount, invoice.currency)
  if (!Number.isFinite(input.amount) || amount <= 0) return "Enter an amount greater than zero."
  if (amount > balance) {
    return `That's more than the ${invoice.currency} ${formatMoney(balance, invoice.currency)} still owed on this invoice.`
  }
  if (!input.date) return "Choose the date the payment was received."
  return null
}
