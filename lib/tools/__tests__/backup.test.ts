import { describe, expect, it } from "vitest"
import {
  BACKUP_APP_ID,
  buildBackup,
  restoreBackup,
  summarizeBackup,
  validateBackup,
  type KeyValueStorage,
} from "../backup"

function memoryStorage(initial: Record<string, unknown> = {}): KeyValueStorage & { dump(): Record<string, unknown> } {
  const map = new Map(Object.entries(initial).map(([k, v]) => [k, JSON.stringify(v)]))
  return {
    getItem: (k) => map.get(k) ?? null,
    setItem: (k, v) => void map.set(k, v),
    removeItem: (k) => void map.delete(k),
    dump: () => Object.fromEntries([...map].map(([k, v]) => [k, JSON.parse(v)])),
  }
}

describe("buildBackup / validateBackup", () => {
  it("round-trips through JSON", () => {
    const storage = memoryStorage({
      clients: [{ id: "c1", name: "A" }],
      quotation_drafts: [{ id: "d1" }],
      invoice_settings: { businessName: "Me", nextInvoiceNumber: 4 },
    })
    const backup = buildBackup(storage, new Date("2026-11-14T00:00:00Z"))
    expect(backup.app).toBe(BACKUP_APP_ID)
    const result = validateBackup(JSON.parse(JSON.stringify(backup)))
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(summarizeBackup(result.backup).counts).toEqual({ clients: 1, quotation_drafts: 1 })
    }
  })

  it("accepts the old flat export format", () => {
    const result = validateBackup({
      invoices: [{ id: "i1" }],
      timeEntries: [{ id: "t1" }],
      settings: { businessName: "Me" },
    })
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.backup.data.time_entries).toEqual([{ id: "t1" }])
      expect(result.backup.data.invoice_settings).toEqual({ businessName: "Me" })
    }
  })

  it("rejects unrelated JSON and newer schema versions", () => {
    expect(validateBackup({ hello: "world" }).ok).toBe(false)
    expect(validateBackup({ clients: [{ name: "no id" }] }).ok).toBe(false)
    expect(
      validateBackup({ app: BACKUP_APP_ID, schemaVersion: 999, exportedAt: "x", data: {} }).ok,
    ).toBe(false)
  })
})

describe("restoreBackup", () => {
  const backup = {
    app: BACKUP_APP_ID,
    schemaVersion: 1,
    exportedAt: "2026-11-14T00:00:00Z",
    data: {
      clients: [
        { id: "c1", name: "Backup A", updatedAt: "2026-01-01" },
        { id: "c3", name: "C" },
      ],
      invoice_settings: { businessName: "From backup", nextInvoiceNumber: 3 },
    },
  } as const

  it("merges by id, keeping the newer record, and never lowers counters", () => {
    const storage = memoryStorage({
      clients: [
        { id: "c1", name: "Local A (newer)", updatedAt: "2026-06-01" },
        { id: "c2", name: "B" },
      ],
      invoice_settings: { businessName: "Local", nextInvoiceNumber: 10 },
    })
    restoreBackup(structuredClone(backup) as never, "merge", storage)
    const out = storage.dump()
    expect((out.clients as { name: string }[]).map((c) => c.name)).toEqual([
      "Local A (newer)",
      "B",
      "C",
    ])
    expect(out.invoice_settings).toMatchObject({ businessName: "From backup", nextInvoiceNumber: 10 })
    expect(out.tools_schema_version).toBe(0)
  })

  it("replace overwrites and clears keys missing from the backup", () => {
    const storage = memoryStorage({
      clients: [{ id: "c2", name: "B" }],
      invoices: [{ id: "i1" }],
    })
    restoreBackup(structuredClone(backup) as never, "replace", storage)
    const out = storage.dump()
    expect((out.clients as { id: string }[]).map((c) => c.id)).toEqual(["c1", "c3"])
    expect(out.invoices).toBeUndefined()
  })
})
