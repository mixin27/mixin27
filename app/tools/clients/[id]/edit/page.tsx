"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { ClientForm, ToolsPageHeader } from "@/components/tools/ClientForm"
import {
  countClientDrafts,
  getClientById,
  saveClient,
  updateClientOnDrafts,
} from "@/lib/storage/tools-storage"
import type { Client } from "@/types/invoice"

export default function EditClientPage() {
  const router = useRouter()
  const clientId = useParams().id as string
  const [client, setClient] = useState<Client | null | undefined>(undefined)

  useEffect(() => {
    getClientById(clientId).then(setClient)
  }, [clientId])

  if (client === undefined) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-purple-400" aria-label="Loading client" />
      </div>
    )
  }

  if (client === null) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-lg font-semibold">Client not found</p>
        <Link href="/tools/clients" className="text-purple-400 hover:underline">
          Back to Clients
        </Link>
      </div>
    )
  }

  return (
    <>
      <ToolsPageHeader
        backHref={`/tools/clients/${client.id}`}
        backLabel={`Back to ${client.name}`}
        title="Edit Client"
      />
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-12 md:py-16">
        <ClientForm
          initial={client}
          submitLabel="Save Changes"
          cancelHref={`/tools/clients/${client.id}`}
          onSubmit={async (values) => {
            const updated: Client = { ...client, ...values }
            await saveClient(updated)
            const drafts = await countClientDrafts(client.id)
            if (
              drafts > 0 &&
              confirm(
                `Also update the client details on ${drafts} draft document${drafts === 1 ? "" : "s"}?\n\nSent, paid and signed documents keep the details they were issued with.`,
              )
            ) {
              await updateClientOnDrafts(updated)
            }
            router.push(`/tools/clients/${client.id}`)
          }}
        />
      </div>
    </>
  )
}
