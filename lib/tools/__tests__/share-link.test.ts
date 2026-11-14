import { describe, expect, it } from "vitest"
import type { Invoice, InvoiceSettings, Receipt } from "@/types/invoice"
import { buildSharePayload, decodeShare, encodeShare, shareUrl, toPreviewDoc } from "../share-link"

const settings: InvoiceSettings = {
  businessName: "KZT Studio",
  businessEmail: "hi@example.com",
  logo: "data:image/png;base64,AAAA",
  defaultCurrency: "USD",
  defaultTaxRate: 0,
  defaultPaymentTerms: "Net 30",
  invoicePrefix: "INV-",
  nextInvoiceNumber: 42,
}

const invoice: Invoice = {
  id: "inv-1",
  invoiceNumber: "INV-0007",
  clientId: "c1",
  client: { id: "c1", name: "Alice — ညီမ", email: "a@example.com", createdAt: "x" },
  issueDate: "2026-11-01",
  dueDate: "2026-11-30",
  status: "sent",
  items: [{ id: "i1", description: "Design", quantity: 2, rate: 500, amount: 1000 }],
  subtotal: 1000,
  taxRate: 5,
  taxAmount: 50,
  discount: 0,
  discountType: "fixed",
  total: 1050,
  currency: "USD",
  token: "secret-token",
  payments: [{ id: "p1", date: "2026-11-05", amount: 300, method: "cash" }],
  installment: { index: 1, count: 3, label: "Deposit", mode: "percent", value: 40 },
  createdAt: "x",
  updatedAt: "x",
}

describe("share links", () => {
  it("round-trips an invoice and keeps only public fields", async () => {
    const payload = buildSharePayload("invoice", invoice, settings, { amountPaid: 300 })
    const decoded = await decodeShare(await encodeShare(payload))
    expect(decoded).toEqual(payload)
    const json = JSON.stringify(decoded)
    for (const secret of ["inv-1", "secret-token", "nextInvoiceNumber", "logo", "payments", "clientId"]) {
      expect(json).not.toContain(secret)
    }
    expect(decoded?.k === "invoice" && decoded.paid).toBe(300)
    const doc = toPreviewDoc(decoded!) as Invoice
    expect(doc.client.name).toBe("Alice — ညီမ")
    expect(doc.items[0].amount).toBe(1000)
    expect(doc.installment?.label).toBe("Deposit")
  })

  it("round-trips a receipt", async () => {
    const receipt: Receipt = {
      ...invoice,
      receiptNumber: "RCP-1",
      paymentDate: "2026-11-05",
      paymentMethod: "kbz_pay",
      amountPaid: 300,
    } as unknown as Receipt
    const payload = buildSharePayload("receipt", receipt, settings)
    expect(await decodeShare(await encodeShare(payload))).toEqual(payload)
  })

  it("puts the data in the fragment", async () => {
    const url = await shareUrl("https://example.com", buildSharePayload("invoice", invoice, settings))
    expect(url).toMatch(/^https:\/\/example\.com\/p\/invoice#d=[A-Za-z0-9_-]+$/)
  })

  it("rejects garbage and tampered payloads", async () => {
    expect(await decodeShare("")).toBeNull()
    expect(await decodeShare("not*base64")).toBeNull()
    expect(await decodeShare("AAAA")).toBeNull()
    const bad = await encodeShare({ v: 1, k: "invoice", d: { total: "x" } } as never)
    expect(await decodeShare(bad)).toBeNull()
  })
})
