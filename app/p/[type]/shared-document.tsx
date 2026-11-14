"use client"

import { useEffect, useRef, useState } from "react"
import { Download, Printer } from "lucide-react"
import { InvoicePreview } from "@/components/tools/InvoicePreview"
import { QuotationPreview } from "@/components/tools/QuotationPreview"
import { ReceiptPreview } from "@/components/tools/ReceiptPreview"
import { exportElementToPdf } from "@/lib/pdf-export"
import { decodeShare, toPreviewDoc, toPreviewSettings, type SharePayload, type ShareKind } from "@/lib/tools/share-link"
import type { Invoice, Quotation, Receipt } from "@/types/invoice"

type State = { status: "loading" } | { status: "invalid" } | { status: "ok"; payload: SharePayload }

const LABELS: Record<ShareKind, string> = { invoice: "invoice", quotation: "quotation", receipt: "receipt" }

/** Read-only view of a document whose data lives in the URL fragment. */
export function SharedDocument({ kind }: { kind: ShareKind }) {
  const [state, setState] = useState<State>({ status: "loading" })
  const [busy, setBusy] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const load = async () => {
      const data = new URLSearchParams(window.location.hash.slice(1)).get("d") ?? ""
      const payload = await decodeShare(data)
      setState(payload && payload.k === kind ? { status: "ok", payload } : { status: "invalid" })
    }
    load()
    window.addEventListener("hashchange", load)
    return () => window.removeEventListener("hashchange", load)
  }, [kind])

  if (state.status === "loading") {
    return <p className="py-40 text-center text-muted-foreground">Loading…</p>
  }
  if (state.status === "invalid") {
    return (
      <div className="mx-auto max-w-lg px-6 py-40 text-center">
        <h1 className="mb-3 text-2xl font-semibold">This link doesn&apos;t work</h1>
        <p className="text-muted-foreground">
          The {LABELS[kind]} link may be incomplete. Some apps cut long links short, so ask the sender to share it again
          or to send the PDF instead.
        </p>
      </div>
    )
  }

  const { payload } = state
  const doc = toPreviewDoc(payload)
  const settings = toPreviewSettings(payload)
  const number =
    payload.k === "receipt" ? payload.d.receiptNumber : payload.d.invoiceNumber

  const download = async () => {
    if (!ref.current) return
    setBusy(true)
    try {
      await exportElementToPdf(ref.current, `${number || LABELS[kind]}.pdf`)
    } catch {
      alert("Couldn't create the PDF. Try Print and choose Save as PDF instead.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-28 pb-16 print:p-0">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div>
          <h1 className="text-xl font-semibold">
            <span className="capitalize">{LABELS[kind]}</span> {number} from {payload.s.businessName || "the sender"}
          </h1>
          <p className="text-sm text-muted-foreground">A read-only copy shared by link. It doesn&apos;t update if the original changes.</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/60 px-4 py-2 text-sm font-semibold hover:bg-card"
          >
            <Printer className="size-4" />
            Print
          </button>
          <button
            type="button"
            onClick={download}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-xl bg-purple-500 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-400 disabled:opacity-50"
          >
            <Download className="size-4" />
            {busy ? "Generating…" : "Download PDF"}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div ref={ref}>
          {payload.k === "invoice" ? (
            <InvoicePreview invoice={doc as Invoice} settings={settings} amountPaid={payload.paid ?? 0} />
          ) : payload.k === "quotation" ? (
            <QuotationPreview quotation={doc as Quotation} settings={settings} />
          ) : (
            <ReceiptPreview receipt={doc as Receipt} settings={settings} />
          )}
        </div>
      </div>
    </div>
  )
}
