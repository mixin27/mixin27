import { describe, expect, it } from "vitest"
import type { Client, Contract, Invoice, InvoiceSettings, Quotation, Receipt } from "@/types/invoice"
import { applyMigrations, migrateToV1, parseDocNumber, type ToolsDataSnapshot } from "../migrations"
import { DEFAULT_SETTINGS } from "../settings-defaults"

const client = (id: string, email: string): Client => ({
  id,
  name: id,
  email,
  createdAt: "2026-01-01",
})

const base = {
  issueDate: "2026-01-01",
  dueDate: "2026-02-01",
  items: [],
  subtotal: 100,
  taxRate: 0,
  taxAmount: 0,
  discount: 0,
  discountType: "fixed" as const,
  total: 100,
  currency: "USD",
  createdAt: "2026-01-01",
  updatedAt: "2026-01-01",
}

function snapshot(): ToolsDataSnapshot {
  const alice = client("c1", "alice@example.com")
  const bob = client("c2", "Bob@Example.com")
  const quotation: Quotation = {
    ...base,
    id: "q1",
    invoiceNumber: "QUO-0007",
    client: alice,
    validUntil: "2026-02-01",
    status: "accepted",
  }
  const invoice: Invoice = {
    ...base,
    id: "i1",
    invoiceNumber: "INV-0012",
    // snapshot copied before the client record existed: id differs, email matches
    client: { ...bob, id: "old-id", email: "bob@example.com " },
    status: "sent",
    notes: "Some notes\n\nConverted from Quotation: QUO-0007",
  }
  const receipt: Receipt = {
    id: "r1",
    receiptNumber: "REC-0003",
    client: alice,
    paymentDate: "2026-01-10",
    paymentMethod: "cash",
    relatedInvoiceNumber: "INV-0012",
    items: [],
    subtotal: 100,
    taxRate: 0,
    taxAmount: 0,
    discount: 0,
    discountType: "fixed",
    total: 100,
    amountPaid: 100,
    currency: "USD",
    createdAt: "2026-01-10",
    updatedAt: "2026-01-10",
  }
  const settings: InvoiceSettings = {
    ...DEFAULT_SETTINGS,
    quotationPrefix: undefined,
    nextQuotationNumber: undefined,
    receiptPrefix: undefined,
    nextReceiptNumber: undefined,
    contractPrefix: undefined,
    nextContractNumber: undefined,
    nextInvoiceNumber: 9,
  }
  return {
    clients: [alice, bob],
    invoices: [invoice],
    quotations: [quotation],
    receipts: [receipt],
    contracts: [] as Contract[],
    settings,
  }
}

describe("parseDocNumber", () => {
  it("reads the trailing number", () => {
    expect(parseDocNumber("INV-0012")).toBe(12)
    expect(parseDocNumber("2026/QUO/45 ")).toBe(45)
    expect(parseDocNumber("draft")).toBe(0)
    expect(parseDocNumber(undefined)).toBe(0)
  })
})

describe("migrateToV1", () => {
  const result = migrateToV1(snapshot())

  it("links documents to clients by id, then by email", () => {
    expect(result.quotations[0].clientId).toBe("c1")
    expect(result.invoices[0].clientId).toBe("c2")
    expect(result.receipts[0].clientId).toBe("c1")
  })

  it("links converted invoices to their quotation both ways", () => {
    expect(result.invoices[0].sourceQuotationId).toBe("q1")
    expect(result.quotations[0].invoiceIds).toEqual(["i1"])
  })

  it("links receipts to invoices by number", () => {
    expect(result.receipts[0].invoiceId).toBe("i1")
  })

  it("starts each counter after the highest existing number", () => {
    expect(result.settings?.nextInvoiceNumber).toBe(13)
    expect(result.settings?.quotationPrefix).toBe("QUO-")
    expect(result.settings?.nextQuotationNumber).toBe(8)
    expect(result.settings?.nextReceiptNumber).toBe(4)
    expect(result.settings?.nextContractNumber).toBe(1)
  })

  it("is idempotent", () => {
    const again = migrateToV1(result)
    expect(again.quotations[0].invoiceIds).toEqual(["i1"])
    expect(again.settings).toEqual(result.settings)
  })

  it("creates settings when documents exist but settings were never saved", () => {
    const out = migrateToV1({ ...snapshot(), settings: null })
    expect(out.settings?.nextInvoiceNumber).toBe(13)
  })

  it("leaves an empty store without settings", () => {
    const out = applyMigrations(
      { clients: [], invoices: [], quotations: [], receipts: [], contracts: [], settings: null },
      0,
    )
    expect(out.settings).toBeNull()
  })
})
