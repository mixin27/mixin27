"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Plus, Trash2, X } from "lucide-react"
import type { Quotation, SplitPart } from "@/types/invoice"
import { SPLIT_PRESETS, addDays, allocateInstallments, partsFromPreset } from "@/lib/tools/split"
import { formatMoney } from "@/lib/tools/totals"

interface SplitInvoiceDialogProps {
  quotation: Quotation
  onCancel: () => void
  onConfirm: (parts: SplitPart[]) => Promise<void>
}

const inputClass =
  "w-full rounded-lg border border-border bg-background/80 px-3 py-2 text-sm outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 disabled:opacity-60"

const todayIso = () => new Date().toISOString().slice(0, 10)

export function SplitInvoiceDialog({ quotation, onCancel, onConfirm }: SplitInvoiceDialogProps) {
  const [presetId, setPresetId] = useState<string>("40-40-20")
  const [parts, setParts] = useState<SplitPart[]>(() => {
    const preset = SPLIT_PRESETS.find((p) => p.id === "40-40-20")!
    return partsFromPreset(preset.percents, preset.labels, todayIso())
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && !submitting && onCancel()
    window.addEventListener("keydown", onKey)
    dialogRef.current?.focus()
    return () => window.removeEventListener("keydown", onKey)
  }, [onCancel, submitting])

  const { parts: allocated, errors } = useMemo(
    () => allocateInstallments(quotation, parts),
    [quotation, parts],
  )
  const money = (v: number) => `${quotation.currency} ${formatMoney(v, quotation.currency)}`

  const applyPreset = (id: string) => {
    setPresetId(id)
    const preset = SPLIT_PRESETS.find((p) => p.id === id)
    if (preset) setParts(partsFromPreset(preset.percents, preset.labels, parts[0]?.dueDate || todayIso()))
  }

  const update = (index: number, patch: Partial<SplitPart>) => {
    setPresetId("custom")
    setParts((prev) => prev.map((p, i) => (i === index ? { ...p, ...patch } : p)))
  }

  const addPart = () => {
    setPresetId("custom")
    setParts((prev) => {
      const last = prev[prev.length - 1]
      const next: SplitPart = {
        label: "Final payment",
        mode: "percent",
        value: 0,
        dueDate: addDays(last?.dueDate || todayIso(), 30),
      }
      // The old last part stops being the remainder, so give it a starting value.
      const updated = prev.map((p, i) =>
        i === prev.length - 1
          ? { ...p, label: p.label === "Final payment" ? `Milestone ${i}` : p.label, value: p.value || 10 }
          : p,
      )
      return [...updated, next]
    })
  }

  const removePart = (index: number) => {
    setPresetId("custom")
    setParts((prev) => prev.filter((_, i) => i !== index))
  }

  const handleConfirm = async () => {
    if (errors.length) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      await onConfirm(parts)
    } catch (error) {
      setSubmitError((error as Error).message)
      setSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 sm:p-4"
      onMouseDown={(e) => e.target === e.currentTarget && !submitting && onCancel()}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="split-title"
        tabIndex={-1}
        className="flex max-h-[92vh] w-full max-w-3xl flex-col rounded-t-2xl sm:rounded-2xl border border-border bg-background shadow-xl outline-none"
      >
        <div className="flex items-start justify-between gap-4 border-b border-border p-5 sm:p-6">
          <div>
            <h2 id="split-title" className="text-xl sm:text-2xl font-bold">Split into invoices</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {quotation.invoiceNumber} · {quotation.client.name} · {money(quotation.total)}
            </p>
          </div>
          <button type="button" onClick={onCancel} disabled={submitting} aria-label="Close" className="rounded-lg p-2 hover:bg-muted">
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          <div>
            <p className="mb-2 font-mono text-[11px] tracking-widest text-muted-foreground uppercase">Preset</p>
            <div className="flex flex-wrap gap-2">
              {SPLIT_PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => applyPreset(p.id)}
                  aria-pressed={presetId === p.id}
                  className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                    presetId === p.id
                      ? "border-purple-500 bg-purple-500/10 text-purple-600 dark:text-purple-300"
                      : "border-border hover:bg-muted"
                  }`}
                >
                  {p.label}
                </button>
              ))}
              <span
                className={`rounded-lg border px-3 py-1.5 text-sm font-medium ${
                  presetId === "custom" ? "border-purple-500 bg-purple-500/10 text-purple-600 dark:text-purple-300" : "border-dashed border-border text-muted-foreground"
                }`}
              >
                Custom
              </span>
            </div>
          </div>

          <ol className="space-y-3">
            {parts.map((part, i) => {
              const isLast = i === parts.length - 1
              const a = allocated[i]
              return (
                <li key={i} className="rounded-xl border border-border bg-card/60 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
                      Part {i + 1} of {parts.length}
                    </span>
                    {parts.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePart(i)}
                        aria-label={`Remove part ${i + 1}`}
                        className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-[1.4fr_1fr_1fr_1fr] gap-3 items-end">
                    <label className="col-span-2 sm:col-span-1 text-xs text-muted-foreground">
                      Label
                      <input
                        className={`${inputClass} mt-1`}
                        value={part.label}
                        onChange={(e) => update(i, { label: e.target.value })}
                      />
                    </label>
                    <label className="text-xs text-muted-foreground">
                      {isLast ? "Amount" : "Value"}
                      {isLast ? (
                        <div className={`${inputClass} mt-1 bg-muted/50`} aria-live="polite">Remainder</div>
                      ) : (
                        <div className="mt-1 flex">
                          <input
                            type="number"
                            inputMode="decimal"
                            min={0}
                            step="any"
                            className={`${inputClass} rounded-r-none`}
                            value={Number.isFinite(part.value) ? part.value : ""}
                            onChange={(e) => update(i, { value: e.target.value === "" ? 0 : Number(e.target.value) })}
                          />
                          <select
                            aria-label={`Part ${i + 1} type`}
                            className="rounded-r-lg border border-l-0 border-border bg-muted/50 px-2 text-sm"
                            value={part.mode}
                            onChange={(e) => update(i, { mode: e.target.value as SplitPart["mode"] })}
                          >
                            <option value="percent">%</option>
                            <option value="fixed">{quotation.currency}</option>
                          </select>
                        </div>
                      )}
                    </label>
                    <label className="text-xs text-muted-foreground">
                      Due date
                      <input
                        type="date"
                        className={`${inputClass} mt-1`}
                        value={part.dueDate}
                        onChange={(e) => update(i, { dueDate: e.target.value })}
                      />
                    </label>
                    <div className="col-span-2 sm:col-span-1 text-right">
                      <p className="text-xs text-muted-foreground">{a ? `${a.percentOfTotal}%` : ""}</p>
                      <p className="text-lg font-semibold tabular-nums">{a ? money(a.total) : "—"}</p>
                      {a && a.tax > 0 && (
                        <p className="text-xs text-muted-foreground tabular-nums">incl. tax {formatMoney(a.tax, quotation.currency)}</p>
                      )}
                    </div>
                  </div>
                </li>
              )
            })}
          </ol>

          {parts.length < 12 && (
            <button
              type="button"
              onClick={addPart}
              className="inline-flex items-center gap-2 text-sm font-semibold text-purple-500 hover:underline"
            >
              <Plus className="size-4" />
              Add part
            </button>
          )}

          {(errors.length > 0 || submitError) && (
            <ul role="alert" className="space-y-1 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {[...(submitError ? [submitError] : []), ...errors].map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-border p-5 sm:p-6">
          <p className="text-sm text-muted-foreground">
            Creates {parts.length} draft invoice{parts.length === 1 ? "" : "s"} adding up to{" "}
            <span className="font-semibold text-foreground">{money(quotation.total)}</span>.
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={submitting}
              className="flex-1 sm:flex-none rounded-xl border border-border px-5 py-2.5 text-sm font-semibold hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={submitting || errors.length > 0}
              className="flex-1 sm:flex-none rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
            >
              {submitting ? "Creating…" : `Create ${parts.length} invoice${parts.length === 1 ? "" : "s"}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
