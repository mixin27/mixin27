'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Search, Edit, Trash2, FileText } from 'lucide-react'
import { getClients, deleteClient, getInvoices } from '@/lib/invoice-storage'
import { Client } from '@/types/invoice'

export default function ClientsPage() {
  const [totalInvoices, setTotalInvoices] = useState(0)
  const [clients, setClients] = useState<Client[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadClients()
  }, [])

  const loadClients = () => {
    setClients(getClients())
  }

  useEffect(() => {
    loadInvoices()
  }, [])

  const loadInvoices = () => {
    setTotalInvoices(getInvoices().length)
  }

  const handleDelete = (id: string) => {
    // Check if client has invoices
    const invoices = getInvoices()
    const hasInvoices = invoices.some((inv) => inv.client.id === id)

    if (hasInvoices) {
      if (
        !confirm('This client has invoices. Are you sure you want to delete?')
      ) {
        return
      }
    }

    if (confirm('Are you sure you want to delete this client?')) {
      deleteClient(id)
      loadClients()
    }
  }

  const getClientInvoiceCount = (clientId: string) => {
    const invoices = getInvoices()
    return invoices.filter((inv) => inv.client.id === clientId).length
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/tools/invoices"
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <ArrowLeft className="size-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold">Clients</h1>
                <p className="text-muted-foreground">
                  Manage your client information
                </p>
              </div>
            </div>
            <Link
              href="/tools/invoices/clients/new"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Plus className="size-4" />
              New Client
            </Link>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
              <div>
                <p className="text-2xl font-bold">{clients.length}</p>
                <p className="text-sm text-muted-foreground">Total Clients</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <FileText className="size-6 text-green-600 dark:text-green-200" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalInvoices}</p>
                <p className="text-sm text-muted-foreground">Total Invoices</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {clients.length > 0
                    ? (totalInvoices / clients.length).toFixed(1)
                    : 0}
                </p>
                <p className="text-sm text-muted-foreground">
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
              className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Clients List */}
        {filteredClients.length === 0 ? (
          <div className="text-center py-12 rounded-lg border bg-card">
            <div className="size-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <span className="text-3xl">👥</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">No clients found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery
                ? 'Try adjusting your search'
                : 'Get started by adding your first client'}
            </p>
            {!searchQuery && (
              <Link
                href="/tools/invoices/clients/new"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
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
                className="rounded-lg border bg-card p-6 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
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
                    <span>{getClientInvoiceCount(client.id)} invoices</span>
                  </div>
                  <Link
                    href={`/tools/invoices/new?clientId=${client.id}`}
                    className="text-sm text-primary hover:underline"
                  >
                    New Invoice
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
