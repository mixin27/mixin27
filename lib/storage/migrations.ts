// One-time, idempotent upgrades of the localStorage data used by /tools.
// Runs lazily before the first read (see hybrid-storage.ts / getSettings).
import type {
  Client,
  Contract,
  Invoice,
  InvoiceSettings,
  Quotation,
  Receipt,
} from "@/types/invoice"
import { DEFAULT_SETTINGS } from "./settings-defaults"

export const SCHEMA_VERSION_KEY = "tools_schema_version"
export const CURRENT_SCHEMA_VERSION = 1

export interface ToolsDataSnapshot {
  clients: Client[]
  invoices: Invoice[]
  quotations: Quotation[]
  receipts: Receipt[]
  contracts: Contract[]
  settings: InvoiceSettings | null
}

const KEYS = {
  clients: "clients",
  invoices: "invoices",
  quotations: "quotations",
  receipts: "receipts",
  contracts: "contracts",
  settings: "invoice_settings",
} as const

/** Trailing number of a document number, e.g. "INV-0012" → 12. */
export function parseDocNumber(value: string | undefined): number {
  const match = value?.match(/(\d+)\s*$/)
  return match ? Number(match[1]) : 0
}

function nextCounter(numbers: (string | undefined)[], current = 1): number {
  const max = numbers.reduce((m, n) => Math.max(m, parseDocNumber(n)), 0)
  return Math.max(current || 1, max + 1)
}

/** v0 → v1: client links, receipt→invoice and quotation→invoice links, separate counters. */
export function migrateToV1(data: ToolsDataSnapshot): ToolsDataSnapshot {
  const clientsById = new Map(data.clients.map((c) => [c.id, c]))
  const clientsByEmail = new Map(
    data.clients
      .filter((c) => c.email?.trim())
      .map((c) => [c.email.trim().toLowerCase(), c]),
  )

  const resolveClientId = (doc: { clientId?: string; client?: Client }) => {
    if (doc.clientId) return doc.clientId
    if (!doc.client) return undefined
    if (clientsById.has(doc.client.id)) return doc.client.id
    const email = doc.client.email?.trim().toLowerCase()
    return email ? clientsByEmail.get(email)?.id : undefined
  }
  const withClientId = <T extends { clientId?: string; client: Client }>(doc: T): T => {
    const clientId = resolveClientId(doc)
    return clientId && clientId !== doc.clientId ? { ...doc, clientId } : doc
  }

  const quotations = data.quotations.map(withClientId)
  const quotationsByNumber = new Map(quotations.map((q) => [q.invoiceNumber, q]))
  const invoiceIdsByQuotation = new Map<string, Set<string>>()

  const invoices = data.invoices.map((raw) => {
    let invoice = withClientId(raw)
    if (!invoice.sourceQuotationId) {
      const match = invoice.notes?.match(/Converted from Quotation:\s*(\S+)/)
      const quotation = match ? quotationsByNumber.get(match[1]) : undefined
      if (quotation) invoice = { ...invoice, sourceQuotationId: quotation.id }
    }
    if (invoice.sourceQuotationId) {
      const set = invoiceIdsByQuotation.get(invoice.sourceQuotationId) ?? new Set()
      set.add(invoice.id)
      invoiceIdsByQuotation.set(invoice.sourceQuotationId, set)
    }
    return invoice
  })
  const invoicesByNumber = new Map(invoices.map((i) => [i.invoiceNumber, i]))

  const linkedQuotations = quotations.map((q) => {
    const linked = invoiceIdsByQuotation.get(q.id)
    if (!linked) return q
    const invoiceIds = Array.from(new Set([...(q.invoiceIds ?? []), ...linked]))
    return invoiceIds.length === (q.invoiceIds ?? []).length ? q : { ...q, invoiceIds }
  })

  const receipts = data.receipts.map((raw) => {
    const receipt = withClientId(raw)
    if (receipt.invoiceId || !receipt.relatedInvoiceNumber) return receipt
    const invoice = invoicesByNumber.get(receipt.relatedInvoiceNumber.trim())
    return invoice ? { ...receipt, invoiceId: invoice.id } : receipt
  })

  const contracts = data.contracts.map(withClientId)

  const hasDocuments =
    invoices.length + quotations.length + receipts.length + contracts.length > 0
  let settings = data.settings ?? (hasDocuments ? DEFAULT_SETTINGS : null)
  if (settings) {
    const defined = Object.fromEntries(
      Object.entries(settings).filter(([, v]) => v !== undefined && v !== null),
    ) as Partial<InvoiceSettings>
    settings = {
      ...DEFAULT_SETTINGS,
      ...defined,
      nextInvoiceNumber: nextCounter(
        invoices.map((i) => i.invoiceNumber),
        settings.nextInvoiceNumber,
      ),
      nextQuotationNumber: nextCounter(
        quotations.map((q) => q.invoiceNumber),
        settings.nextQuotationNumber,
      ),
      nextReceiptNumber: nextCounter(
        receipts.map((r) => r.receiptNumber),
        Math.max(settings.nextReceiptNumber ?? 1, receipts.length + 1),
      ),
      nextContractNumber: nextCounter(
        contracts.map((c) => c.contractNumber),
        Math.max(settings.nextContractNumber ?? 1, contracts.length + 1),
      ),
    }
  }

  return { clients: data.clients, invoices, quotations: linkedQuotations, receipts, contracts, settings }
}

const MIGRATIONS: Record<number, (data: ToolsDataSnapshot) => ToolsDataSnapshot> = {
  1: migrateToV1,
}

export function applyMigrations(data: ToolsDataSnapshot, fromVersion: number): ToolsDataSnapshot {
  let result = data
  for (let v = fromVersion + 1; v <= CURRENT_SCHEMA_VERSION; v++) {
    result = MIGRATIONS[v]?.(result) ?? result
  }
  return result
}

function readArray<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

let checked = false

/**
 * Run pending migrations against localStorage. Cheap after the first call.
 * Pass `force` after importing a backup so old-format data is upgraded too.
 */
export function ensureMigrated(options: { force?: boolean } = {}): void {
  if (typeof window === "undefined") return
  if (checked && !options.force) return
  checked = true

  const stored = Number(localStorage.getItem(SCHEMA_VERSION_KEY) ?? 0)
  const fromVersion = options.force ? 0 : Number.isFinite(stored) ? stored : 0
  if (fromVersion >= CURRENT_SCHEMA_VERSION) return

  let settings: InvoiceSettings | null = null
  try {
    const raw = localStorage.getItem(KEYS.settings)
    settings = raw ? JSON.parse(raw) : null
  } catch {
    settings = null
  }

  const before: ToolsDataSnapshot = {
    clients: readArray(KEYS.clients),
    invoices: readArray(KEYS.invoices),
    quotations: readArray(KEYS.quotations),
    receipts: readArray(KEYS.receipts),
    contracts: readArray(KEYS.contracts),
    settings,
  }
  const after = applyMigrations(before, fromVersion)

  for (const key of ["invoices", "quotations", "receipts", "contracts"] as const) {
    if (after[key] !== before[key] && (after[key].length || before[key].length)) {
      localStorage.setItem(KEYS[key], JSON.stringify(after[key]))
    }
  }
  if (after.settings && after.settings !== before.settings) {
    localStorage.setItem(KEYS.settings, JSON.stringify(after.settings))
  }
  localStorage.setItem(SCHEMA_VERSION_KEY, String(CURRENT_SCHEMA_VERSION))
}
