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
import { exportElementToPdf } from "@/lib/pdf-export"
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
            await exportElementToPdf(
                receiptRef.current,
                `${receipt?.receiptNumber}.pdf`,
            )
        } catch (error) {
            console.error("Error generating PDF:", error)
            alert("Failed to generate PDF. Please try again.")
        } finally {
            setIsGenerating(false)
        }
    }

    if (!receipt || !settings) {
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
            {/* Header - Hidden when printing */}
            <div className="relative border-b border-border/70 pt-32 pb-20 print:hidden">
                <div className="pointer-events-none absolute -top-10 right-0 size-[500px] rounded-full bg-purple-500/8 blur-[120px]" aria-hidden="true" />
                <div className="mx-auto max-w-7xl px-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <Link href="/tools/receipts" className="mb-8 flex items-center gap-2 font-mono text-[11px] tracking-widest text-purple-400 uppercase transition-colors hover:text-purple-300">
                                <ArrowLeft className="size-3" />
                                Back to Tools
                            </Link>
                            <h1 className="mb-4 text-5xl font-bold tracking-tight">{receipt.receiptNumber}</h1>
                            <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">Receipt Details</p>
                        </div>
                        <div className="shrink-0 pt-14">
                            <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900 px-3 py-1 text-sm font-medium text-green-800 dark:text-green-200">
                                Paid
                            </span>
                        </div>
                    </div>

                    {receipt.token && (
                        <div className="mt-6 flex items-center gap-3 bg-muted/50 p-2 rounded-lg border border-border max-w-xl">
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

                    <div className="mt-6 flex gap-3">
                        <button
                            onClick={handleDownloadPDF}
                            disabled={isGenerating}
                            className="inline-flex items-center gap-2 rounded-xl bg-purple-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-purple-400 disabled:opacity-50"
                        >
                            <Download className="size-4" />
                            {isGenerating ? "Generating..." : "Download PDF"}
                        </button>
                        <button
                            onClick={handlePrint}
                            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/60 px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-card"
                        >
                            <Printer className="size-4" />
                            Print
                        </button>
                        <Link
                            href={`/tools/receipts/${receipt.id}/edit`}
                            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/60 px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-card"
                        >
                            <Edit className="size-4" />
                            Edit
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="inline-flex items-center gap-2 rounded-xl border border-destructive text-destructive px-5 py-2.5 text-sm font-semibold hover:bg-destructive/10 transition-colors"
                        >
                            <Trash2 className="size-4" />
                            Delete
                        </button>
                    </div>
                </div>
            </div>

            {/* Receipt Preview */}
            <div className="mx-auto max-w-7xl px-6 py-16">
                <div className="max-w-4xl mx-auto">
                    <div ref={receiptRef}>
                        <ReceiptPreview receipt={receipt} settings={settings} />
                    </div>
                </div>
            </div>
        </>
    )
}
