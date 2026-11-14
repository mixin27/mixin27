"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { v7 as uuidv7 } from "uuid"
import { Plus, Save, Trash2 } from "lucide-react"
import type { Client, InvoiceItem, RecurringInterval, RecurringTemplate } from "@/types/invoice"
import { getSelectableClients, getSettings } from "@/lib/storage/tools-storage"
import { INTERVAL_LABELS } from "@/lib/tools/recurring"
import { computeTotals, formatMoney, lineAmount } from "@/lib/tools/totals"

export type TemplateDraft = Omit<RecurringTemplate, "id" | "createdAt" | "updatedAt">

const CURRENCIES = ["USD", "MMK", "EUR", "GBP", "SGD", "THB", "JPY", "AUD", "CAD"]

const inputClass =
  "w-full rounded-xl border border-border bg-background/80 px-4 py-3 text-sm outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20"
const labelClass = "block font-mono text-[11px] tracking-widest text-muted-foreground uppercase mb-2"

const todayIso = () => new Date().toISOString().slice(0, 10)

export function emptyTemplateDraft(clientId = ""): TemplateDraft {
  const settings = getSettings()
  return {
    name: "",
    clientId,
    client: { id: clientId, name: "", email: "", createdAt: "" },
    items: [{ id: uuidv7(), description: "", quantity: 1, rate: 0, amount: 0 }],
    taxRate: settings.defaultTaxRate,
    discount: 0,
    discountType: "percentage",
    currency: settings.defaultCurrency,
    interval: "monthly",
    startDate: todayIso(),
    generatedCount: 0,
    nextDate: todayIso(),
    paymentTermsDays: 14,
    notes: "",
    terms: settings.defaultPaymentTerms,
    active: true,
  }
}

interface RecurringTemplateFormProps {
  initial: TemplateDraft
  submitLabel: string
  cancelHref: string
  onSubmit: (draft: TemplateDraft) => Promise<void>
}

