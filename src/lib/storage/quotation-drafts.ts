import type { InvoiceItem } from "@/types/invoice"

export type QuotationDraft = {
  id: string
  source: "pricing-calculator" | "manual"
  createdAt: string
  currency: string
  taxRate: number
  discount: number
  discountType: "percentage" | "fixed"
  notes?: string
  terms?: string
  items: InvoiceItem[]
}

const STORAGE_KEY = "quotation_drafts"

const readDrafts = (): QuotationDraft[] => {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEY)
  if (!data) return []
  try {
    const parsed = JSON.parse(data)
    return Array.isArray(parsed) ? (parsed as QuotationDraft[]) : []
  } catch (error) {
    console.error("Failed to parse quotation drafts", error)
    return []
  }
}

const writeDrafts = (drafts: QuotationDraft[]) => {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts))
}

export const saveQuotationDraft = (draft: QuotationDraft) => {
  const drafts = readDrafts()
  const index = drafts.findIndex((item) => item.id === draft.id)
  if (index >= 0) {
    drafts[index] = draft
  } else {
    drafts.unshift(draft)
  }
  writeDrafts(drafts)
}

export const getQuotationDraft = (id: string): QuotationDraft | null => {
  const drafts = readDrafts()
  return drafts.find((draft) => draft.id === id) ?? null
}

export const deleteQuotationDraft = (id: string) => {
  const drafts = readDrafts().filter((draft) => draft.id !== id)
  writeDrafts(drafts)
}
