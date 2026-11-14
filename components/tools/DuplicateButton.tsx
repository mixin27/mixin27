"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CopyPlus, Loader2 } from "lucide-react"
import { duplicateDocument } from "@/lib/document-conversions"

const PATHS = { quotation: "quotations", invoice: "invoices", receipt: "receipts" } as const

/** Copies a document as a new draft dated today, then opens it for editing. */
export function DuplicateButton({ kind, id }: { kind: keyof typeof PATHS; id: string }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)

  const duplicate = async () => {
    setBusy(true)
    try {
      const newId = await duplicateDocument(kind, id)
      if (newId) router.push(`/tools/${PATHS[kind]}/${newId}/edit`)
      else setBusy(false)
    } catch {
      setBusy(false)
      alert("Couldn't duplicate this document. Please try again.")
    }
  }

  return (
    <button
      type="button"
      onClick={duplicate}
      disabled={busy}
      className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/60 px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-card disabled:opacity-50"
    >
      {busy ? <Loader2 className="size-4 animate-spin" /> : <CopyPlus className="size-4" />}
      Duplicate
    </button>
  )
}
