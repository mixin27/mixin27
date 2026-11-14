"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { v7 as uuidv7 } from "uuid"
import { ToolsPageHeader } from "@/components/tools/ClientForm"
import { SearchParamsWrapper } from "@/components/search-params-wrapper"
import {
  RecurringTemplateForm,
  emptyTemplateDraft,
  type TemplateDraft,
} from "@/components/tools/RecurringTemplateForm"
import { getInvoiceById, saveRecurringTemplate } from "@/lib/storage/tools-storage"
import { templateFromInvoice } from "@/lib/tools/recurring"

function NewRecurring() {
  const router = useRouter()
  const params = useSearchParams()
  const fromInvoice = params.get("fromInvoice")
  const clientId = params.get("clientId")
  const [initial, setInitial] = useState<TemplateDraft | null>(null)

  useEffect(() => {
    const load = async () => {
      const invoice = fromInvoice ? await getInvoiceById(fromInvoice) : null
      setInitial(
        invoice
          ? templateFromInvoice(invoice, new Date().toISOString().slice(0, 10))
          : emptyTemplateDraft(clientId ?? ""),
      )
    }
    load()
  }, [fromInvoice, clientId])

  return (
    <>
      <ToolsPageHeader
        backHref="/tools/invoices/recurring"
        backLabel="Back to Recurring"
        title="New Recurring Invoice"
        subtitle="Set it up once. When an invoice is due, generate it as a draft with one click."
      />
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12 md:py-16">
        {initial && (
          <RecurringTemplateForm
            initial={initial}
            submitLabel="Save template"
            cancelHref="/tools/invoices/recurring"
            onSubmit={async (draft) => {
              const now = new Date().toISOString()
              const id = uuidv7()
              await saveRecurringTemplate({
                ...draft,
                id,
                startDate: draft.nextDate,
                generatedCount: 0,
                createdAt: now,
                updatedAt: now,
              })
              router.push("/tools/invoices/recurring")
            }}
          />
        )}
      </div>
    </>
  )
}

export default function NewRecurringPage() {
  return (
    <SearchParamsWrapper>
      <NewRecurring />
    </SearchParamsWrapper>
  )
}
