"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { ToolsPageHeader } from "@/components/tools/ClientForm"
import { RecurringTemplateForm } from "@/components/tools/RecurringTemplateForm"
import { getRecurringTemplateById, saveRecurringTemplate } from "@/lib/storage/tools-storage"
import { getTemplateInvoices } from "@/lib/document-conversions"
import { formatMoney } from "@/lib/tools/totals"
import type { Invoice, RecurringTemplate } from "@/types/invoice"

export default function EditRecurringPage() {
  const router = useRouter()
  const id = useParams().id as string
  const [template, setTemplate] = useState<RecurringTemplate | null | undefined>(undefined)
  const [invoices, setInvoices] = useState<Invoice[]>([])

  useEffect(() => {
    getRecurringTemplateById(id).then(setTemplate)
    getTemplateInvoices(id).then(setInvoices)
  }, [id])

  if (template === undefined) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-purple-400" aria-label="Loading" />
      </div>
    )
  }
  if (template === null) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-lg font-semibold">Recurring template not found</p>
        <Link href="/tools/invoices/recurring" className="text-purple-400 hover:underline">Back to Recurring</Link>
      </div>
    )
  }

  return (
    <>
      <ToolsPageHeader
        backHref="/tools/invoices/recurring"
        backLabel="Back to Recurring"
        title={template.name}
        subtitle={`${template.client.name} · ${invoices.length} invoice${invoices.length === 1 ? "" : "s"} generated so far`}
      />
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12 md:py-16 space-y-8">
        <RecurringTemplateForm
          initial={template}
          submitLabel="Save changes"
          cancelHref="/tools/invoices/recurring"
          onSubmit={async (draft) => {
            // A new schedule starts counting from the new next date.
            const scheduleChanged = draft.nextDate !== template.nextDate || draft.interval !== template.interval
            await saveRecurringTemplate({
              ...template,
              ...draft,
              startDate: scheduleChanged ? draft.nextDate : template.startDate,
              generatedCount: scheduleChanged ? 0 : template.generatedCount,
              active: draft.endDate && draft.endDate < draft.nextDate ? false : template.active,
              updatedAt: new Date().toISOString(),
            })
            router.push("/tools/invoices/recurring")
          }}
        />

        {invoices.length > 0 && (
          <section>
            <h2 className="mb-3 font-mono text-[11px] tracking-widest text-muted-foreground uppercase">Generated invoices</h2>
            <ul className="divide-y divide-border/60 overflow-hidden rounded-2xl border border-border bg-card/60">
              {invoices.map((inv) => (
                <li key={inv.id}>
                  <Link href={`/tools/invoices/${inv.id}`} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3 text-sm hover:bg-muted/40">
                    <span className="font-semibold">{inv.invoiceNumber}</span>
                    <span className="text-muted-foreground">{inv.issueDate}</span>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs capitalize">{inv.status.replace(/_/g, " ")}</span>
                    <span className="ml-auto tabular-nums">{inv.currency} {formatMoney(inv.total, inv.currency)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </>
  )
}
