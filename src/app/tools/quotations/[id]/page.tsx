"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
    ArrowLeft,
    Download,
    Printer,
    Edit,
    Trash2,
    FileText,
    Link as LinkIcon,
    Copy,
    Check,
} from "lucide-react"
import {
    getQuotationById,
    deleteQuotation,
    getSettings,
    saveQuotation,
} from "@/lib/storage/tools-storage"
import { Quotation, InvoiceSettings } from "@/types/invoice"
import {
    convertQuotationToInvoice,
    canConvertQuotationToInvoice,
} from "@/lib/document-conversions"
import jsPDF from "jspdf"
import html2canvas from "html2canvas-pro"
import { QuotationPreview } from "@/components/tools/QuotationPreview"

export default function QuotationViewPage() {
    const params = useParams()
    const router = useRouter()
    const [quotation, setQuotation] = useState<Quotation | null>(null)
    const [settings, setSettings] = useState<InvoiceSettings | null>(null)
    const [isGenerating, setIsGenerating] = useState(false)
    const [showConvertModal, setShowConvertModal] = useState(false)
    const [copied, setCopied] = useState(false)
    const quotationRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const loadData = async () => {
            const id = params.id as string
            const [loadedQuotation, loadedSettings] = await Promise.all([
                getQuotationById(id),
                Promise.resolve(getSettings()),
            ])

            if (loadedQuotation) {
                setQuotation(loadedQuotation)
                setSettings(loadedSettings)
            } else {
                router.push("/tools/quotations")
            }
        }

        loadData()
    }, [params.id, router])

    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this quotation?")) {
            await deleteQuotation(quotation!.id)
            router.push("/tools/quotations")
        }
    }

    const copyPublicLink = () => {
        if (!quotation?.token) return
        const url = `${window.location.origin}/p/quotations/${quotation.token}`
        navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleConvertToInvoice = () => {
        if (!quotation) return

        if (!canConvertQuotationToInvoice(quotation)) {
            alert(
                'Only accepted quotations can be converted to invoices. Please change the status to "Accepted" first.',
            )
            return
        }

        setShowConvertModal(true)
    }

    const confirmConvertToInvoice = async () => {
        if (!quotation) return

        const invoice = convertQuotationToInvoice(quotation)

        // Update quotation status to reflect it's been converted
        const updatedQuotation = {
            ...quotation,
            notes: quotation.notes
                ? `${quotation.notes}\n\nConverted to Invoice: ${invoice.invoiceNumber}`
                : `Converted to Invoice: ${invoice.invoiceNumber}`,
            updatedAt: new Date().toISOString(),
        }
        await saveQuotation(updatedQuotation)

        setShowConvertModal(false)

        // Show success message and navigate
        alert(`Successfully created Invoice ${invoice.invoiceNumber}`)
        router.push(`/tools/invoices/${invoice.id}`)
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

            const imgData = canvas.toDataURL("image/png")
            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "a4",
            })

            const imgWidth = 210
            const imgHeight = (canvas.height * imgWidth) / canvas.width

            pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight)
            pdf.save(`${quotation?.invoiceNumber}.pdf`)
        } catch (error) {
            console.error("Error generating PDF:", error)
            alert("Failed to generate PDF. Please try again.")
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


                    {quotation.token && (
                        <div className="mb-6 flex items-center gap-3 bg-muted/50 p-2 rounded-lg border border-border max-w-xl">
                            <div className="bg-primary/10 p-2 rounded-md">
                                <LinkIcon className="size-4 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                                    Public Link
                                </p>
                                <p className="text-sm truncate select-all">
                                    {`${typeof window !== "undefined" ? window.location.origin : ""}/p/quotations/${quotation.token}`}
                                </p>
                            </div>
                            <button
                                onClick={copyPublicLink}
                                className="p-2 hover:bg-background rounded-md border border-transparent hover:border-border transition-colors text-muted-foreground hover:text-foreground"
                                title="Copy Link"
                            >
                                {copied ? (
                                    <Check className="size-4 text-green-500" />
                                ) : (
                                    <Copy className="size-4" />
                                )}
                            </button>
                        </div>
                    )}

                    <div className="flex gap-3">
                        {canConvertQuotationToInvoice(quotation) && (
                            <button
                                onClick={handleConvertToInvoice}
                                className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors"
                            >
                                <FileText className="size-4" />
                                Convert to Invoice
                            </button>
                        )}
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

            {/* Convert Confirmation Modal */}
            {
                showConvertModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-card rounded-lg max-w-md w-full p-6">
                            <h2 className="text-2xl font-bold mb-4">Convert to Invoice?</h2>
                            <p className="text-muted-foreground mb-6">
                                This will create a new invoice based on this quotation. The
                                quotation will remain unchanged.
                            </p>
                            <div className="rounded-lg bg-muted p-4 mb-6">
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Quotation:</span>
                                        <span className="font-medium">
                                            {quotation?.invoiceNumber}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Client:</span>
                                        <span className="font-medium">{quotation?.client.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Amount:</span>
                                        <span className="font-medium">
                                            {quotation?.currency} {quotation?.total.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={() => setShowConvertModal(false)}
                                    className="px-4 py-2 rounded-lg border bg-background hover:bg-accent transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmConvertToInvoice}
                                    className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
                                >
                                    Create Invoice
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Quotation Preview */}
            <div className="container py-8">
                <div className="max-w-4xl mx-auto">
                    <div ref={quotationRef}>
                        <QuotationPreview quotation={quotation} settings={settings} />
                    </div>
                </div>
            </div>
        </div >
    )
}
