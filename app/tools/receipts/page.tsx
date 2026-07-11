"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Plus,
  Receipt as ReceiptIcon,
  Search,
  Trash2,
  Eye,
  Edit,
  ArrowLeft,
} from "lucide-react"
import {
  getReceipts,
  deleteReceipt,
  getReceiptStats,
} from "@/lib/storage/tools-storage"
import { Receipt } from "@/types/invoice"
import { formatDate } from "@/lib/utils"

export default function ReceiptsPage() {
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>("all")
  const [stats, setStats] = useState({
    total: 0,
    totalAmount: 0,
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const [loadedReceipts, stats] = await Promise.all([
      getReceipts(),
      getReceiptStats(),
    ])
    setReceipts(loadedReceipts)
    setStats(stats)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this receipt?")) {
      await deleteReceipt(id)
      await loadData()
    }
  }

  const filteredReceipts = receipts.filter((receipt) => {
    const matchesSearch =
      receipt.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      receipt.client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      receipt.relatedInvoiceNumber
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase())

    const matchesPaymentMethod =
      paymentMethodFilter === "all" ||
      receipt.paymentMethod === paymentMethodFilter

    return matchesSearch && matchesPaymentMethod
  })

  const getPaymentMethodLabel = (method: Receipt["paymentMethod"]) => {
    const labels = {
      cash: "Cash",
      check: "Check",
      bank_transfer: "Bank Transfer",
      credit_card: "Credit Card",
      paypal: "PayPal",
      kbz_pay: "KBZ Kpay",
      aya_pay: "AYA Pay",
      wave_pay: "Wave Pay",
      uab_pay: "UAB Pay",
      cb_pay: "CB Pay",
      other: "Other",
    }
    return labels[method]
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
              <h1 className="mb-4 text-5xl font-bold tracking-tight">Receipts</h1>
              <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">Generate and manage payment receipts</p>
            </div>
            <div className="shrink-0 pt-14">
              <Link
                href="/tools/receipts/new"
                className="inline-flex items-center gap-2 rounded-xl bg-purple-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-purple-400"
              >
                <Plus className="size-4" />
                New Receipt
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="rounded-2xl border border-border bg-card/60 shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <ReceiptIcon className="size-6 text-purple-400" />
              </div>
              <div>
                <p className="bg-linear-to-br from-purple-400 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">{stats.total}</p>
                <p className="mt-1 font-mono text-[11px] tracking-widest text-muted-foreground/80 uppercase">Total Receipts</p>
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
                  ${stats.totalAmount.toLocaleString()}
                </p>
                <p className="mt-1 font-mono text-[11px] tracking-widest text-muted-foreground/80 uppercase">
                  Total Amount Received
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card/60 shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
              <div>
                <p className="bg-linear-to-br from-purple-400 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">
                  {stats.total > 0
                    ? `$${(stats.totalAmount / stats.total).toFixed(2)}`
                    : "$0"}
                </p>
                <p className="mt-1 font-mono text-[11px] tracking-widest text-muted-foreground/80 uppercase">Average Amount</p>
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
              placeholder="Search receipts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 rounded-xl border border-border bg-background/80 px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20"
            />
          </div>
          <select
            value={paymentMethodFilter}
            onChange={(e) => setPaymentMethodFilter(e.target.value)}
            className="rounded-xl border border-border bg-background/80 px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20"
          >
            <option value="all">All Payment Methods</option>
            <option value="cash">Cash</option>
            <option value="check">Check</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="credit_card">Credit Card</option>
            <option value="paypal">PayPal</option>
            <option value="kbz_pay">KBZ KPay</option>
            <option value="aya_pay">AYA Pay</option>
            <option value="cb_pay">CB Pay</option>
            <option value="wave_pay">Wave Pay</option>
            <option value="uab_pay">UAB Pay</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Receipts List */}
        {filteredReceipts.length === 0 ? (
          <div className="text-center py-16 rounded-2xl border border-border bg-card/60 shadow-sm">
            <ReceiptIcon className="size-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No receipts found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery || paymentMethodFilter !== "all"
                ? "Try adjusting your filters"
                : "Get started by creating your first receipt"}
            </p>
            <Link
              href="/tools/receipts/new"
              className="inline-flex items-center gap-2 rounded-xl bg-purple-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-purple-400"
            >
              <Plus className="size-4" />
              Create Receipt
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card/60 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-6 py-4 text-left font-mono text-[11px] tracking-widest text-muted-foreground/80 uppercase">
                      Receipt #
                    </th>
                    <th className="px-6 py-4 text-left font-mono text-[11px] tracking-widest text-muted-foreground/80 uppercase">
                      Client
                    </th>
                    <th className="px-6 py-4 text-left font-mono text-[11px] tracking-widest text-muted-foreground/80 uppercase">
                      Payment Date
                    </th>
                    <th className="px-6 py-4 text-left font-mono text-[11px] tracking-widest text-muted-foreground/80 uppercase">
                      Payment Method
                    </th>
                    <th className="px-6 py-4 text-left font-mono text-[11px] tracking-widest text-muted-foreground/80 uppercase">
                      Invoice #
                    </th>
                    <th className="px-6 py-4 text-left font-mono text-[11px] tracking-widest text-muted-foreground/80 uppercase">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-right font-mono text-[11px] tracking-widest text-muted-foreground/80 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredReceipts.map((receipt) => (
                    <tr key={receipt.id} className="hover:bg-muted/50">
                      <td className="px-6 py-4">
                        <div className="font-medium">
                          {receipt.receiptNumber}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium">{receipt.client.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {receipt.client.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {formatDate(receipt.paymentDate)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-full bg-purple-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:text-blue-200">
                          {getPaymentMethodLabel(receipt.paymentMethod)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {receipt.relatedInvoiceNumber || "-"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium">
                          {receipt.currency}{" "}
                          {receipt.amountPaid.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/tools/receipts/${receipt.id}`}
                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                            title="View"
                          >
                            <Eye className="size-4" />
                          </Link>
                          <Link
                            href={`/tools/receipts/${receipt.id}/edit`}
                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="size-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(receipt.id)}
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

