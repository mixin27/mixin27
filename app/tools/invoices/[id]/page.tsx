"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Download, Printer, Edit, Trash2, Link as LinkIcon, Copy, Check } from "lucide-react"
import {
    getInvoiceById,
    deleteInvoice,
    getSettings,
    saveInvoice,
} from "@/lib/storage/tools-storage"
import { Invoice, InvoiceSettings, Receipt } from "@/types/invoice"
import {
    convertInvoiceToReceipt,
    canConvertInvoiceToReceipt,
} from "@/lib/document-conversions"
import { exportElementToPdf } from "@/lib/pdf-export"
import { InvoicePreview } from "@/components/tools/InvoicePreview"

export default function InvoiceViewPage() {
    const params = useParams()
    const router = useRouter()
    const [invoice, setInvoice] = useState<Invoice | null>(null)
    const [settings, setSettings] = useState<InvoiceSettings | null>(null)
    const [isGenerating, setIsGenerating] = useState(false)
    const [showReceiptModal, setShowReceiptModal] = useState(false)
    const [paymentMethod, setPaymentMethod] =
        useState<Receipt["paymentMethod"]>("bank_transfer")
    const [paymentDate, setPaymentDate] = useState<string>(
        new Date().toISOString().split("T")[0],
    )
    const [amountPaid, setAmountPaid] = useState<number>(0)
    const [copied, setCopied] = useState(false)
    const invoiceRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const loadData = async () => {
            const id = params.id as string
            const [loadedInvoice, loadedSettings] = await Promise.all([
                getInvoiceById(id),
                Promise.resolve(getSettings()),
            ])

            if (loadedInvoice) {
                setInvoice(loadedInvoice)
                setSettings(loadedSettings)
                setAmountPaid(loadedInvoice.total)
            } else {
                router.push("/tools/invoices")
            }
        }

        loadData()
    }, [params.id, router])

    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this invoice?")) {
            await deleteInvoice(invoice!.id)
            router.push("/tools/invoices")
        }
    }

    const handleGenerateReceipt = () => {
        if (!invoice) return

        if (!canConvertInvoiceToReceipt(invoice)) {
            alert("Only sent or paid invoices can have receipts generated.")
            return
        }

        setShowReceiptModal(true)
    }

    const confirmGenerateReceipt = async () => {
        if (!invoice) return

        const receipt = await convertInvoiceToReceipt(
            invoice,
            paymentMethod,
            paymentDate,
            amountPaid,
        )

        if (amountPaid >= invoice.total && invoice.status !== "paid") {
            const updatedInvoice = {
                ...invoice,
                status: "paid" as Invoice["status"],
                updatedAt: new Date().toISOString(),
            }
            await saveInvoice(updatedInvoice)
            setInvoice(updatedInvoice)
        }

        setShowReceiptModal(false)

        alert(`Successfully generated Receipt ${receipt.receiptNumber}`)
        router.push(`/tools/receipts/${receipt.id}`)
    }

    const handlePrint = () => {
        window.print()
    }

    const handleDownloadPDF = async () => {
        if (!invoiceRef.current) return

        setIsGenerating(true)

        try {
            await exportElementToPdf(
                invoiceRef.current,
                `${invoice?.invoiceNumber}.pdf`,
            )
        } catch (error) {
            console.error("Error generating PDF:", error)
            alert("Failed to generate PDF. Please try again.")
        } finally {
            setIsGenerating(false)
        }
    }

    if (!invoice || !settings) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        )
    }

    const copyPublicLink = () => {
        if (!invoice?.token) return
        const url = `${window.location.origin}/p/invoices/${invoice.token}`
        navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const getStatusColor = (status: Invoice["status"]) => {
        switch (status) {
            case "paid":
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
            case "sent":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
            case "overdue":
                return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
            case "draft":
                return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
            case "cancelled":
                return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
        }
    }

    return (
        <>
            {/* Header - Hidden when printing */}
            <div className="relative border-b border-border/70 pt-32 pb-20 print:hidden">
                <div
                    className="pointer-events-none absolute -top-10 right-0 size-[500px] rounded-full bg-purple-500/8 blur-[120px]"
                    aria-hidden="true"
                />
                <div className="mx-auto max-w-7xl px-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <Link
                                href="/tools/invoices"
                                className="mb-8 flex items-center gap-2 font-mono text-[11px] tracking-widest text-purple-400 uppercase transition-colors hover:text-purple-300"
                            >
                                <ArrowLeft className="size-3" />
                                Back to Invoices
                            </Link>
                            <h1 className="mb-4 text-5xl font-bold tracking-tight">{invoice.invoiceNumber}</h1>
                            <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
                                Invoice Details
                            </p>
                        </div>
                        <div className="shrink-0 pt-14">
                            <span
                                className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(
                                    invoice.status,
                                )}`}
                            >
                                {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                            </span>
                        </div>
                    </div>

                    {invoice.token && (
                        <div className="mt-6 mb-6 flex items-center gap-3 bg-muted/50 p-2 rounded-xl border border-border max-w-xl">
                            <div className="bg-purple-500/10 p-2 rounded-md">
                                <LinkIcon className="size-4 text-purple-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                                    Public Link
                                </p>
                                <p className="text-sm truncate select-all">
                                    {`${typeof window !== "undefined" ? window.location.origin : ""}/p/invoices/${invoice.token}`}
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

                    <div className="flex gap-3 mt-6">
                        {canConvertInvoiceToReceipt(invoice) && (
                            <button
                                onClick={handleGenerateReceipt}
                                className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700"
                            >
                                <Download className="size-4" />
                                Generate Receipt
                            </button>
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
                            href={`/tools/invoices/${invoice.id}/edit`}
                            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/60 px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-card"
                        >
                            <Edit className="size-4" />
                            Edit
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="inline-flex items-center gap-2 rounded-xl border border-destructive text-destructive px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-destructive/10"
                        >
                            <Trash2 className="size-4" />
                            Delete
                        </button>
                    </div>
                </div>
            </div>

            {/* Receipt Generation Modal */}
            {showReceiptModal && invoice && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-card rounded-2xl max-w-md w-full p-6 shadow-sm">
                        <h2 className="text-2xl font-bold mb-4">Generate Receipt</h2>
                        <p className="text-muted-foreground mb-6">
                            Create a payment receipt for this invoice.
                        </p>

                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="block font-mono text-[11px] tracking-widest text-muted-foreground uppercase mb-2">
                                    Payment Date <span className="text-destructive">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={paymentDate}
                                    onChange={(e) => setPaymentDate(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-border bg-background/80 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20"
                                />
                            </div>

                            <div>
                                <label className="block font-mono text-[11px] tracking-widest text-muted-foreground uppercase mb-2">
                                    Payment Method <span className="text-destructive">*</span>
                                </label>
                                <select
                                    value={paymentMethod}
                                    onChange={(e) =>
                                        setPaymentMethod(e.target.value as Receipt["paymentMethod"])
                                    }
                                    className="w-full px-4 py-3 rounded-xl border border-border bg-background/80 text-sm text-foreground outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20"
                                >
                                    <option value="bank_transfer">Bank Transfer</option>
                                    <option value="credit_card">Credit Card</option>
                                    <option value="cash">Cash</option>
                                    <option value="check">Check</option>
                                    <option value="paypal">PayPal</option>
                                    <option value="kbz_pay">KBZ KPay</option>
                                    <option value="aya_pay">AYA Pay</option>
                                    <option value="cb_pay">CB Pay</option>
                                    <option value="wave_pay">Wave Pay</option>
                                    <option value="uab_pay">UAB Pay</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block font-mono text-[11px] tracking-widest text-muted-foreground uppercase mb-2">
                                    Amount Paid <span className="text-destructive">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                                        {invoice.currency}
                                    </span>
                                    <input
                                        type="number"
                                        value={amountPaid}
                                        onChange={(e) => setAmountPaid(Number(e.target.value))}
                                        min="0"
                                        max={invoice.total}
                                        step="0.01"
                                        className="w-full pl-16 pr-4 py-3 rounded-xl border border-border bg-background/80 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20"
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Invoice total: {invoice.currency} {invoice.total.toFixed(2)}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setShowReceiptModal(false)}
                                className="rounded-xl border border-border bg-card/60 px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-card"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmGenerateReceipt}
                                className="rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700"
                            >
                                Generate Receipt
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Invoice Preview */}
            <div className="mx-auto max-w-7xl px-6 py-16">
                <div className="max-w-4xl mx-auto">
                    <div ref={invoiceRef}>
                        <InvoicePreview invoice={invoice} settings={settings} />
                    </div>
                </div>
            </div>
        </>
    )
}
