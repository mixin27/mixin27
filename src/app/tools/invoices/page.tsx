'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Plus,
  FileText,
  Search,
  Trash2,
  Eye,
  Edit,
  PersonStanding,
} from 'lucide-react'
import {
  getInvoices,
  getInvoiceStats,
  deleteInvoice,
} from '@/lib/invoice-storage'
import { Invoice } from '@/types/invoice'
import { formatDate } from '@/lib/utils'

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [stats, setStats] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    setInvoices(getInvoices())
    setStats(getInvoiceStats())
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this invoice?')) {
      deleteInvoice(id)
      loadData()
    }
  }

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.client.name.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus =
      statusFilter === 'all' || invoice.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'sent':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'overdue':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'draft':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
      case 'cancelled':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Invoices</h1>
              <p className="text-muted-foreground">
                Manage your invoices and track payments
              </p>
            </div>
            <div>
              <Link
                href="/tools/invoices/clients"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <PersonStanding className="size-4" />
                All Clients
              </Link>
              <Link
                href="/tools/invoices/new"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <Plus className="size-4" />
                New Invoice
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="rounded-lg border bg-card p-6">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <FileText className="size-6 text-blue-600 dark:text-blue-200" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-sm text-muted-foreground">
                    Total Invoices
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-card p-6">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <span className="text-2xl">💰</span>
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    ${stats.totalRevenue.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-card p-6">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                  <span className="text-2xl">⏳</span>
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    ${stats.pendingRevenue.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-card p-6">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                  <span className="text-2xl">✓</span>
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.paid}</p>
                  <p className="text-sm text-muted-foreground">Paid Invoices</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search invoices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Invoices List */}
        {filteredInvoices.length === 0 ? (
          <div className="text-center py-12 rounded-lg border bg-card">
            <FileText className="size-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No invoices found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Get started by creating your first invoice'}
            </p>
            <Link
              href="/tools/invoices/new"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Plus className="size-4" />
              Create Invoice
            </Link>
          </div>
        ) : (
          <div className="rounded-lg border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      Invoice
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      Due Date
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-muted/50">
                      <td className="px-6 py-4">
                        <div className="font-medium">
                          {invoice.invoiceNumber}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium">{invoice.client.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {invoice.client.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {formatDate(invoice.issueDate)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {formatDate(invoice.dueDate)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium">
                          {invoice.currency} {invoice.total.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                            invoice.status,
                          )}`}
                        >
                          {invoice.status.charAt(0).toUpperCase() +
                            invoice.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/tools/invoices/${invoice.id}`}
                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                            title="View"
                          >
                            <Eye className="size-4" />
                          </Link>
                          <Link
                            href={`/tools/invoices/${invoice.id}/edit`}
                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="size-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(invoice.id)}
                            className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
