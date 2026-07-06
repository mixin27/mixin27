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
import {
  getContracts,
  deleteContract,
  getContractStats,
} from "@/lib/storage/tools-storage"
import { Contract } from "@/types/invoice"
import { formatDate } from "@/lib/utils"

export default function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [stats, setStats] = useState({
    total: 0,
    draft: 0,
    sent: 0,
    signed: 0,
    active: 0,
    completed: 0,
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const [loadedContracts, stats] = await Promise.all([
      getContracts(),
      getContractStats(),
    ])
    setContracts(loadedContracts)
    setStats(stats)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this contract?")) {
      await deleteContract(id)
      await loadData()
    }
  }

  const filteredContracts = contracts.filter((contract) => {
    const matchesSearch =
      contract.contractNumber
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      contract.client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.projectName.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus =
      statusFilter === "all" || contract.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: Contract["status"]) => {
    switch (status) {
      case "signed":
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "sent":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "completed":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "terminated":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
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
              <h1 className="mb-4 text-5xl font-bold tracking-tight">Contracts</h1>
              <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">Manage your service agreements and contracts</p>
            </div>
            <div className="shrink-0 pt-14">
              <Link
                href="/tools/contracts/new"
                className="inline-flex items-center gap-2 rounded-xl bg-purple-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-purple-400"
              >
                <Plus className="size-4" />
                New Contract
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
              <div className="size-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <FileText className="size-6 text-purple-400" />
              </div>
              <div>
                <p className="bg-linear-to-br from-purple-400 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">{stats.total}</p>
                <p className="mt-1 font-mono text-[11px] tracking-widest text-muted-foreground/80 uppercase">Total Contracts</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card/60 shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <span className="text-2xl text-purple-400">✓</span>
              </div>
              <div>
                <p className="bg-linear-to-br from-purple-400 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">{stats.signed}</p>
                <p className="mt-1 font-mono text-[11px] tracking-widest text-muted-foreground/80 uppercase">Signed</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card/60 shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <span className="text-2xl text-purple-400">🔄</span>
              </div>
              <div>
                <p className="bg-linear-to-br from-purple-400 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">{stats.active}</p>
                <p className="mt-1 font-mono text-[11px] tracking-widest text-muted-foreground/80 uppercase">Active</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card/60 shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <span className="text-2xl text-purple-400">📤</span>
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
              placeholder="Search contracts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background/80 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-border bg-background/80 px-4 py-3 text-sm text-foreground outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="signed">Signed</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="terminated">Terminated</option>
          </select>
        </div>

        {/* Contracts List */}
        {filteredContracts.length === 0 ? (
          <div className="text-center py-16 rounded-2xl border border-border bg-card/60 shadow-sm">
            <FileText className="size-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No contracts found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery || statusFilter !== "all"
                ? "Try adjusting your filters"
                : "Get started by creating your first contract"}
            </p>
            <Link
              href="/tools/contracts/new"
              className="inline-flex items-center gap-2 rounded-xl bg-purple-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-purple-400"
            >
              <Plus className="size-4" />
              Create Contract
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card/60 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-6 py-4 text-left font-mono text-[11px] tracking-widest text-muted-foreground/80 uppercase">
                      Contract #
                    </th>
                    <th className="px-6 py-4 text-left font-mono text-[11px] tracking-widest text-muted-foreground/80 uppercase">
                      Client
                    </th>
                    <th className="px-6 py-4 text-left font-mono text-[11px] tracking-widest text-muted-foreground/80 uppercase">
                      Project
                    </th>
                    <th className="px-6 py-4 text-left font-mono text-[11px] tracking-widest text-muted-foreground/80 uppercase">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left font-mono text-[11px] tracking-widest text-muted-foreground/80 uppercase">
                      Start Date
                    </th>
                    <th className="px-6 py-4 text-left font-mono text-[11px] tracking-widest text-muted-foreground/80 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right font-mono text-[11px] tracking-widest text-muted-foreground/80 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredContracts.map((contract) => (
                    <tr key={contract.id} className="hover:bg-muted/50">
                      <td className="px-6 py-4">
                        <div className="font-medium">
                          {contract.contractNumber}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium">
                          {contract.client.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {contract.client.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium">
                          {contract.projectName}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {contract.templateName}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {formatDate(contract.startDate)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                            contract.status,
                          )}`}
                        >
                          {contract.status.charAt(0).toUpperCase() +
                            contract.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/tools/contracts/${contract.id}`}
                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                            title="View"
                          >
                            <Eye className="size-4" />
                          </Link>
                          <Link
                            href={`/tools/contracts/${contract.id}/edit`}
                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="size-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(contract.id)}
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
