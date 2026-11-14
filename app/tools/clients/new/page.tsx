"use client"

import { v7 as uuidv7 } from "uuid"
import { useRouter, useSearchParams } from "next/navigation"
import { ClientForm, ToolsPageHeader } from "@/components/tools/ClientForm"
import { SearchParamsWrapper } from "@/components/search-params-wrapper"
import { getClients, saveClient } from "@/lib/storage/tools-storage"
import type { Client } from "@/types/invoice"

/** Only same-site paths under /tools may be used as a return target. */
function safeReturnTo(value: string | null): string | null {
  return value && value.startsWith("/tools/") && !value.startsWith("//") ? value : null
}

function NewClient() {
  const router = useRouter()
  const returnTo = safeReturnTo(useSearchParams().get("returnTo"))

  return (
    <>
      <ToolsPageHeader
        backHref={returnTo ?? "/tools/clients"}
        backLabel={returnTo ? "Back" : "Back to Clients"}
        title="New Client"
        subtitle="Add a client so you can reuse their details on quotations, invoices and receipts."
      />
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-12 md:py-16">
        <ClientForm
          submitLabel="Save Client"
          cancelHref={returnTo ?? "/tools/clients"}
          onSubmit={async (values) => {
            const email = values.email.toLowerCase()
            const duplicate = (await getClients()).find(
              (c) => c.email?.trim().toLowerCase() === email,
            )
            if (
              duplicate &&
              !confirm(`${duplicate.name} already uses ${values.email}. Add another client with the same email?`)
            ) {
              return
            }
            const client: Client = {
              ...values,
              id: uuidv7(),
              createdAt: new Date().toISOString(),
            }
            await saveClient(client)
            if (returnTo) {
              const sep = returnTo.includes("?") ? "&" : "?"
              router.push(`${returnTo}${sep}clientId=${client.id}`)
            } else {
              router.push(`/tools/clients/${client.id}`)
            }
          }}
        />
      </div>
    </>
  )
}

export default function NewClientPage() {
  return (
    <SearchParamsWrapper>
      <NewClient />
    </SearchParamsWrapper>
  )
}
