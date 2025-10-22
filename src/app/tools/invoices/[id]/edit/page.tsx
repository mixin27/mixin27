'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, Save, Loader2 } from 'lucide-react'
import { Invoice, InvoiceItem, Client } from '@/types/invoice'
import { saveInvoice, getClients, getInvoiceById } from '@/lib/invoice-storage'

export default function EditInvoicePage() {
  const router = useRouter()
  const params = useParams()
  const invoiceId = params.id as string

  const [loading, setLoading] = useState(true)
  const [clients, setClients] = useState<Client[]>([])
  const [selectedClientId, setSelectedClientId] = useState('')
  const [invoiceNumber, setInvoiceNumber] = useState('')
  const [issueDate, setIssueDate] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', description: '', quantity: 1, rate: 0, amount: 0 },
  ])
  const [notes, setNotes] = useState('')
  const [terms, setTerms] = useState('')
  const [taxRate, setTaxRate] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>(
    'percentage',
  )
  const [currency, setCurrency] = useState('USD')
  const [status, setStatus] = useState<Invoice['status']>('draft')

  useEffect(() => {
    const invoice = getInvoiceById(invoiceId)
    if (!invoice) {
      alert('Invoice not found')
      router.push('/tools/invoices')
      return
    }

    const loadedClients = getClients()
    setClients(loadedClients)

    // Load invoice data
    setInvoiceNumber(invoice.invoiceNumber)
    setSelectedClientId(invoice.client.id)
    setIssueDate(invoice.issueDate)
    setDueDate(invoice.dueDate)
    setItems(invoice.items)
    setNotes(invoice.notes || '')
    setTerms(invoice.terms || '')
    setTaxRate(invoice.taxRate)
    setDiscount(invoice.discount)
    setDiscountType(invoice.discountType)
    setCurrency(invoice.currency)
    setStatus(invoice.status)
    setLoading(false)
  }, [invoiceId, router])

  const addItem = () => {
    setItems([
      ...items,
      {
        id: Date.now().toString(),
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

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
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

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.amount, 0)
  }

  const calculateDiscount = () => {
    const subtotal = calculateSubtotal()
    if (discountType === 'percentage') {
      return subtotal * (discount / 100)
    }
    return discount
  }

  const calculateTax = () => {
    const subtotal = calculateSubtotal()
    const discountAmount = calculateDiscount()
    return (subtotal - discountAmount) * (taxRate / 100)
  }

  const calculateTotal = () => {
    const subtotal = calculateSubtotal()
    const discountAmount = calculateDiscount()
    const taxAmount = calculateTax()
    return subtotal - discountAmount + taxAmount
  }

  const handleSave = (statusUpdate: Invoice['status'] = 'draft') => {
    const selectedClient = clients.find((c) => c.id === selectedClientId)

    if (!selectedClient) {
      alert('Please select a client')
      return
    }

    if (items.some((item) => !item.description)) {
      alert('Please fill in all item descriptions')
      return
    }

    const existingInvoice = getInvoiceById(invoiceId)
    if (!existingInvoice) {
      alert('Invoice not found')
      router.push('/tools/invoices')
      return
    }

    const invoice: Invoice = {
      ...existingInvoice,
      invoiceNumber,
      client: selectedClient,
      issueDate,
      dueDate,
      status: statusUpdate,
      items,
      subtotal: calculateSubtotal(),
      taxRate,
      taxAmount: calculateTax(),
      discount,
      discountType,
      total: calculateTotal(),
      notes,
      terms,
      currency,
      updatedAt: new Date().toISOString(),
    }

    saveInvoice(invoice)
    // router.push('/tools/invoices')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="size-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading invoice...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/tools/invoices"
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <ArrowLeft className="size-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Edit Invoice</h1>
              <p className="text-muted-foreground">
                Update invoice #{invoiceNumber}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                handleSave(status)
              }}
              className="inline-flex items-center gap-2 rounded-lg border bg-background px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
            >
              <Save className="size-4" />
              Save Changes
            </button>
            {status === 'paid' && (
              <button
                onClick={() => {
                  setStatus('draft')
                  setTimeout(() => handleSave('draft'), 100)
                }}
                className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800 dark:bg-gray-900 dark:text-gray-200 hover:bg-blue-700 transition-colors"
              >
                Mark as Draft
              </button>
            )}
            {status === 'draft' && (
              <button
                onClick={() => {
                  setStatus('sent')
                  setTimeout(() => handleSave('sent'), 100)
                }}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
              >
                Mark as Sent
              </button>
            )}
            {status === 'sent' && (
              <button
                onClick={() => {
                  setStatus('paid')
                  setTimeout(() => handleSave('paid'), 100)
                }}
                className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors"
              >
                Mark as Paid
              </button>
            )}
            {(status === 'sent' || status === 'overdue') && (
              <button
                onClick={() => {
                  setStatus('cancelled')
                  setTimeout(() => handleSave('cancelled'), 100)
                }}
                className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 transition-colors"
              >
                Cancel Invoice
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-lg border bg-card p-6 md:p-8">
            {/* Invoice Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Invoice Number <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Status <span className="text-destructive">*</span>
                </label>
                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value as Invoice['status'])
                  }
                  className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="draft">Draft</option>
                  <option value="sent">Sent</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Client <span className="text-destructive">*</span>
                </label>
                <select
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="">Select a client</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
                <Link
                  href="/tools/invoices/clients/new"
                  className="text-sm text-primary hover:underline mt-1 inline-block"
                >
                  + Add new client
                </Link>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Currency
                </label>
                <input
                  type="text"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="USD"
                />
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
                  Due Date <span className="text-destructive">*</span>
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
            </div>

            {/* Items */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Items</h3>
                <button
                  onClick={addItem}
                  className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
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
                        placeholder="Description"
                        value={item.description}
                        onChange={(e) =>
                          updateItem(item.id, 'description', e.target.value)
                        }
                        className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="col-span-4 md:col-span-2">
                      <input
                        type="number"
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(
                            item.id,
                            'quantity',
                            parseFloat(e.target.value) || 0,
                          )
                        }
                        className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="col-span-4 md:col-span-2">
                      <input
                        type="number"
                        placeholder="Rate"
                        value={item.rate}
                        onChange={(e) =>
                          updateItem(
                            item.id,
                            'rate',
                            parseFloat(e.target.value) || 0,
                          )
                        }
                        className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="col-span-3 md:col-span-2">
                      <div className="px-4 py-2 bg-muted rounded-lg text-right font-medium">
                        {item.amount.toFixed(2)}
                      </div>
                    </div>
                    <div className="col-span-1">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors"
                        disabled={items.length === 1}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="border-t pt-6 mb-8">
              <div className="max-w-md ml-auto space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-medium">
                    {currency} {calculateSubtotal().toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span>Discount:</span>
                    <select
                      value={discountType}
                      onChange={(e) =>
                        setDiscountType(
                          e.target.value as 'percentage' | 'fixed',
                        )
                      }
                      className="px-2 py-1 text-sm rounded border bg-background"
                    >
                      <option value="percentage">%</option>
                      <option value="fixed">{currency}</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={discount}
                      onChange={(e) =>
                        setDiscount(parseFloat(e.target.value) || 0)
                      }
                      className="w-24 px-3 py-1 rounded border bg-background text-right"
                      min="0"
                      step="0.01"
                    />
                    <span className="font-medium">
                      -{currency} {calculateDiscount().toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span>Tax Rate (%):</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={taxRate}
                      onChange={(e) =>
                        setTaxRate(parseFloat(e.target.value) || 0)
                      }
                      className="w-24 px-3 py-1 rounded border bg-background text-right"
                      min="0"
                      step="0.01"
                    />
                    <span className="font-medium">
                      {currency} {calculateTax().toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between text-lg font-bold pt-4 border-t">
                  <span>Total:</span>
                  <span>
                    {currency} {calculateTotal().toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Notes & Terms */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="Thank you for your business!"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Payment Terms
                </label>
                <textarea
                  value={terms}
                  onChange={(e) => setTerms(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="Payment due within 30 days"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
