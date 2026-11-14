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
    Split,
} from "lucide-react"
import {
    getQuotationById,
    deleteQuotation,
    getSettings,
    saveQuotation,
} from "@/lib/storage/tools-storage"
import { Invoice, Quotation, InvoiceSettings, SplitPart } from "@/types/invoice"
import {
    convertQuotationToInvoice,
    canConvertQuotationToInvoice,
    createInstallmentInvoices,
    getLinkedInvoices,
} from "@/lib/document-conversions"
import { invoicingState, missingInstallments } from "@/lib/tools/split"
import { formatMoney } from "@/lib/tools/totals"
import { SplitInvoiceDialog } from "@/components/tools/SplitInvoiceDialog"
import { exportElementToPdf } from "@/lib/pdf-export"
import { QuotationPreview } from "@/components/tools/QuotationPreview"

export default function QuotationViewPage() {
    const params = useParams()
    const router = useRouter()
    const [quotation, setQuotation] = useState<Quotation | null>(null)
    const [settings, setSettings] = useState<InvoiceSettings | null>(null)
    const [isGenerating, setIsGenerating] = useState(false)
    const [showConvertModal, setShowConvertModal] = useState(false)
    const [showSplitDialog, setShowSplitDialog] = useState(false)
    const [linked, setLinked] = useState<Invoice[]>([])
    const [notice, setNotice] = useState<string | null>(null)
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
                setLinked(await getLinkedInvoices(loadedQuotation))
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

    /** Sent (not yet accepted) quotations need an explicit OK before invoicing. */
    const confirmNotAccepted = () =>
        quotation?.status === "accepted" ||
        confirm(
            `${quotation?.invoiceNumber} is marked "${quotation?.status}", not accepted. Create invoices anyway?`,
        )

    const handleConvertToInvoice = () => {
        if (!quotation) return

        if (!canConvertQuotationToInvoice(quotation)) {
            alert(
                'Only sent or accepted quotations can be converted to invoices. Change the status first.',
            )
            return
        }
        if (!confirmNotAccepted()) return

        setShowConvertModal(true)
    }

    const handleSplit = () => {
        if (!quotation || !confirmNotAccepted()) return
        setShowSplitDialog(true)
    }

    const confirmConvertToInvoice = async () => {
        if (!quotation) return

        const { invoice, created } = await convertQuotationToInvoice(quotation)
        setShowConvertModal(false)
        if (!created) {
            setNotice(`This quotation was already invoiced as ${invoice.invoiceNumber}.`)
        }
        router.push(`/tools/invoices/${invoice.id}`)
    }

    const confirmSplit = async (parts: SplitPart[]) => {
        if (!quotation) return
        await createInstallmentInvoices(quotation, parts)
        const latest = await getQuotationById(quotation.id)
        if (latest) {
            setQuotation(latest)
            setLinked(await getLinkedInvoices(latest))
        }
        setShowSplitDialog(false)
        setNotice(`Created ${parts.length} draft invoices. Open each one to review and send it.`)
    }

    const handleCreateMissing = async () => {
        if (!quotation) return
        const created = await createInstallmentInvoices(quotation, [])
        const latest = await getQuotationById(quotation.id)
        if (latest) {
            setQuotation(latest)
            setLinked(await getLinkedInvoices(latest))
        }
        setNotice(`Re-created ${created.length} missing installment invoice${created.length === 1 ? "" : "s"}.`)
    }

    const handlePrint = () => {
        window.print()
    }

    const handleDownloadPDF = async () => {
        if (!quotationRef.current) return

        setIsGenerating(true)

        try {
            await exportElementToPdf(
                quotationRef.current,
                `${quotation?.invoiceNumber}.pdf`,
            )
        } catch (error) {
            console.error("Error generating PDF:", error)
            alert("Failed to generate PDF. Please try again.")
        } finally {
            setIsGenerating(false)
        }
    }

    if (!quotation || !settings) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
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

    const state = invoicingState(quotation, linked)
    const missing = missingInstallments(quotation, linked)
    const activeLinked = linked.filter((i) => i.status !== "cancelled")
    const canInvoice = canConvertQuotationToInvoice(quotation) && activeLinked.length === 0

    return (
        <>
            {/* Header - Hidden when printing */}
            <div className="relative border-b border-border/70 pt-32 pb-20 print:hidden">
                <div className="pointer-events-none absolute -top-10 right-0 size-[500px] rounded-full bg-purple-500/8 blur-[120px]" aria-hidden="true" />
                <div className="mx-auto max-w-7xl px-6">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <Link href="/tools/quotations" className="mb-8 flex items-center gap-2 font-mono text-[11px] tracking-widest text-purple-400 uppercase transition-colors hover:text-purple-300">
                                <ArrowLeft className="size-3" />
                                Back to Tools
                            </Link>
                            <h1 className="mb-4 text-5xl font-bold tracking-tight">
                                {quotation.invoiceNumber}
                            </h1>
                            <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">Quotation Details</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <span
                                className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(
                                    quotation.status,
                                )}`}
                            >
                                {quotation.status.charAt(0).toUpperCase() +
                                    quotation.status.slice(1)}
                            </span>
                            {state !== "none" && (
                                <span
                                    className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                                        state === "full"
                                            ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                                            : "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
                                    }`}
                                >
                                    {state === "full" ? "Invoiced" : "Partially invoiced"}
                                </span>
                            )}
                        </div>
                    </div>

                    {quotation.token && (
                        <div className="mb-6 flex items-center gap-3 bg-muted/50 p-2 rounded-xl border border-border max-w-xl">
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

                    {notice && (
                        <div role="status" className="mb-6 flex max-w-xl items-start justify-between gap-4 rounded-xl border border-purple-500/30 bg-purple-500/10 px-4 py-3 text-sm">
                            <span>{notice}</span>
                            <button type="button" onClick={() => setNotice(null)} aria-label="Dismiss" className="text-muted-foreground hover:text-foreground">×</button>
                        </div>
                    )}

                    {linked.length > 0 && (
                        <div className="mb-6 max-w-xl rounded-xl border border-border bg-card/60">
                            <p className="border-b border-border px-4 py-2 font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
                                Invoices from this quotation
                            </p>
                            <ul className="divide-y divide-border/60">
                                {linked.map((inv) => (
                                    <li key={inv.id}>
                                        <Link href={`/tools/invoices/${inv.id}`} className="flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3 text-sm hover:bg-muted/40">
                                            <span className="font-semibold">{inv.invoiceNumber}</span>
                                            {inv.installment && (
                                                <span className="text-muted-foreground">
                                                    {inv.installment.index}/{inv.installment.count} · {inv.installment.label}
                                                </span>
                                            )}
                                            <span className="rounded-full bg-muted px-2 py-0.5 text-xs capitalize">{inv.status.replace(/_/g, " ")}</span>
                                            <span className="ml-auto tabular-nums">
                                                {inv.currency} {formatMoney(inv.total, inv.currency)}
                                            </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                            {missing.length > 0 && (
                                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3 text-sm">
                                    <span className="text-amber-600 dark:text-amber-400">
                                        Missing: {missing.map((p) => `${p.index}. ${p.label}`).join(", ")}
                                    </span>
                                    <button type="button" onClick={handleCreateMissing} className="font-semibold text-purple-500 hover:underline">
                                        Create missing ({missing.length})
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex flex-wrap gap-3">
                        {canInvoice && (
                            <>
                                <button
                                    onClick={handleConvertToInvoice}
                                    className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700 transition-colors"
                                >
                                    <FileText className="size-4" />
                                    Convert to Invoice
                                </button>
                                <button
                                    onClick={handleSplit}
                                    className="inline-flex items-center gap-2 rounded-xl border border-green-600 px-5 py-2.5 text-sm font-semibold text-green-700 dark:text-green-400 hover:bg-green-600/10 transition-colors"
                                >
                                    <Split className="size-4" />
                                    Split into Invoices
                                </button>
                            </>
                        )}
                        {activeLinked.length === 1 && !quotation.splitPlan && (
                            <Link
                                href={`/tools/invoices/${activeLinked[0].id}`}
                                className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700 transition-colors"
                            >
                                <FileText className="size-4" />
                                View Invoice
                            </Link>
                        )}
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
                            href={`/tools/quotations/${quotation.id}/edit`}
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

            {showSplitDialog && (
                <SplitInvoiceDialog
                    quotation={quotation}
                    onCancel={() => setShowSplitDialog(false)}
                    onConfirm={confirmSplit}
                />
            )}

            {/* Convert Confirmation Modal */}
            {
                showConvertModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div role="dialog" aria-modal="true" className="rounded-2xl border border-border bg-background shadow-xl max-w-md w-full p-6">
                            <h2 className="text-2xl font-bold mb-4">Convert to Invoice?</h2>
                            <p className="text-muted-foreground mb-6">
                                This will create a new invoice based on this quotation. The
                                quotation will remain unchanged.
                            </p>
                            <div className="rounded-2xl border border-border bg-card/60 shadow-sm p-4 mb-6">
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
                                            {quotation.currency} {formatMoney(quotation.total, quotation.currency)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={() => setShowConvertModal(false)}
                                    className="rounded-xl border border-border bg-card/60 px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-card"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmConvertToInvoice}
                                    className="rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700 transition-colors"
                                >
                                    Create Invoice
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Quotation Preview */}
            <div className="mx-auto max-w-7xl px-6 py-16">
                <div className="max-w-4xl mx-auto">
                    <div ref={quotationRef}>
                        <QuotationPreview quotation={quotation} settings={settings} />
                    </div>
                </div>
            </div>
        </>
    )
}
