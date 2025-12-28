"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Download, Printer, Edit, Trash2, Link as LinkIcon, Copy, Check } from "lucide-react"
import {
    getReceiptById,
    deleteReceipt,
    getSettings,
} from "@/lib/storage/tools-storage"
import { Receipt, InvoiceSettings } from "@/types/invoice"
import jsPDF from "jspdf"
import html2canvas from "html2canvas-pro"
import { ReceiptPreview } from "@/components/tools/ReceiptPreview"

export default function ReceiptViewPage() {
    const params = useParams()
    const router = useRouter()
    const [receipt, setReceipt] = useState<Receipt | null>(null)
    const [settings, setSettings] = useState<InvoiceSettings | null>(null)
    const [isGenerating, setIsGenerating] = useState(false)
    const [copied, setCopied] = useState(false)
    const receiptRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const loadData = async () => {
            const id = params.id as string
            const [loadedReceipt, loadedSettings] = await Promise.all([
                getReceiptById(id),
                Promise.resolve(getSettings()),
            ])

            if (loadedReceipt) {
                setReceipt(loadedReceipt)
                setSettings(loadedSettings)
            } else {
                router.push("/tools/receipts")
            }
        }

        loadData()
    }, [params.id, router])

    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this receipt?")) {
            await deleteReceipt(receipt!.id)
            router.push("/tools/receipts")
        }
    }

    const copyPublicLink = () => {
        if (!receipt?.token) return
        const url = `${window.location.origin}/p/receipts/${receipt.token}`
        navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
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

                    {receipt.token && (
                        <div className="mb-6 flex items-center gap-3 bg-muted/50 p-2 rounded-lg border border-border max-w-xl">
                            <div className="bg-primary/10 p-2 rounded-md">
                                <LinkIcon className="size-4 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                                    Public Link
                                </p>
                                <p className="text-sm truncate select-all">
                                    {`${typeof window !== "undefined" ? window.location.origin : ""}/p/receipts/${receipt.token}`}
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
                    <div ref={receiptRef}>
                        <ReceiptPreview receipt={receipt} settings={settings} />
                    </div>
                </div>
            </div>
        </div>
    )
}
