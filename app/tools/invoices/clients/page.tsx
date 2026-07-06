"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Plus, Search, Edit, Trash2, FileText } from "lucide-react"
import {
  getClients,
  deleteClient,
  getInvoices,
} from "@/lib/storage/tools-storage"
import { Client } from "@/types/invoice"

export default function ClientsPage() {
  const [totalInvoices, setTotalInvoices] = useState(0)
  const [clients, setClients] = useState<Client[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [invoiceCounts, setInvoiceCounts] = useState<Record<string, number>>({})

  useEffect(() => {
    loadClients()
  }, [])

  const loadClients = async () => {
    const [loadedClients, invoices] = await Promise.all([
      getClients(),
      getInvoices(),
    ])
    setClients(loadedClients)
    setTotalInvoices(invoices.length)
    
    // Calculate invoice counts per client
    const counts: Record<string, number> = {}
    invoices.forEach((inv) => {
      counts[inv.client.id] = (counts[inv.client.id] || 0) + 1
    })
    setInvoiceCounts(counts)
  }

  const handleDelete = async (id: string) => {
    // Check if client has invoices
    const invoices = await getInvoices()
    const hasInvoices = invoices.some((inv) => inv.client.id === id)

    if (hasInvoices) {
      if (
        !confirm("This client has invoices. Are you sure you want to delete?")
      ) {
        return
      }
    }

    if (confirm("Are you sure you want to delete this client?")) {
      await deleteClient(id)
      await loadClients()
    }
  }


  const filteredClients = clients.filter((client) => {
    const query = searchQuery.toLowerCase()
    return (
      client.name.toLowerCase().includes(query) ||
      client.email.toLowerCase().includes(query) ||
      client.phone?.toLowerCase().includes(query)
    )
  })

  return (
    <>
      {/* Header */}
      <div className="relative border-b border-border/70 pt-32 pb-20">
        <div
          className="pointer-events-none absolute -top-10 right-0 size-[500px] rounded-full bg-purple-500/8 blur-[120px]"
          aria-hidden="true"
        />
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-start justify-between">
            <div>
              <Link
                href="/tools/invoices"
                className="mb-8 flex items-center gap-2 font-mono text-[11px] tracking-widest text-purple-400 uppercase transition-colors hover:text-purple-300"
              >
                <ArrowLeft className="size-3" />
                Back to Invoices
              </Link>
              <h1 className="mb-4 text-5xl font-bold tracking-tight">Clients</h1>
              <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
                Manage your client information
              </p>
            </div>
            <div className="shrink-0 pt-14">
              <Link
                href="/tools/invoices/clients/new"
                className="inline-flex items-center gap-2 rounded-xl bg-purple-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-purple-400"
              >
                <Plus className="size-4" />
                New Client
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="rounded-2xl border border-border bg-card/60 p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
              <div>
                <p className="bg-linear-to-br from-purple-400 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">{clients.length}</p>
                <p className="mt-1 font-mono text-[11px] tracking-widest text-muted-foreground/80 uppercase">Total Clients</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card/60 p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <FileText className="size-6 text-purple-400" />
              </div>
              <div>
                <p className="bg-linear-to-br from-purple-400 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">{totalInvoices}</p>
                <p className="mt-1 font-mono text-[11px] tracking-widest text-muted-foreground/80 uppercase">Total Invoices</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card/60 p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
              <div>
                <p className="bg-linear-to-br from-purple-400 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">
                  {clients.length > 0
                    ? (totalInvoices / clients.length).toFixed(1)
                    : 0}
                </p>
                <p className="mt-1 font-mono text-[11px] tracking-widest text-muted-foreground/80 uppercase">
                  Avg Invoices/Client
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background/80 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20"
            />
          </div>
        </div>

        {/* Clients List */}
        {filteredClients.length === 0 ? (
          <div className="text-center py-16 rounded-2xl border border-border bg-card/60 shadow-sm">
            <div className="size-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <span className="text-3xl">👥</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">No clients found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery
                ? "Try adjusting your search"
                : "Get started by adding your first client"}
            </p>
            {!searchQuery && (
              <Link
                href="/tools/invoices/clients/new"
                className="inline-flex items-center gap-2 rounded-xl bg-purple-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-purple-400"
              >
                <Plus className="size-4" />
                Add Client
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClients.map((client) => (
              <div
                key={client.id}
                className="rounded-2xl border border-border bg-card/60 p-6 shadow-sm hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="size-12 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 font-bold text-xl">
                    {client.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/tools/invoices/clients/${client.id}`}
                      className="p-2 hover:bg-muted rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit className="size-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(client.id)}
                      className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>

                <h3 className="font-semibold text-lg mb-1">{client.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {client.email}
                </p>

                {client.phone && (
                  <p className="text-sm text-muted-foreground mb-4">
                    {client.phone}
                  </p>
                )}

                {client.address && (
                  <p className="text-sm text-muted-foreground mb-4">
                    {client.address}
                    {client.city && `, ${client.city}`}
                  </p>
                )}

                <div className="pt-4 border-t flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="size-4" />
                    <span>{invoiceCounts[client.id] || 0} invoices</span>
                  </div>
                  <Link
                    href={`/tools/invoices/new?clientId=${client.id}`}
                    className="text-sm text-purple-400 hover:underline"
                  >
                    New Invoice
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
