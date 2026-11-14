"use client"

import { useEffect, useRef, useState } from "react"
import { X } from "lucide-react"
import type { Invoice, Payment } from "@/types/invoice"
import { PAYMENT_METHODS, type PaymentInput } from "@/lib/tools/payments"
import { currencyDecimals, formatMoney } from "@/lib/tools/totals"

interface RecordPaymentDialogProps {
  invoice: Invoice
  balance: number
  onCancel: () => void
  onConfirm: (input: PaymentInput, createReceipt: boolean) => Promise<void>
}

const inputClass =
  "w-full rounded-xl border border-border bg-background/80 px-4 py-3 text-sm outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20"
const labelClass = "block font-mono text-[11px] tracking-widest text-muted-foreground uppercase mb-2"

export function RecordPaymentDialog({ invoice, balance, onCancel, onConfirm }: RecordPaymentDialogProps) {
  const lastMethod = invoice.payments?.at(-1)?.method
  const [amount, setAmount] = useState(String(balance))
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [method, setMethod] = useState<Payment["method"]>(lastMethod ?? "bank_transfer")
  const [reference, setReference] = useState("")
  const [createReceipt, setCreateReceipt] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const amountRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    amountRef.current?.select()
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && !saving && onCancel()
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onCancel, saving])

  const numeric = Number(amount)
  const remainingAfter = Number.isFinite(numeric) ? balance - numeric : balance
  const money = (v: number) => `${invoice.currency} ${formatMoney(v, invoice.currency)}`

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      await onConfirm({ amount: numeric, date, method, reference }, createReceipt)
    } catch (err) {
      setError((err as Error).message)
      setSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 sm:p-4 print:hidden"
      onMouseDown={(e) => e.target === e.currentTarget && !saving && onCancel()}
    >
      <form
        onSubmit={submit}
        role="dialog"
        aria-modal="true"
        aria-labelledby="record-payment-title"
        className="w-full max-w-md max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl border border-border bg-background p-6 shadow-xl"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 id="record-payment-title" className="text-2xl font-bold">Record payment</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {invoice.invoiceNumber} · {money(balance)} still owed
            </p>
          </div>
          <button type="button" onClick={onCancel} aria-label="Close" className="rounded-lg p-2 hover:bg-muted">
            <X className="size-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="payment-amount" className={labelClass}>Amount received</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">{invoice.currency}</span>
              <input
                id="payment-amount"
                ref={amountRef}
                type="number"
                inputMode="decimal"
                min={0}
                max={balance}
                step={currencyDecimals(invoice.currency) === 0 ? 1 : 0.01}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={`${inputClass} pl-16`}
                required
              />
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              {Number.isFinite(numeric) && numeric > 0 && numeric <= balance && (
                <span>{remainingAfter > 0 ? `${money(remainingAfter)} will still be owed` : "Pays the invoice in full"}</span>
              )}
              {numeric !== balance && (
                <button type="button" onClick={() => setAmount(String(balance))} className="font-semibold text-purple-500 hover:underline">
                  Pay full balance
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="payment-date" className={labelClass}>Date received</label>
              <input id="payment-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} required />
            </div>
            <div>
              <label htmlFor="payment-method" className={labelClass}>Method</label>
              <select id="payment-method" value={method} onChange={(e) => setMethod(e.target.value as Payment["method"])} className={inputClass}>
                {PAYMENT_METHODS.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="payment-reference" className={labelClass}>Reference (optional)</label>
            <input
              id="payment-reference"
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Transaction ID, cheque number…"
              className={inputClass}
            />
          </div>

          <label className="flex items-start gap-3 rounded-xl border border-border p-3 text-sm">
            <input
              type="checkbox"
              checked={createReceipt}
              onChange={(e) => setCreateReceipt(e.target.checked)}
              className="mt-0.5 accent-purple-500"
            />
            <span>
              <span className="font-medium">Create a receipt</span>
              <span className="block text-muted-foreground">A receipt for this payment that you can send to the client.</span>
            </span>
          </label>

          {error && (
            <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </p>
          )}
        </div>

        <div className="mt-6 flex gap-3">
          <button type="button" onClick={onCancel} disabled={saving} className="flex-1 rounded-xl border border-border px-5 py-2.5 text-sm font-semibold hover:bg-muted">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="flex-1 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50">
            {saving ? "Saving…" : "Record payment"}
          </button>
        </div>
      </form>
    </div>
  )
}
