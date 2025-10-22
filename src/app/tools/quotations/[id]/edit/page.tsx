'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react'
import {
  saveQuotation,
  getQuotationById,
  getClients,
} from '@/lib/invoice-storage'
import { Client, InvoiceItem, Quotation } from '@/types/invoice'

export default function EditQuotationPage() {
  const params = useParams()
  const router = useRouter()

  const [clients, setClients] = useState<Client[]>([])
  const [selectedClientId, setSelectedClientId] = useState<string>('')
  const [quotationNumber, setQuotationNumber] = useState<string>('')
  const [issueDate, setIssueDate] = useState<string>('')
  const [validUntil, setValidUntil] = useState<string>('')
  const [status, setStatus] = useState<Quotation['status']>('draft')
  const [items, setItems] = useState<InvoiceItem[]>([])
  const [currency, setCurrency] = useState<string>('USD')
  const [taxRate, setTaxRate] = useState<number>(0)
  const [discount, setDiscount] = useState<number>(0)
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>(
    'percentage',
  )
  const [notes, setNotes] = useState<string>('')
  const [terms, setTerms] = useState<string>('')
  const [originalQuotation, setOriginalQuotation] = useState<Quotation | null>(
    null,
  )

  useEffect(() => {
    const id = params.id as string
    const loadedQuotation = getQuotationById(id)
    const loadedClients = getClients()

    if (!loadedQuotation) {
      router.push('/tools/quotations')
      return
    }

    setOriginalQuotation(loadedQuotation)
    setClients(loadedClients)
    setSelectedClientId(loadedQuotation.client.id)
    setQuotationNumber(loadedQuotation.invoiceNumber)
    setIssueDate(loadedQuotation.issueDate.split('T')[0])
    setValidUntil(loadedQuotation.validUntil.split('T')[0])
    setStatus(loadedQuotation.status)
    setItems(loadedQuotation.items)
    setCurrency(loadedQuotation.currency)
    setTaxRate(loadedQuotation.taxRate)
    setDiscount(loadedQuotation.discount)
    setDiscountType(loadedQuotation.discountType)
    setNotes(loadedQuotation.notes || '')
    setTerms(loadedQuotation.terms || '')
  }, [params.id, router])

  const addItem = () => {
    setItems([
      ...items,
      {
        id: crypto.randomUUID(),
        description: '',
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

  const updateItem = (
    id: string,
    field: keyof InvoiceItem,
    value: string | number,
  ) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value }
          if (field === 'quantity' || field === 'rate') {
            updated.amount = updated.quantity * updated.rate
          }
          return updated
        }
        return item
      }),
    )
  }

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0)
    const discountAmount =
      discountType === 'percentage' ? subtotal * (discount / 100) : discount
    const taxableAmount = subtotal - discountAmount
    const taxAmount = taxableAmount * (taxRate / 100)
    const total = taxableAmount + taxAmount

    return {
      subtotal,
      discountAmount,
      taxAmount,
      total,
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedClientId) {
      alert('Please select a client')
      return
    }

    if (!originalQuotation) {
      return
    }

    const client = clients.find((c) => c.id === selectedClientId)
    if (!client) {
      alert('Invalid client selected')
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
      items: items.filter((item) => item.description.trim() !== ''),
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

    saveQuotation(updatedQuotation)
    router.push(`/tools/quotations/${originalQuotation.id}`)
  }

  const totals = calculateTotals()

  if (!originalQuotation) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container py-6">
          <div className="flex items-center gap-4">
            <Link
              href="/tools/quotations"
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <ArrowLeft className="size-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold">New Quotation</h1>
              <p className="text-muted-foreground">
                Create a new quotation for your client
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-8">
          {/* Basic Info */}
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-xl font-semibold mb-6">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Quotation Number <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={quotationNumber}
                  onChange={(e) => setQuotationNumber(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value as Quotation['status'])
                  }
                  className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="draft">Draft</option>
                  <option value="sent">Sent</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                  <option value="expired">Expired</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Issue Date <span className="text-destructive">*</span>
                </label>
                <input
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Valid Until <span className="text-destructive">*</span>
                </label>
                <input
                  type="date"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
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
          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Client</h2>
              <Link
                href="/tools/invoices/clients/new"
                className="text-sm text-primary hover:underline"
              >
                + Add New Client
              </Link>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Select Client <span className="text-destructive">*</span>
              </label>
              <select
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
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
          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Line Items</h2>
              <button
                type="button"
                onClick={addItem}
                className="inline-flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm font-medium hover:bg-accent transition-colors"
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
                        updateItem(item.id, 'description', e.target.value)
                      }
                      className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div className="col-span-4 md:col-span-2">
                    <input
                      type="number"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(item.id, 'quantity', Number(e.target.value))
                      }
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div className="col-span-4 md:col-span-2">
                    <input
                      type="number"
                      placeholder="Rate"
                      value={item.rate}
                      onChange={(e) =>
                        updateItem(item.id, 'rate', Number(e.target.value))
                      }
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div className="col-span-3 md:col-span-2">
                    <input
                      type="text"
                      value={`${currency} ${item.amount.toFixed(2)}`}
                      disabled
                      className="w-full px-4 py-2 rounded-lg border bg-muted text-muted-foreground"
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
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-xl font-semibold mb-6">Calculations</h2>
            <div className="max-w-md ml-auto space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="font-medium">
                  {currency} {totals.subtotal.toFixed(2)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Discount
                  </label>
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Type</label>
                  <select
                    value={discountType}
                    onChange={(e) =>
                      setDiscountType(e.target.value as 'percentage' | 'fixed')
                    }
                    className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
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
                    -{currency} {totals.discountAmount.toFixed(2)}
                  </span>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">
                  Tax Rate (%)
                </label>
                <input
                  type="number"
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value))}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {taxRate > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax Amount:</span>
                  <span className="font-medium">
                    {currency} {totals.taxAmount.toFixed(2)}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-lg font-bold pt-4 border-t">
                <span>Total:</span>
                <span>
                  {currency} {totals.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-xl font-semibold mb-6">
              Additional Information
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Notes (optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  placeholder="Add any additional notes or comments..."
                  className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Terms & Conditions (optional)
                </label>
                <textarea
                  value={terms}
                  onChange={(e) => setTerms(e.target.value)}
                  rows={4}
                  placeholder="Enter payment terms and conditions..."
                  className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 justify-end">
            <Link
              href={`/tools/quotations/${originalQuotation.id}`}
              className="rounded-lg border bg-background px-6 py-3 text-sm font-medium hover:bg-accent transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Save className="size-4" />
              Update Quotation
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
