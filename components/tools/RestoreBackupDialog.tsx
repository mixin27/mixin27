"use client"

import { useEffect, useState } from "react"
import { AlertTriangle, X } from "lucide-react"
import {
  BACKUP_ARRAY_KEYS,
  buildBackup,
  downloadBackupFile,
  summarizeBackup,
  type ToolsBackup,
} from "@/lib/tools/backup"

export const BACKUP_KEY_LABELS: Record<string, string> = {
  clients: "Clients",
  quotations: "Quotations",
  invoices: "Invoices",
  receipts: "Receipts",
  contracts: "Contracts",
  time_entries: "Time entries",
  resumes: "Resumes",
  quotation_drafts: "Quotation drafts",
  recurring_templates: "Recurring templates",
}

interface RestoreBackupDialogProps {
  backup: ToolsBackup
  sourceLabel: string
  onCancel: () => void
  onConfirm: (mode: "merge" | "replace") => Promise<void>
}

export function RestoreBackupDialog({ backup, sourceLabel, onCancel, onConfirm }: RestoreBackupDialogProps) {
  const [mode, setMode] = useState<"merge" | "replace">("merge")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const incoming = summarizeBackup(backup)
  const [current] = useState(() => summarizeBackup(buildBackup()))
  const localIsEmpty = Object.keys(current.counts).length === 0

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && !busy && onCancel()
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [busy, onCancel])

  const rows = BACKUP_ARRAY_KEYS.filter((k) => incoming.counts[k] || current.counts[k])

  const confirm = async () => {
    setBusy(true)
    setError(null)
    try {
      // Safety net: keep a copy of what's here before overwriting it.
      if (mode === "replace" && !localIsEmpty) downloadBackupFile(buildBackup())
      await onConfirm(mode)
    } catch (err) {
      setError((err as Error).message)
      setBusy(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 sm:p-4"
      onMouseDown={(e) => e.target === e.currentTarget && !busy && onCancel()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="restore-title"
        className="w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl border border-border bg-background p-6 shadow-xl"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 id="restore-title" className="text-2xl font-bold">Restore backup</h2>
            <p className="mt-1 text-sm text-muted-foreground break-words">
              {sourceLabel} · saved {new Date(backup.exportedAt).toLocaleString()}
            </p>
          </div>
          <button type="button" onClick={onCancel} disabled={busy} aria-label="Close" className="rounded-lg p-2 hover:bg-muted">
            <X className="size-5" />
          </button>
        </div>

        <table className="mb-5 w-full text-sm">
          <thead>
            <tr className="text-left font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
              <th className="pb-2 font-medium">Records</th>
              <th className="pb-2 text-right font-medium">In backup</th>
              <th className="pb-2 text-right font-medium">On this device</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((key) => (
              <tr key={key} className="border-t border-border/60">
                <td className="py-2">{BACKUP_KEY_LABELS[key] ?? key}</td>
                <td className="py-2 text-right tabular-nums">{incoming.counts[key] ?? 0}</td>
                <td className="py-2 text-right tabular-nums text-muted-foreground">{current.counts[key] ?? 0}</td>
              </tr>
            ))}
            <tr className="border-t border-border/60">
              <td className="py-2">Business settings</td>
              <td className="py-2 text-right">{incoming.hasSettings ? "Yes" : "—"}</td>
              <td className="py-2 text-right text-muted-foreground">{current.hasSettings ? "Yes" : "—"}</td>
            </tr>
          </tbody>
        </table>

        <fieldset className="space-y-2">
          <legend className="mb-2 font-mono text-[11px] tracking-widest text-muted-foreground uppercase">How to restore</legend>
          <label className={`flex items-start gap-3 rounded-xl border p-3 text-sm ${mode === "merge" ? "border-purple-500 bg-purple-500/5" : "border-border"}`}>
            <input type="radio" name="restore-mode" checked={mode === "merge"} onChange={() => setMode("merge")} className="mt-1 accent-purple-500" />
            <span>
              <span className="font-medium">Merge with this device</span>
              <span className="block text-muted-foreground">
                Adds records from the backup. When a record exists in both, the newer one is kept. Nothing is deleted.
              </span>
            </span>
          </label>
          <label className={`flex items-start gap-3 rounded-xl border p-3 text-sm ${mode === "replace" ? "border-destructive bg-destructive/5" : "border-border"}`}>
            <input type="radio" name="restore-mode" checked={mode === "replace"} onChange={() => setMode("replace")} className="mt-1 accent-purple-500" />
            <span>
              <span className="font-medium">Replace everything on this device</span>
              <span className="block text-muted-foreground">
                This device ends up exactly like the backup. Records that aren't in the backup are removed.
              </span>
            </span>
          </label>
        </fieldset>

        {mode === "replace" && !localIsEmpty && (
          <p className="mt-3 flex gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-700 dark:text-amber-300">
            <AlertTriangle className="size-4 shrink-0 mt-0.5" />
            A backup file of this device&apos;s current data will download first, in case you need it.
          </p>
        )}

        {error && (
          <p role="alert" className="mt-3 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </p>
        )}

        <div className="mt-6 flex gap-3">
          <button type="button" onClick={onCancel} disabled={busy} className="flex-1 rounded-xl border border-border px-5 py-2.5 text-sm font-semibold hover:bg-muted">
            Cancel
          </button>
          <button
            type="button"
            onClick={confirm}
            disabled={busy}
            className={`flex-1 rounded-xl px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50 ${
              mode === "replace" ? "bg-destructive hover:bg-destructive/90" : "bg-purple-500 hover:bg-purple-400"
            }`}
          >
            {busy ? "Restoring…" : mode === "replace" ? "Replace and restore" : "Merge and restore"}
          </button>
        </div>
      </div>
    </div>
  )
}
