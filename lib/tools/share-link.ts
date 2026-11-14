// Share links with no server: the document is compressed into the URL
// fragment (#d=...), which browsers never send to the server. Only the fields
// the previews show are included, so internal ids, payments and settings
// counters stay private.
import { z } from "zod"
import type { Client, Invoice, InvoiceSettings, Quotation, Receipt } from "@/types/invoice"

export type ShareKind = "invoice" | "quotation" | "receipt"
export const SHARE_KINDS: ShareKind[] = ["invoice", "quotation", "receipt"]

/** Links longer than this may be cut off by some chat and email apps. */
export const LONG_LINK_CHARS = 8000

const str = z.string().max(5000)
const optStr = str.optional()
const num = z.number().finite()

const clientSchema = z.object({
  name: str,
  email: str.default(""),
  phone: optStr,
  address: optStr,
  city: optStr,
  state: optStr,
  zipCode: optStr,
  country: optStr,
  taxId: optStr,
})

const itemSchema = z.object({ description: str, quantity: num, rate: num, amount: num })

const baseDoc = {
  client: clientSchema,
  items: z.array(itemSchema).max(500),
  subtotal: num,
  taxRate: num,
  taxAmount: num,
  discount: num,
  discountType: z.enum(["percentage", "fixed"]),
  total: num,
  notes: optStr,
  currency: z.string().min(1).max(10),
}

const settingsSchema = z.object({
  businessName: str,
  businessEmail: str.default(""),
  businessPhone: optStr,
  businessAddress: optStr,
  businessCity: optStr,
  businessState: optStr,
  businessZipCode: optStr,
  businessCountry: optStr,
  taxId: optStr,
})

const invoiceSchema = z.object({
  ...baseDoc,
  invoiceNumber: str,
  issueDate: str,
  dueDate: str,
  terms: optStr,
  installment: z.object({ index: num, count: num, label: str }).optional(),
})

const quotationSchema = z.object({
  ...baseDoc,
  invoiceNumber: str,
  issueDate: str,
  validUntil: str,
  terms: optStr,
})

const receiptSchema = z.object({
  ...baseDoc,
  receiptNumber: str,
  paymentDate: str,
  paymentMethod: z.string().max(40),
  relatedInvoiceNumber: optStr,
  amountPaid: num,
})

const payloadSchema = z.discriminatedUnion("k", [
  z.object({ v: z.literal(1), k: z.literal("invoice"), d: invoiceSchema, s: settingsSchema, paid: num.optional() }),
  z.object({ v: z.literal(1), k: z.literal("quotation"), d: quotationSchema, s: settingsSchema }),
  z.object({ v: z.literal(1), k: z.literal("receipt"), d: receiptSchema, s: settingsSchema }),
])

export type SharePayload = z.infer<typeof payloadSchema>

type AnyDoc = Invoice | Quotation | Receipt

/** Copy only the listed keys that have a value. */
function pick<T extends object>(source: T, keys: string[]): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const k of keys) {
    const v = (source as Record<string, unknown>)[k]
    if (v !== undefined && v !== null && v !== "") out[k] = v
  }
  return out
}

const CLIENT_KEYS = ["name", "email", "phone", "address", "city", "state", "zipCode", "country", "taxId"]
const SETTINGS_KEYS = [
  "businessName", "businessEmail", "businessPhone", "businessAddress",
  "businessCity", "businessState", "businessZipCode", "businessCountry", "taxId",
]
const BASE_KEYS = ["subtotal", "taxRate", "taxAmount", "discount", "discountType", "total", "notes", "currency"]
const KIND_KEYS: Record<ShareKind, string[]> = {
  invoice: ["invoiceNumber", "issueDate", "dueDate", "terms"],
  quotation: ["invoiceNumber", "issueDate", "validUntil", "terms"],
  receipt: ["receiptNumber", "paymentDate", "paymentMethod", "relatedInvoiceNumber", "amountPaid"],
}

/** The public subset of a document, ready to encode. */
export function buildSharePayload(
  kind: ShareKind,
  doc: AnyDoc,
  settings: InvoiceSettings,
  opts: { amountPaid?: number } = {},
): SharePayload {
  const d: Record<string, unknown> = {
    ...pick(doc, [...BASE_KEYS, ...KIND_KEYS[kind]]),
    client: { email: "", ...pick(doc.client, CLIENT_KEYS) },
    items: (doc.items ?? []).map((i) => pick(i, ["description", "quantity", "rate", "amount"])),
  }
  if (kind === "invoice") {
    const inst = (doc as Invoice).installment
    if (inst) d.installment = { index: inst.index, count: inst.count, label: inst.label }
  }
  const payload: Record<string, unknown> = { v: 1, k: kind, d, s: { businessEmail: "", ...pick(settings, SETTINGS_KEYS) } }
  if (kind === "invoice" && opts.amountPaid) payload.paid = opts.amountPaid
  return payloadSchema.parse(payload)
}

// ---- base64url ----
function toBase64Url(bytes: Uint8Array): string {
  let bin = ""
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}
function fromBase64Url(text: string): Uint8Array {
  const b64 = text.replace(/-/g, "+").replace(/_/g, "/")
  const bin = atob(b64 + "=".repeat((4 - (b64.length % 4)) % 4))
  return Uint8Array.from(bin, (c) => c.charCodeAt(0))
}

async function pipe(bytes: Uint8Array, stream: CompressionStream | DecompressionStream, limit = Infinity): Promise<Uint8Array> {
  const reader = new Blob([bytes as BlobPart]).stream().pipeThrough(stream).getReader()
  const chunks: Uint8Array[] = []
  let size = 0
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    size += value.length
    if (size > limit) {
      await reader.cancel()
      throw new Error("Share link is too large")
    }
    chunks.push(value)
  }
  const out = new Uint8Array(size)
  let offset = 0
  for (const c of chunks) {
    out.set(c, offset)
    offset += c.length
  }
  return out
}

/** JSON → deflate-raw → base64url. */
export async function encodeShare(payload: SharePayload): Promise<string> {
  const json = new TextEncoder().encode(JSON.stringify(payload))
  return toBase64Url(await pipe(json, new CompressionStream("deflate-raw")))
}

/** Reverse of encodeShare; returns null for anything that isn't a valid share. */
export async function decodeShare(data: string): Promise<SharePayload | null> {
  try {
    if (!data || data.length > 200_000) return null
    // Cap the inflated size so a crafted link can't exhaust memory.
    const json = await pipe(fromBase64Url(data), new DecompressionStream("deflate-raw"), 2_000_000)
    const parsed = payloadSchema.safeParse(JSON.parse(new TextDecoder().decode(json)))
    return parsed.success ? parsed.data : null
  } catch {
    return null
  }
}

export async function shareUrl(origin: string, payload: SharePayload): Promise<string> {
  return `${origin}/p/${payload.k}#d=${await encodeShare(payload)}`
}

/** Shape a decoded payload into the document type the previews expect. */
export function toPreviewDoc(payload: SharePayload): AnyDoc {
  const now = new Date(0).toISOString()
  const client: Client = { id: "", createdAt: now, ...payload.d.client }
  const items = payload.d.items.map((i, n) => ({ id: String(n), ...i }))
  return { id: "", createdAt: now, updatedAt: now, status: "sent", ...payload.d, client, items } as unknown as AnyDoc
}

export function toPreviewSettings(payload: SharePayload): InvoiceSettings {
  return {
    defaultCurrency: payload.d.currency,
    defaultTaxRate: 0,
    defaultPaymentTerms: "",
    invoicePrefix: "",
    nextInvoiceNumber: 1,
    ...payload.s,
  }
}
