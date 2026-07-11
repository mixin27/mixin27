"use client"

import { v7 as uuidv7 } from 'uuid'
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Plus, Trash2, Save } from "lucide-react"
import {
  saveQuotation,
  getQuotationById,
  getClients,
} from "@/lib/storage/tools-storage"
import { Client, InvoiceItem, Quotation } from "@/types/invoice"

export default function EditQuotationPage() {
  const params = useParams()
  const router = useRouter()

  const [clients, setClients] = useState<Client[]>([])
  const [selectedClientId, setSelectedClientId] = useState<string>("")
  const [quotationNumber, setQuotationNumber] = useState<string>("")
  const [issueDate, setIssueDate] = useState<string>("")
  const [validUntil, setValidUntil] = useState<string>("")
  const [status, setStatus] = useState<Quotation["status"]>("draft")
  const [items, setItems] = useState<InvoiceItem[]>([])
  const [currency, setCurrency] = useState<string>("USD")
  const [taxRate, setTaxRate] = useState<number>(0)
  const [discount, setDiscount] = useState<number>(0)
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">(
    "percentage",
  )
  const [notes, setNotes] = useState<string>("")
  const [terms, setTerms] = useState<string>("")
  const [originalQuotation, setOriginalQuotation] = useState<Quotation | null>(
    null,
  )
  const [isCalculatorQuote, setIsCalculatorQuote] = useState(false)

  const isCalculatorQuotation = (quotation: Quotation) => {
    const note = quotation.notes?.toLowerCase() ?? ""
    if (note.includes("generated from pricing calculator")) return true
    const prefixes = ["Base:", "Feature:", "Add-on:"]
    return quotation.items.some((item) =>
      prefixes.some((prefix) => item.description.startsWith(prefix)),
    )
  }

  useEffect(() => {
    const loadData = async () => {
      const id = params.id as string
      const [loadedQuotation, loadedClients] = await Promise.all([
        getQuotationById(id),
        getClients(),
      ])

      if (!loadedQuotation) {
        router.push("/tools/quotations")
        return
      }

      setOriginalQuotation(loadedQuotation)
      setClients(loadedClients)
      setSelectedClientId(loadedQuotation.client.id)
      setQuotationNumber(loadedQuotation.invoiceNumber)
      setIssueDate(loadedQuotation.issueDate.split("T")[0])
      setValidUntil(loadedQuotation.validUntil.split("T")[0])
      setStatus(loadedQuotation.status)
      setItems(loadedQuotation.items)
      setCurrency(loadedQuotation.currency)
      setTaxRate(loadedQuotation.taxRate)
      setDiscount(loadedQuotation.discount)
      setDiscountType(loadedQuotation.discountType)
      setNotes(loadedQuotation.notes || "")
      setTerms(loadedQuotation.terms || "")
      setIsCalculatorQuote(isCalculatorQuotation(loadedQuotation))
    }

    loadData()
  }, [params.id, router])

  const addItem = () => {
    setItems([
      ...items,
      {
        id: uuidv7(),
        description: "",
        quantity: 1,
        rate: 0,
        amount: 0,
      },
    ])
  }

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id))
    }
  }

  const getCurrencyDecimals = () => {
    return currency.toUpperCase() === "MMK" ? 0 : 2
  }

  const roundMoney = (value: number) => {
    const decimals = getCurrencyDecimals()
    return Number(value.toFixed(decimals))
  }

  const formatMoney = (value: number) => {
    const decimals = getCurrencyDecimals()
    return value.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
  }

  const parseIntegerInput = (value: string) => {
    const digits = value.replace(/[^\d]/g, "")
    return digits ? Number(digits) : 0
  }

  const updateItem = (
    id: string,
    field: keyof InvoiceItem,
    value: string | number,
  ) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          let nextValue = value
          if (typeof value === "string" && field === "rate") {
            nextValue = parseIntegerInput(value)
          }
          const updated = { ...item, [field]: nextValue }
          if (field === "quantity" || field === "rate") {
            updated.amount = roundMoney(updated.quantity * updated.rate)
          }
          return updated
        }
        return item
      }),
    )
  }

  const calculateTotals = () => {
    const subtotal = roundMoney(
      items.reduce((sum, item) => sum + roundMoney(item.amount), 0),
    )
    const discountAmount =
      discountType === "percentage"
        ? roundMoney(subtotal * (discount / 100))
        : roundMoney(discount)
    const taxableAmount = roundMoney(subtotal - discountAmount)
    const taxAmount = roundMoney(taxableAmount * (taxRate / 100))
    const total = roundMoney(taxableAmount + taxAmount)

    return {
      subtotal,
      discountAmount,
      taxAmount,
      total,
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedClientId) {
      alert("Please select a client")
      return
    }

    if (!originalQuotation) {
      return
    }

    const client = clients.find((c) => c.id === selectedClientId)
    if (!client) {
      alert("Invalid client selected")
      return
    }

    const totals = calculateTotals()

    const updatedQuotation: Quotation = {
      ...originalQuotation,
      invoiceNumber: quotationNumber,
      client,
      issueDate,
      dueDate: validUntil,
      validUntil,
      status,
      items: items.filter((item) => item.description.trim() !== ""),
      subtotal: totals.subtotal,
      taxRate,
      taxAmount: totals.taxAmount,
      discount,
      discountType,
      total: totals.total,
      notes,
      terms,
      currency,
      updatedAt: new Date().toISOString(),
    }

    await saveQuotation(updatedQuotation)
    router.push(`/tools/quotations/${originalQuotation.id}`)
  }

  const totals = calculateTotals()

  if (!originalQuotation) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Header */}
      <div className="relative border-b border-border/70 pt-32 pb-20">
        <div className="pointer-events-none absolute -top-10 right-0 size-[500px] rounded-full bg-purple-500/8 blur-[120px]" aria-hidden="true" />
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-start justify-between">
            <div>
              <Link href="/tools/quotations" className="mb-8 flex items-center gap-2 font-mono text-[11px] tracking-widest text-purple-400 uppercase transition-colors hover:text-purple-300">
                <ArrowLeft className="size-3" />
                Back to Tools
              </Link>
              <h1 className="mb-4 text-5xl font-bold tracking-tight">Edit Quotation</h1>
              <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">Update quotation details</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-16">
        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-8">
          {/* Basic Info */}
          <div className="rounded-2xl border border-border bg-card/60 shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase mb-2 block">
                  Quotation Number <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={quotationNumber}
                  onChange={(e) => setQuotationNumber(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background/80 px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20"
                  required
                />
              </div>

              <div>
                <label className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase mb-2 block">Status</label>
                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value as Quotation["status"])
                  }
                  className="w-full rounded-xl border border-border bg-background/80 px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20"
                >
                  <option value="draft">Draft</option>
                  <option value="sent">Sent</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                  <option value="expired">Expired</option>
                </select>
              </div>

              <div>
                <label className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase mb-2 block">
                  Issue Date <span className="text-destructive">*</span>
                </label>
                <input
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background/80 px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20"
                  required
                />
              </div>

              <div>
                <label className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase mb-2 block">
                  Valid Until <span className="text-destructive">*</span>
                </label>
                <input
                  type="date"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background/80 px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20"
                  required
                />
              </div>

              <div>
                <label className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase mb-2 block">
                  Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background/80 px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20"
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="MMK">MMK - Myanmar Kyat</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="CAD">CAD - Canadian Dollar</option>
                  <option value="AUD">AUD - Australian Dollar</option>
                </select>
              </div>
            </div>
          </div>

          {/* Client Selection */}
          <div className="rounded-2xl border border-border bg-card/60 shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">Client</h2>
            <div>
              <label className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase mb-2 block">
                Select Client <span className="text-destructive">*</span>
              </label>
              <select
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="w-full rounded-xl border border-border bg-background/80 px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20"
                required
              >
                <option value="">Choose a client...</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name} ({client.email})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Line Items */}
          <div className="rounded-2xl border border-border bg-card/60 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold">Line Items</h2>
                {isCalculatorQuote && (
                  <p className="text-xs text-muted-foreground mt-1">Unit: days</p>
                )}
              </div>
              <button
                type="button"
                onClick={addItem}
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/60 px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-card"
              >
                <Plus className="size-4" />
                Add Item
              </button>
            </div>

            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-12 gap-4 items-start"
                >
                  <div className="col-span-12 md:col-span-5">
                    <input
                      type="text"
                      placeholder="Item description"
                      value={item.description}
                      onChange={(e) =>
                        updateItem(item.id, "description", e.target.value)
                      }
                      className="w-full rounded-xl border border-border bg-background/80 px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20"
                      required
                    />
                  </div>
                  <div className="col-span-4 md:col-span-2">
                    <input
                      type="number"
                      placeholder={isCalculatorQuote ? "Days" : "Qty"}
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(item.id, "quantity", Number(e.target.value))
                      }
                      min="0"
                      step={isCalculatorQuote ? "0.5" : "0.01"}
                      className="w-full rounded-xl border border-border bg-background/80 px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20"
                      required
                    />
                  </div>
                  <div className="col-span-4 md:col-span-2">
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder={isCalculatorQuote ? "Day rate" : "Rate"}
                      value={item.rate.toString()}
                      onChange={(e) => updateItem(item.id, "rate", e.target.value)}
                      className="w-full rounded-xl border border-border bg-background/80 px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20"
                      required
                    />
                  </div>
                  <div className="col-span-3 md:col-span-2">
                    <input
                      type="text"
                      value={`${currency} ${formatMoney(item.amount)}`}
                      disabled
                      className="w-full rounded-xl border border-border bg-muted px-4 py-3 text-sm text-muted-foreground"
                    />
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      disabled={items.length === 1}
                      className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Calculations */}
          <div className="rounded-2xl border border-border bg-card/60 shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">Calculations</h2>
            <div className="max-w-md ml-auto space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="font-medium">
                  {currency} {formatMoney(totals.subtotal)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase mb-2 block">
                    Discount
                  </label>
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    min="0"
                    step="0.01"
                    className="w-full rounded-xl border border-border bg-background/80 px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20"
                  />
                </div>
                <div>
                  <label className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase mb-2 block">Type</label>
                  <select
                    value={discountType}
                    onChange={(e) =>
                      setDiscountType(e.target.value as "percentage" | "fixed")
                    }
                    className="w-full rounded-xl border border-border bg-background/80 px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20"
                  >
                    <option value="percentage">%</option>
                    <option value="fixed">Fixed</option>
                  </select>
                </div>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Discount Amount:
                  </span>
                  <span className="font-medium">
                    -{currency} {formatMoney(totals.discountAmount)}
                  </span>
                </div>
              )}

              <div>
                <label className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase mb-2 block">
                  Tax Rate (%)
                </label>
                <input
                  type="number"
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value))}
                  min="0"
                  step="0.01"
                  className="w-full rounded-xl border border-border bg-background/80 px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20"
                />
              </div>

              {taxRate > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax Amount:</span>
                  <span className="font-medium">
                    {currency} {formatMoney(totals.taxAmount)}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-lg font-bold pt-4 border-t">
                <span>Total:</span>
                <span>
                  {currency} {formatMoney(totals.total)}
                </span>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="rounded-2xl border border-border bg-card/60 shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">
              Additional Information
            </h2>
            <div className="space-y-6">
              <div>
                <label className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase mb-2 block">
                  Notes (optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  placeholder="Add any additional notes or comments..."
                  className="w-full rounded-xl border border-border bg-background/80 px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 resize-none"
                />
              </div>

              <div>
                <label className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase mb-2 block">
                  Terms & Conditions (optional)
                </label>
                <textarea
                  value={terms}
                  onChange={(e) => setTerms(e.target.value)}
                  rows={4}
                  placeholder="Enter payment terms and conditions..."
                  className="w-full rounded-xl border border-border bg-background/80 px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 justify-end">
            <Link
              href={`/tools/quotations/${originalQuotation.id}`}
              className="rounded-xl border border-border bg-card/60 px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-card"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-purple-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-purple-400"
            >
              <Save className="size-4" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
