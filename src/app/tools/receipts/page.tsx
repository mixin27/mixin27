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

  const loadData = () => {
    const loadedReceipts = getReceipts()
    setReceipts(loadedReceipts)
    setStats(getReceiptStats())
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this receipt?")) {
      deleteReceipt(id)
      loadData()
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
                <h1 className="text-3xl font-bold mb-2">Receipts</h1>
                <p className="text-muted-foreground">
                  Generate and manage payment receipts
                </p>
              </div>
            </div>
            <Link
              href="/tools/receipts/new"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Plus className="size-4" />
              New Receipt
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
                <ReceiptIcon className="size-6 text-blue-600 dark:text-blue-200" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Receipts</p>
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
                  ${stats.totalAmount.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  Total Amount Received
                </p>
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
                  {stats.total > 0
                    ? `$${(stats.totalAmount / stats.total).toFixed(2)}`
                    : "$0"}
                </p>
                <p className="text-sm text-muted-foreground">Average Amount</p>
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
              className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <select
            value={paymentMethodFilter}
            onChange={(e) => setPaymentMethodFilter(e.target.value)}
            className="px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
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
          <div className="text-center py-12 rounded-lg border bg-card">
            <ReceiptIcon className="size-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No receipts found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery || paymentMethodFilter !== "all"
                ? "Try adjusting your filters"
                : "Get started by creating your first receipt"}
            </p>
            <Link
              href="/tools/receipts/new"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Plus className="size-4" />
              Create Receipt
            </Link>
          </div>
        ) : (
          <div className="rounded-lg border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      Receipt #
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      Payment Date
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      Payment Method
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      Invoice #
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold">
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
                        <span className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:text-blue-200">
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
    </div>
  )
}
