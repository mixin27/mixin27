"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Plus,
  FileText,
  Search,
  Trash2,
  Eye,
  Edit,
  ArrowLeft,
} from "lucide-react"
import { getQuotations, deleteQuotation } from "@/lib/storage/tools-storage"
import { Quotation } from "@/types/invoice"
import { formatDate } from "@/lib/utils"

export default function QuotationsPage() {
  const [quotations, setQuotations] = useState<Quotation[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
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

  const loadData = async () => {
    const loadedQuotations = await getQuotations()
    setQuotations(loadedQuotations)

    // Calculate stats
    const newStats = {
      total: loadedQuotations.length,
      draft: loadedQuotations.filter((q) => q.status === "draft").length,
      sent: loadedQuotations.filter((q) => q.status === "sent").length,
      accepted: loadedQuotations.filter((q) => q.status === "accepted").length,
      rejected: loadedQuotations.filter((q) => q.status === "rejected").length,
      expired: loadedQuotations.filter((q) => q.status === "expired").length,
      totalValue: loadedQuotations
        .filter((q) => q.status === "accepted")
        .reduce((sum, q) => sum + q.total, 0),
    }
    setStats(newStats)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this quotation?")) {
      await deleteQuotation(id)
      await loadData()
    }
  }

  const filteredQuotations = quotations.filter((quotation) => {
    const matchesSearch =
      quotation.invoiceNumber
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      quotation.client.name.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus =
      statusFilter === "all" || quotation.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: Quotation["status"]) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "sent":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "expired":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      case "draft":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <>
      {/* Header */}
      <div className="relative border-b border-border/70 pt-32 pb-20">
        <div className="pointer-events-none absolute -top-10 right-0 size-[500px] rounded-full bg-purple-500/8 blur-[120px]" aria-hidden="true" />
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-start justify-between">
            <div>
              <Link href="/tools" className="mb-8 flex items-center gap-2 font-mono text-[11px] tracking-widest text-purple-400 uppercase transition-colors hover:text-purple-300">
                <ArrowLeft className="size-3" />
                Back to Tools
              </Link>
              <h1 className="mb-4 text-5xl font-bold tracking-tight">Quotations</h1>
              <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">Create and manage professional quotations</p>
            </div>
            <div className="shrink-0 pt-14">
              <Link
                href="/tools/quotations/new"
                className="inline-flex items-center gap-2 rounded-xl bg-purple-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-purple-400"
              >
                <Plus className="size-4" />
                New Quotation
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="rounded-2xl border border-border bg-card/60 shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <FileText className="size-6 text-purple-400" />
              </div>
              <div>
                <p className="bg-linear-to-br from-purple-400 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">{stats.total}</p>
                <p className="mt-1 font-mono text-[11px] tracking-widest text-muted-foreground/80 uppercase">Total Quotations</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card/60 shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <span className="text-2xl">✓</span>
              </div>
              <div>
                <p className="bg-linear-to-br from-purple-400 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">{stats.accepted}</p>
                <p className="mt-1 font-mono text-[11px] tracking-widest text-muted-foreground/80 uppercase">Accepted</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card/60 shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
              <div>
                <p className="bg-linear-to-br from-purple-400 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">
                  ${stats.totalValue.toLocaleString()}
                </p>
                <p className="mt-1 font-mono text-[11px] tracking-widest text-muted-foreground/80 uppercase">Total Value</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card/60 shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <span className="text-2xl">📤</span>
              </div>
              <div>
                <p className="bg-linear-to-br from-purple-400 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">{stats.sent}</p>
                <p className="mt-1 font-mono text-[11px] tracking-widest text-muted-foreground/80 uppercase">Pending</p>
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
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background/80 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 rounded-xl border border-border bg-background/80 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20"
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
          <div className="text-center py-16 rounded-2xl border border-border bg-card/60 shadow-sm">
            <FileText className="size-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No quotations found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery || statusFilter !== "all"
                ? "Try adjusting your filters"
                : "Get started by creating your first quotation"}
            </p>
            <Link
              href="/tools/quotations/new"
              className="inline-flex items-center gap-2 rounded-xl bg-purple-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-purple-400"
            >
              <Plus className="size-4" />
              Create Quotation
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card/60 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-6 py-4 text-left font-mono text-[11px] tracking-widest text-muted-foreground/80 uppercase">Quote #</th>
                    <th className="px-6 py-4 text-left font-mono text-[11px] tracking-widest text-muted-foreground/80 uppercase">Client</th>
                    <th className="px-6 py-4 text-left font-mono text-[11px] tracking-widest text-muted-foreground/80 uppercase">Issue Date</th>
                    <th className="px-6 py-4 text-left font-mono text-[11px] tracking-widest text-muted-foreground/80 uppercase">Valid Until</th>
                    <th className="px-6 py-4 text-left font-mono text-[11px] tracking-widest text-muted-foreground/80 uppercase">Amount</th>
                    <th className="px-6 py-4 text-left font-mono text-[11px] tracking-widest text-muted-foreground/80 uppercase">Status</th>
                    <th className="px-6 py-4 text-right font-mono text-[11px] tracking-widest text-muted-foreground/80 uppercase">Actions</th>
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
                          {quotation.currency}{" "}
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
    </>
  )
}