export function RecurringTemplateForm({ initial, submitLabel, cancelHref, onSubmit }: RecurringTemplateFormProps) {
  const [draft, setDraft] = useState<TemplateDraft>(initial)
  const [clients, setClients] = useState<Client[]>([])
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getSelectableClients(initial.clientId).then(setClients)
  }, [initial.clientId])

  const set = <K extends keyof TemplateDraft>(key: K, value: TemplateDraft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }))

  const updateItem = (id: string, patch: Partial<InvoiceItem>) =>
    setDraft((d) => ({
      ...d,
      items: d.items.map((item) => {
        if (item.id !== id) return item
        const next = { ...item, ...patch }
        return { ...next, amount: lineAmount(next.quantity, next.rate, d.currency) }
      }),
    }))

  const totals = useMemo(
    () =>
      computeTotals({
        items: draft.items,
        discount: draft.discount,
        discountType: draft.discountType,
        taxRate: draft.taxRate,
        currency: draft.currency,
      }),
    [draft.items, draft.discount, draft.discountType, draft.taxRate, draft.currency],
  )
  const money = (v: number) => `${draft.currency} ${formatMoney(v, draft.currency)}`

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const client = clients.find((c) => c.id === draft.clientId)
    if (!draft.name.trim()) return setError("Give the template a name, e.g. “Monthly retainer”.")
    if (!client) return setError("Choose a client.")
    if (!draft.items.some((i) => i.description.trim())) return setError("Add at least one item with a description.")
    if (!draft.nextDate) return setError("Choose the date of the next invoice.")
    if (draft.endDate && draft.endDate < draft.nextDate) return setError("The end date is before the next invoice date.")
    setError(null)
    setSaving(true)
    try {
      await onSubmit({
        ...draft,
        name: draft.name.trim(),
        client,
        items: draft.items.filter((i) => i.description.trim()),
        endDate: draft.endDate || undefined,
      })
    } catch (err) {
      setError((err as Error).message)
      setSaving(false)
    }
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-6">
      <section className="rounded-2xl border border-border bg-card/60 p-5 sm:p-6 shadow-sm space-y-4">
        <h2 className="text-xl font-semibold">Schedule</h2>
        <div>
          <label htmlFor="rt-name" className={labelClass}>Template name</label>
          <input id="rt-name" className={inputClass} value={draft.name} onChange={(e) => set("name", e.target.value)} placeholder="Monthly retainer" />
        </div>
        <div>
          <label htmlFor="rt-client" className={labelClass}>Client</label>
          <select id="rt-client" className={inputClass} value={draft.clientId} onChange={(e) => set("clientId", e.target.value)}>
            <option value="">Choose a client…</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>{c.name}{c.email ? ` (${c.email})` : ""}</option>
            ))}
          </select>
          <Link href="/tools/clients/new?returnTo=%2Ftools%2Finvoices%2Frecurring%2Fnew" className="mt-1 inline-block text-sm text-purple-400 hover:underline">
            + Add a new client
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="rt-interval" className={labelClass}>Repeat</label>
            <select id="rt-interval" className={inputClass} value={draft.interval} onChange={(e) => set("interval", e.target.value as RecurringInterval)}>
              {(Object.keys(INTERVAL_LABELS) as RecurringInterval[]).map((k) => (
                <option key={k} value={k}>{INTERVAL_LABELS[k]}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="rt-next" className={labelClass}>Next invoice date</label>
            <input id="rt-next" type="date" className={inputClass} value={draft.nextDate} onChange={(e) => set("nextDate", e.target.value)} />
          </div>
          <div>
            <label htmlFor="rt-terms-days" className={labelClass}>Payment due (days after issue)</label>
            <input id="rt-terms-days" type="number" min={0} className={inputClass} value={draft.paymentTermsDays} onChange={(e) => set("paymentTermsDays", Math.max(0, Number(e.target.value) || 0))} />
          </div>
          <div>
            <label htmlFor="rt-end" className={labelClass}>End date (optional)</label>
            <input id="rt-end" type="date" className={inputClass} value={draft.endDate ?? ""} onChange={(e) => set("endDate", e.target.value || undefined)} />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card/60 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold">Items</h2>
          <select aria-label="Currency" className="rounded-xl border border-border bg-background/80 px-3 py-2 text-sm" value={draft.currency} onChange={(e) => set("currency", e.target.value)}>
            {Array.from(new Set([draft.currency, ...CURRENCIES])).map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <ul className="space-y-3">
          {draft.items.map((item, i) => (
            <li key={item.id} className="grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_6rem_8rem_8rem_auto] gap-2 items-end rounded-xl border border-border/60 p-3">
              <label className="col-span-2 sm:col-span-1 text-xs text-muted-foreground">
                Description
                <input className={`${inputClass} mt-1`} value={item.description} onChange={(e) => updateItem(item.id, { description: e.target.value })} placeholder={`Item ${i + 1}`} />
              </label>
              <label className="text-xs text-muted-foreground">
                Qty
                <input type="number" min={0} step="any" className={`${inputClass} mt-1`} value={item.quantity} onChange={(e) => updateItem(item.id, { quantity: Number(e.target.value) || 0 })} />
              </label>
              <label className="text-xs text-muted-foreground">
                Rate
                <input type="number" min={0} step="any" className={`${inputClass} mt-1`} value={item.rate} onChange={(e) => updateItem(item.id, { rate: Number(e.target.value) || 0 })} />
              </label>
              <p className="text-right text-sm font-medium tabular-nums sm:pb-3">{money(item.amount)}</p>
              <button
                type="button"
                onClick={() => set("items", draft.items.filter((x) => x.id !== item.id))}
                disabled={draft.items.length === 1}
                aria-label={`Remove item ${i + 1}`}
                className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-30 sm:mb-1"
              >
                <Trash2 className="size-4" />
              </button>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => set("items", [...draft.items, { id: uuidv7(), description: "", quantity: 1, rate: 0, amount: 0 }])}
          className="inline-flex items-center gap-2 text-sm font-semibold text-purple-500 hover:underline"
        >
          <Plus className="size-4" />
          Add item
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-border pt-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="rt-tax" className={labelClass}>Tax %</label>
              <input id="rt-tax" type="number" min={0} step="any" className={inputClass} value={draft.taxRate} onChange={(e) => set("taxRate", Number(e.target.value) || 0)} />
            </div>
            <div>
              <label htmlFor="rt-discount" className={labelClass}>Discount</label>
              <div className="flex">
                <input id="rt-discount" type="number" min={0} step="any" className={`${inputClass} rounded-r-none`} value={draft.discount} onChange={(e) => set("discount", Number(e.target.value) || 0)} />
                <select aria-label="Discount type" className="rounded-r-xl border border-l-0 border-border bg-muted/50 px-2 text-sm" value={draft.discountType} onChange={(e) => set("discountType", e.target.value as TemplateDraft["discountType"])}>
                  <option value="percentage">%</option>
                  <option value="fixed">{draft.currency}</option>
                </select>
              </div>
            </div>
          </div>
          <dl className="space-y-1 text-sm sm:text-right">
            <div className="flex justify-between sm:justify-end sm:gap-6"><dt className="text-muted-foreground">Subtotal</dt><dd className="tabular-nums">{money(totals.subtotal)}</dd></div>
            {totals.discountAmount > 0 && <div className="flex justify-between sm:justify-end sm:gap-6"><dt className="text-muted-foreground">Discount</dt><dd className="tabular-nums">-{money(totals.discountAmount)}</dd></div>}
            {totals.taxAmount > 0 && <div className="flex justify-between sm:justify-end sm:gap-6"><dt className="text-muted-foreground">Tax</dt><dd className="tabular-nums">{money(totals.taxAmount)}</dd></div>}
            <div className="flex justify-between sm:justify-end sm:gap-6 text-base font-bold"><dt>Each invoice</dt><dd className="tabular-nums">{money(totals.total)}</dd></div>
          </dl>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card/60 p-5 sm:p-6 shadow-sm space-y-4">
        <h2 className="text-xl font-semibold">Notes &amp; terms</h2>
        <div>
          <label htmlFor="rt-notes" className={labelClass}>Notes</label>
          <textarea id="rt-notes" rows={2} className={`${inputClass} resize-none`} value={draft.notes ?? ""} onChange={(e) => set("notes", e.target.value)} />
        </div>
        <div>
          <label htmlFor="rt-terms" className={labelClass}>Terms</label>
          <textarea id="rt-terms" rows={2} className={`${inputClass} resize-none`} value={draft.terms ?? ""} onChange={(e) => set("terms", e.target.value)} />
        </div>
      </section>

      {error && (
        <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>
      )}

      <div className="flex gap-3">
        <Link href={cancelHref} className="flex-1 inline-flex items-center justify-center rounded-xl border border-border bg-card/60 px-5 py-2.5 text-sm font-semibold hover:bg-card">
          Cancel
        </Link>
        <button type="submit" disabled={saving} className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-purple-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-purple-400 disabled:opacity-50">
          <Save className="size-4" />
          {submitLabel}
        </button>
      </div>
    </form>
  )
}
