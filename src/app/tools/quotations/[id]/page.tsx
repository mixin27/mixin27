'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Download, Printer, Edit, Trash2 } from 'lucide-react'
import {
  getQuotationById,
  deleteQuotation,
  getSettings,
} from '@/lib/invoice-storage'
import { Quotation, InvoiceSettings } from '@/types/invoice'
import { formatDate } from '@/lib/utils'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas-pro'

export default function QuotationViewPage() {
  const params = useParams()
  const router = useRouter()
  const [quotation, setQuotation] = useState<Quotation | null>(null)
  const [settings, setSettings] = useState<InvoiceSettings | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const quotationRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const id = params.id as string
    const loadedQuotation = getQuotationById(id)
    const loadedSettings = getSettings()

    if (loadedQuotation) {
      setQuotation(loadedQuotation)
      setSettings(loadedSettings)
    } else {
      router.push('/tools/quotations')
    }
  }, [params.id, router])

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this quotation?')) {
      deleteQuotation(quotation!.id)
      router.push('/tools/quotations')
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownloadPDF = async () => {
    if (!quotationRef.current) return

    setIsGenerating(true)

    try {
      const canvas = await html2canvas(quotationRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      })

      const imgWidth = 210
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
      pdf.save(`${quotation?.invoiceNumber}.pdf`)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Failed to generate PDF. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  if (!quotation || !settings) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

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
      {/* Header - Hidden when printing */}
      <div className="border-b bg-card print:hidden">
        <div className="container py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Link
                href="/tools/quotations"
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <ArrowLeft className="size-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold">
                  {quotation.invoiceNumber}
                </h1>
                <p className="text-muted-foreground">Quotation Details</p>
              </div>
            </div>
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(
                quotation.status,
              )}`}
            >
              {quotation.status.charAt(0).toUpperCase() +
                quotation.status.slice(1)}
            </span>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleDownloadPDF}
              disabled={isGenerating}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <Download className="size-4" />
              {isGenerating ? 'Generating...' : 'Download PDF'}
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 rounded-lg border bg-background px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
            >
              <Printer className="size-4" />
              Print
            </button>
            <Link
              href={`/tools/quotations/${quotation.id}/edit`}
              className="inline-flex items-center gap-2 rounded-lg border bg-background px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
            >
              <Edit className="size-4" />
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="inline-flex items-center gap-2 rounded-lg border border-destructive text-destructive px-4 py-2 text-sm font-medium hover:bg-destructive/10 transition-colors"
            >
              <Trash2 className="size-4" />
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Quotation Preview */}
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          <div
            ref={quotationRef}
            className="bg-white text-black p-8 md:p-12 rounded-lg shadow-lg print:shadow-none print:rounded-none"
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-12">
              <div>
                <h1 className="text-4xl font-bold mb-2">
                  {settings.businessName}
                </h1>
                <div className="text-sm text-gray-600">
                  {settings.businessEmail && <p>{settings.businessEmail}</p>}
                  {settings.businessPhone && <p>{settings.businessPhone}</p>}
                  {settings.businessAddress && (
                    <p>{settings.businessAddress}</p>
                  )}
                  {settings.businessCity && (
                    <p>
                      {settings.businessCity}
                      {settings.businessState && `, ${settings.businessState}`}
                      {settings.businessZipCode &&
                        ` ${settings.businessZipCode}`}
                    </p>
                  )}
                  {settings.taxId && <p>Tax ID: {settings.taxId}</p>}
                </div>
              </div>
              <div className="text-right">
                <h2 className="text-3xl font-bold mb-2">QUOTATION</h2>
                <p className="text-sm text-gray-600">
                  #{quotation.invoiceNumber}
                </p>
              </div>
            </div>

            {/* Bill To & Dates */}
            <div className="grid grid-cols-2 gap-8 mb-12">
              <div>
                <h3 className="text-sm font-semibold mb-2 text-gray-600">
                  PREPARED FOR:
                </h3>
                <div className="text-sm">
                  <p className="font-semibold">{quotation.client.name}</p>
                  <p>{quotation.client.email}</p>
                  {quotation.client.phone && <p>{quotation.client.phone}</p>}
                  {quotation.client.address && (
                    <p>{quotation.client.address}</p>
                  )}
                  {quotation.client.city && (
                    <p>
                      {quotation.client.city}
                      {quotation.client.state && `, ${quotation.client.state}`}
                      {quotation.client.zipCode &&
                        ` ${quotation.client.zipCode}`}
                    </p>
                  )}
                  {quotation.client.taxId && (
                    <p>Tax ID: {quotation.client.taxId}</p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="mb-4">
                  <p className="text-sm text-gray-600">Issue Date</p>
                  <p className="font-semibold">
                    {formatDate(quotation.issueDate)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Valid Until</p>
                  <p className="font-semibold">
                    {formatDate(quotation.validUntil)}
                  </p>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <table className="w-full mb-8">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left py-3 text-sm font-semibold">
                    DESCRIPTION
                  </th>
                  <th className="text-right py-3 text-sm font-semibold">QTY</th>
                  <th className="text-right py-3 text-sm font-semibold">
                    RATE
                  </th>
                  <th className="text-right py-3 text-sm font-semibold">
                    AMOUNT
                  </th>
                </tr>
              </thead>
              <tbody>
                {quotation.items.map((item) => (
                  <tr key={item.id} className="border-b border-gray-200">
                    <td className="py-3 text-sm">{item.description}</td>
                    <td className="text-right py-3 text-sm">{item.quantity}</td>
                    <td className="text-right py-3 text-sm">
                      {quotation.currency} {item.rate.toFixed(2)}
                    </td>
                    <td className="text-right py-3 text-sm">
                      {quotation.currency} {item.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-end mb-12">
              <div className="w-64">
                <div className="flex justify-between py-2 text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span>
                    {quotation.currency} {quotation.subtotal.toFixed(2)}
                  </span>
                </div>
                {quotation.discount > 0 && (
                  <div className="flex justify-between py-2 text-sm">
                    <span className="text-gray-600">
                      Discount{' '}
                      {quotation.discountType === 'percentage'
                        ? `(${quotation.discount}%)`
                        : ''}
                      :
                    </span>
                    <span>
                      -{quotation.currency}{' '}
                      {quotation.discountType === 'percentage'
                        ? (
                            quotation.subtotal *
                            (quotation.discount / 100)
                          ).toFixed(2)
                        : quotation.discount.toFixed(2)}
                    </span>
                  </div>
                )}
                {quotation.taxRate > 0 && (
                  <div className="flex justify-between py-2 text-sm">
                    <span className="text-gray-600">
                      Tax ({quotation.taxRate}%):
                    </span>
                    <span>
                      {quotation.currency} {quotation.taxAmount.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between py-3 text-lg font-bold border-t-2 border-gray-300">
                  <span>Total:</span>
                  <span>
                    {quotation.currency} {quotation.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Notes & Terms */}
            <div className="grid grid-cols-2 gap-8 text-sm">
              {quotation.notes && (
                <div>
                  <h4 className="font-semibold mb-2">NOTES</h4>
                  <p className="text-gray-600 whitespace-pre-wrap">
                    {quotation.notes}
                  </p>
                </div>
              )}
              {quotation.terms && (
                <div>
                  <h4 className="font-semibold mb-2">TERMS & CONDITIONS</h4>
                  <p className="text-gray-600 whitespace-pre-wrap">
                    {quotation.terms}
                  </p>
                </div>
              )}
            </div>

            {/* Validity Notice */}
            <div className="mt-12 pt-8 border-t text-center text-sm text-gray-500">
              <p>
                This quotation is valid until {formatDate(quotation.validUntil)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
