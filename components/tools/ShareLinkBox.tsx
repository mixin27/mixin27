"use client"

import { useEffect, useState } from "react"
import { Check, Copy, ExternalLink, Link as LinkIcon } from "lucide-react"
import { buildSharePayload, LONG_LINK_CHARS, shareUrl, type ShareKind } from "@/lib/tools/share-link"
import type { Invoice, InvoiceSettings, Quotation, Receipt } from "@/types/invoice"

type Props = { settings: InvoiceSettings; amountPaid?: number } & (
  | { kind: "invoice"; doc: Invoice }
  | { kind: "quotation"; doc: Quotation }
  | { kind: "receipt"; doc: Receipt }
)

/**
 * A read-only link that carries the document itself, so it works without a
 * server. It is a snapshot: later edits need a new link.
 */
export function ShareLinkBox({ kind, doc, settings, amountPaid }: Props) {
  const [url, setUrl] = useState<string | null>(null)
  const [error, setError] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    let cancelled = false
    setUrl(null)
    setError(false)
    shareUrl(window.location.origin, buildSharePayload(kind as ShareKind, doc, settings, { amountPaid }))
      .then((u) => !cancelled && setUrl(u))
      .catch(() => !cancelled && setError(true))
    return () => {
      cancelled = true
    }
  }, [kind, doc, settings, amountPaid])

  const copy = async () => {
    if (!url) return
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.prompt("Copy this link:", url)
    }
  }

  return (
    <div className="mt-6 mb-6 max-w-xl rounded-xl border border-border bg-muted/50 p-2 print:hidden">
      <div className="flex items-center gap-3">
        <div className="rounded-md bg-purple-500/10 p-2">
          <LinkIcon className="size-4 text-purple-400" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">Share link</p>
          <p className="truncate text-sm">
            {error ? "Couldn't create a link in this browser." : url ? url : "Creating link…"}
          </p>
        </div>
        {url && (
          <>
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              aria-label="Open share link"
              className="rounded-md border border-transparent p-2 text-muted-foreground transition-colors hover:border-border hover:bg-background hover:text-foreground"
            >
              <ExternalLink className="size-4" />
            </a>
            <button
              type="button"
              onClick={copy}
              aria-label={copied ? "Link copied" : "Copy share link"}
              className="rounded-md border border-transparent p-2 text-muted-foreground transition-colors hover:border-border hover:bg-background hover:text-foreground"
            >
              {copied ? <Check className="size-4 text-green-500" /> : <Copy className="size-4" />}
            </button>
          </>
        )}
      </div>
      <p className="px-2 pt-2 text-xs text-muted-foreground">
        Anyone with this link can see this {kind}. The details are inside the link itself, not stored on a server, so
        it shows them as they are now; copy a new link after editing.
        {url && url.length > LONG_LINK_CHARS && " This link is long and some apps may cut it short; send the PDF if it doesn't open."}
      </p>
    </div>
  )
}
