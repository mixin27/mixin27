// Single place that builds, validates and restores /tools backups.
// Used by the file export/import today and by Google Drive backup later.
import { z } from "zod"
import {
  CURRENT_SCHEMA_VERSION,
  SCHEMA_VERSION_KEY,
  ensureMigrated,
} from "@/lib/storage/migrations"

export const BACKUP_APP_ID = "mixin27-tools"

/** localStorage keys holding arrays of records with an `id`. */
export const BACKUP_ARRAY_KEYS = [
  "clients",
  "invoices",
  "quotations",
  "receipts",
  "contracts",
  "time_entries",
  "resumes",
  "quotation_drafts",
  "recurring_templates",
] as const
export const SETTINGS_KEY = "invoice_settings"

type ArrayKey = (typeof BACKUP_ARRAY_KEYS)[number]
type Record_ = { id: string; updatedAt?: string; [key: string]: unknown }

export interface ToolsBackup {
  app: typeof BACKUP_APP_ID
  schemaVersion: number
  exportedAt: string
  data: Partial<Record<ArrayKey, Record_[]>> & {
    [SETTINGS_KEY]?: Record<string, unknown> | null
  }
}

/** Minimal storage interface so this module can be tested without a browser. */
export interface KeyValueStorage {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

const recordSchema = z.looseObject({ id: z.string().min(1) })
const recordArray = z.array(recordSchema)

const backupSchema = z.object({
  app: z.literal(BACKUP_APP_ID),
  schemaVersion: z.number().int().nonnegative(),
  exportedAt: z.string(),
  data: z.looseObject({
    ...Object.fromEntries(BACKUP_ARRAY_KEYS.map((k) => [k, recordArray.optional()])),
    [SETTINGS_KEY]: z.looseObject({}).nullable().optional(),
  }),
})

// Files written before this module existed: top-level arrays, camelCase timeEntries.
const legacySchema = z.looseObject({
  clients: recordArray.optional(),
  invoices: recordArray.optional(),
  quotations: recordArray.optional(),
  receipts: recordArray.optional(),
  contracts: recordArray.optional(),
  timeEntries: recordArray.optional(),
  resumes: recordArray.optional(),
  settings: z.looseObject({}).nullable().optional(),
  exportedAt: z.string().optional(),
})

function defaultStorage(): KeyValueStorage {
  if (typeof window === "undefined") throw new Error("Backups need a browser")
  return window.localStorage
}

function readJson<T>(storage: KeyValueStorage, key: string, fallback: T): T {
  try {
    const raw = storage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export function buildBackup(
  storage: KeyValueStorage = defaultStorage(),
  now: Date = new Date(),
): ToolsBackup {
  const data: ToolsBackup["data"] = {}
  for (const key of BACKUP_ARRAY_KEYS) {
    const value = readJson<unknown>(storage, key, [])
    if (Array.isArray(value) && value.length) data[key] = value as Record_[]
  }
  data[SETTINGS_KEY] = readJson<Record<string, unknown> | null>(storage, SETTINGS_KEY, null)
  return {
    app: BACKUP_APP_ID,
    schemaVersion: CURRENT_SCHEMA_VERSION,
    exportedAt: now.toISOString(),
    data,
  }
}

export type ValidateResult =
  | { ok: true; backup: ToolsBackup }
  | { ok: false; error: string }

/** Accepts current backups and the older flat export format. */
export function validateBackup(input: unknown): ValidateResult {
  const parsed = backupSchema.safeParse(input)
  if (parsed.success) {
    if (parsed.data.schemaVersion > CURRENT_SCHEMA_VERSION) {
      return {
        ok: false,
        error: "This backup was made by a newer version of the tools. Reload the page and try again.",
      }
    }
    return { ok: true, backup: parsed.data as ToolsBackup }
  }

  const legacy = legacySchema.safeParse(input)
  const hasAny =
    legacy.success &&
    ["clients", "invoices", "quotations", "receipts", "contracts", "timeEntries", "resumes", "settings"].some(
      (k) => (legacy.data as Record<string, unknown>)[k] != null,
    )
  if (legacy.success && hasAny) {
    const d = legacy.data
    return {
      ok: true,
      backup: {
        app: BACKUP_APP_ID,
        schemaVersion: 0,
        exportedAt: d.exportedAt ?? new Date(0).toISOString(),
        data: {
          clients: d.clients as Record_[] | undefined,
          invoices: d.invoices as Record_[] | undefined,
          quotations: d.quotations as Record_[] | undefined,
          receipts: d.receipts as Record_[] | undefined,
          contracts: d.contracts as Record_[] | undefined,
          time_entries: d.timeEntries as Record_[] | undefined,
          resumes: d.resumes as Record_[] | undefined,
          [SETTINGS_KEY]: (d.settings as Record<string, unknown> | null | undefined) ?? null,
        },
      },
    }
  }

  return { ok: false, error: "This file is not a Tools backup." }
}

export interface BackupSummary {
  exportedAt: string
  counts: Partial<Record<ArrayKey, number>>
  hasSettings: boolean
}

export function summarizeBackup(backup: ToolsBackup): BackupSummary {
  const counts: BackupSummary["counts"] = {}
  for (const key of BACKUP_ARRAY_KEYS) {
    const n = backup.data[key]?.length ?? 0
    if (n) counts[key] = n
  }
  return { exportedAt: backup.exportedAt, counts, hasSettings: !!backup.data[SETTINGS_KEY] }
}

const COUNTER_FIELDS = [
  "nextInvoiceNumber",
  "nextQuotationNumber",
  "nextReceiptNumber",
  "nextContractNumber",
] as const

function mergeById(existing: Record_[], incoming: Record_[]): Record_[] {
  const byId = new Map(existing.map((r) => [r.id, r]))
  for (const record of incoming) {
    const current = byId.get(record.id)
    const keepCurrent =
      current?.updatedAt && record.updatedAt && current.updatedAt > record.updatedAt
    if (!keepCurrent) byId.set(record.id, record)
  }
  return Array.from(byId.values())
}

/**
 * merge: add records from the backup; when both sides have the same id the
 * newer `updatedAt` wins. Settings come from the backup, but counters never go
 * backwards. replace: local data for every backed-up key is overwritten.
 */
export function restoreBackup(
  backup: ToolsBackup,
  mode: "merge" | "replace",
  storage: KeyValueStorage = defaultStorage(),
): void {
  for (const key of BACKUP_ARRAY_KEYS) {
    const incoming = backup.data[key]
    if (mode === "replace") {
      if (incoming?.length) storage.setItem(key, JSON.stringify(incoming))
      else storage.removeItem(key)
      continue
    }
    if (!incoming?.length) continue
    const existing = readJson<Record_[]>(storage, key, [])
    storage.setItem(key, JSON.stringify(mergeById(Array.isArray(existing) ? existing : [], incoming)))
  }

  const incomingSettings = backup.data[SETTINGS_KEY]
  if (incomingSettings) {
    let settings = incomingSettings
    if (mode === "merge") {
      const current = readJson<Record<string, unknown> | null>(storage, SETTINGS_KEY, null)
      if (current) {
        settings = { ...current, ...incomingSettings }
        for (const field of COUNTER_FIELDS) {
          const a = Number(current[field] ?? 0)
          const b = Number(incomingSettings[field] ?? 0)
          if (a || b) settings[field] = Math.max(a, b)
        }
      }
    }
    storage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  } else if (mode === "replace") {
    storage.removeItem(SETTINGS_KEY)
  }

  // Re-run migrations so restored data gets links and counters.
  storage.setItem(SCHEMA_VERSION_KEY, "0")
  if (typeof window !== "undefined" && storage === window.localStorage) {
    ensureMigrated({ force: true })
  }
}

export function backupFileName(now: Date = new Date()): string {
  return `tools-backup-${now.toISOString().slice(0, 19).replace(/[:T]/g, "-")}.json`
}

export function downloadBackupFile(backup: ToolsBackup): void {
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = backupFileName(new Date(backup.exportedAt))
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
