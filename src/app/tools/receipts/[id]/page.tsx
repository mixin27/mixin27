"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Download, Printer, Edit, Trash2 } from "lucide-react"
import {
  getReceiptById,
  deleteReceipt,
  getSettings,
} from "@/lib/storage/tools-storage"
import { Receipt, InvoiceSettings } from "@/types/invoice"
import { formatDate } from "@/lib/utils"
import jsPDF from "jspdf"
import html2canvas from "html2canvas-pro"

export default function ReceiptViewPage() {
  const params = useParams()
  const router = useRouter()
  const [receipt, setReceipt] = useState<Receipt | null>(null)
  const [settings, setSettings] = useState<InvoiceSettings | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const receiptRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const id = params.id as string
    const loadedReceipt = getReceiptById(id)
    const loadedSettings = getSettings()

    if (loadedReceipt) {
      setReceipt(loadedReceipt)
      setSettings(loadedSettings)
    } else {
      router.push("/tools/receipts")
    }
  }, [params.id, router])

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this receipt?")) {
      deleteReceipt(receipt!.id)
      router.push("/tools/receipts")
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownloadPDF = async () => {
    if (!receiptRef.current) return

    setIsGenerating(true)

    try {
      // Add a small delay to ensure all content is rendered
      await new Promise((resolve) => setTimeout(resolve, 100))

      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        windowWidth: receiptRef.current.scrollWidth,
        windowHeight: receiptRef.current.scrollHeight,
      })

      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = canvas.width
      const imgHeight = canvas.height
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
      const imgX = (pdfWidth - imgWidth * ratio) / 2
      const imgY = 0

      pdf.addImage(
        imgData,
        "PNG",
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio,
      )
      pdf.save(`${receipt?.receiptNumber}.pdf`)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Failed to generate PDF. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  if (!receipt || !settings) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

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
      {/* Header - Hidden when printing */}
      <div className="border-b bg-card print:hidden">
        <div className="container py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Link
                href="/tools/receipts"
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <ArrowLeft className="size-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold">{receipt.receiptNumber}</h1>
                <p className="text-muted-foreground">Receipt Details</p>
              </div>
            </div>
            <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900 px-3 py-1 text-sm font-medium text-green-800 dark:text-green-200">
              Paid
            </span>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleDownloadPDF}
              disabled={isGenerating}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <Download className="size-4" />
              {isGenerating ? "Generating..." : "Download PDF"}
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 rounded-lg border bg-background px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
            >
              <Printer className="size-4" />
              Print
            </button>
            <Link
              href={`/tools/receipts/${receipt.id}/edit`}
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

      {/* Receipt Preview */}
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          <div
            ref={receiptRef}
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
                <h2 className="text-3xl font-bold mb-2">RECEIPT</h2>
                <p className="text-sm text-gray-600">
                  #{receipt.receiptNumber}
                </p>
              </div>
            </div>

            {/* Payment Info & Dates */}
            <div className="grid grid-cols-2 gap-8 mb-12">
              <div>
                <h3 className="text-sm font-semibold mb-2 text-gray-600">
                  RECEIVED FROM:
                </h3>
                <div className="text-sm">
                  <p className="font-semibold">{receipt.client.name}</p>
                  <p>{receipt.client.email}</p>
                  {receipt.client.phone && <p>{receipt.client.phone}</p>}
                  {receipt.client.address && <p>{receipt.client.address}</p>}
                  {receipt.client.city && (
                    <p>
                      {receipt.client.city}
                      {receipt.client.state && `, ${receipt.client.state}`}
                      {receipt.client.zipCode && ` ${receipt.client.zipCode}`}
                    </p>
                  )}
                  {receipt.client.taxId && (
                    <p>Tax ID: {receipt.client.taxId}</p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="mb-4">
                  <p className="text-sm text-gray-600">Payment Date</p>
                  <p className="font-semibold">
                    {formatDate(receipt.paymentDate)}
                  </p>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-600">Payment Method</p>
                  <p className="font-semibold">
                    {getPaymentMethodLabel(receipt.paymentMethod)}
                  </p>
                </div>
                {receipt.relatedInvoiceNumber && (
                  <div>
                    <p className="text-sm text-gray-600">Related Invoice</p>
                    <p className="font-semibold">
                      {receipt.relatedInvoiceNumber}
                    </p>
                  </div>
                )}
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
                {receipt.items.map((item) => (
                  <tr key={item.id} className="border-b border-gray-200">
                    <td className="py-3 text-sm">{item.description}</td>
                    <td className="text-right py-3 text-sm">{item.quantity}</td>
                    <td className="text-right py-3 text-sm">
                      {receipt.currency} {item.rate.toFixed(2)}
                    </td>
                    <td className="text-right py-3 text-sm">
                      {receipt.currency} {item.amount.toFixed(2)}
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
                    {receipt.currency} {receipt.subtotal.toFixed(2)}
                  </span>
                </div>
                {receipt.discount > 0 && (
                  <div className="flex justify-between py-2 text-sm">
                    <span className="text-gray-600">
                      Discount{" "}
                      {receipt.discountType === "percentage"
                        ? `(${receipt.discount}%)`
                        : ""}
                      :
                    </span>
                    <span>
                      -{receipt.currency}{" "}
                      {receipt.discountType === "percentage"
                        ? (receipt.subtotal * (receipt.discount / 100)).toFixed(
                            2,
                          )
                        : receipt.discount.toFixed(2)}
                    </span>
                  </div>
                )}
                {receipt.taxRate > 0 && (
                  <div className="flex justify-between py-2 text-sm">
                    <span className="text-gray-600">
                      Tax ({receipt.taxRate}%):
                    </span>
                    <span>
                      {receipt.currency} {receipt.taxAmount.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between py-3 text-lg font-bold border-t-2 border-gray-300">
                  <span>Amount Paid:</span>
                  <span>
                    {receipt.currency} {receipt.amountPaid.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {receipt.notes && (
              <div className="text-sm">
                <h4 className="font-semibold mb-2">NOTES</h4>
                <p className="text-gray-600 whitespace-pre-wrap">
                  {receipt.notes}
                </p>
              </div>
            )}

            {/* Footer */}
            <div className="mt-12 pt-8 border-t-2 border-black text-center">
              <div className="inline-block px-8 py-4 border-4 border-green-700 rounded-lg">
                <p className="text-xl font-bold" style={{ color: "#065f46" }}>
                  ✓ PAYMENT RECEIVED
                </p>
                <p className="text-base mt-2" style={{ color: "#047857" }}>
                  Thank you for your payment
                </p>
              </div>
              <p className="text-sm mt-6" style={{ color: "#4b5563" }}>
                This receipt confirms payment was received on{" "}
                {formatDate(receipt.paymentDate)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
