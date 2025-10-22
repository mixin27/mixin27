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
  ArrowLeft,
} from 'lucide-react'
import {
  getQuotations,
  deleteQuotation,
  getClients,
} from '@/lib/invoice-storage'
import { Quotation } from '@/types/invoice'
import { formatDate } from '@/lib/utils'

export default function QuotationsPage() {
  const [quotations, setQuotations] = useState<Quotation[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [stats, setStats] = useState({
    total: 0,
    draft: 0,
    sent: 0,
    accepted: 0,
    rejected: 0,
    expired: 0,
    totalValue: 0,
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    const loadedQuotations = getQuotations()
    setQuotations(loadedQuotations)

    // Calculate stats
    const newStats = {
      total: loadedQuotations.length,
      draft: loadedQuotations.filter((q) => q.status === 'draft').length,
      sent: loadedQuotations.filter((q) => q.status === 'sent').length,
      accepted: loadedQuotations.filter((q) => q.status === 'accepted').length,
      rejected: loadedQuotations.filter((q) => q.status === 'rejected').length,
      expired: loadedQuotations.filter((q) => q.status === 'expired').length,
      totalValue: loadedQuotations
        .filter((q) => q.status === 'accepted')
        .reduce((sum, q) => sum + q.total, 0),
    }
    setStats(newStats)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this quotation?')) {
      deleteQuotation(id)
      loadData()
    }
  }

  const filteredQuotations = quotations.filter((quotation) => {
    const matchesSearch =
      quotation.invoiceNumber
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      quotation.client.name.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus =
      statusFilter === 'all' || quotation.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: Quotation['status']) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'sent':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'expired':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      case 'draft':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/tools"
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <ArrowLeft className="size-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold mb-2">Quotations</h1>
                <p className="text-muted-foreground">
                  Create and manage professional quotations
                </p>
              </div>
            </div>
            <Link
              href="/tools/quotations/new"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Plus className="size-4" />
              New Quotation
            </Link>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <FileText className="size-6 text-blue-600 dark:text-blue-200" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">
                  Total Quotations
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <span className="text-2xl">✓</span>
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.accepted}</p>
                <p className="text-sm text-muted-foreground">Accepted</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
              <div>
                <p className="text-2xl font-bold">
                  ${stats.totalValue.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Total Value</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                <span className="text-2xl">📤</span>
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.sent}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search quotations..."
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
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
            <option value="expired">Expired</option>
          </select>
        </div>

        {/* Quotations List */}
        {filteredQuotations.length === 0 ? (
          <div className="text-center py-12 rounded-lg border bg-card">
            <FileText className="size-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No quotations found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Get started by creating your first quotation'}
            </p>
            <Link
              href="/tools/quotations/new"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Plus className="size-4" />
              Create Quotation
            </Link>
          </div>
        ) : (
          <div className="rounded-lg border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      Quote #
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      Issue Date
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      Valid Until
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
                  {filteredQuotations.map((quotation) => (
                    <tr key={quotation.id} className="hover:bg-muted/50">
                      <td className="px-6 py-4">
                        <div className="font-medium">
                          {quotation.invoiceNumber}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium">
                          {quotation.client.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {quotation.client.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {formatDate(quotation.issueDate)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {formatDate(quotation.validUntil)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium">
                          {quotation.currency}{' '}
                          {quotation.total.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                            quotation.status,
                          )}`}
                        >
                          {quotation.status.charAt(0).toUpperCase() +
                            quotation.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/tools/quotations/${quotation.id}`}
                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                            title="View"
                          >
                            <Eye className="size-4" />
                          </Link>
                          <Link
                            href={`/tools/quotations/${quotation.id}/edit`}
                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="size-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(quotation.id)}
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
