"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Download, Printer, Edit, Trash2, Wallet, Repeat } from "lucide-react"
import {
    getInvoiceById,
    deleteInvoice,
    getQuotationById,
    getSettings,
} from "@/lib/storage/tools-storage"
import { Invoice, InvoiceSettings, Payment, Quotation, Receipt } from "@/types/invoice"
import { getInvoiceReceipts, recordPayment, removePayment } from "@/lib/document-conversions"
import {
    deriveInvoiceStatus,
    invoicePaidAmount,
    paymentMethodLabel,
    type PaymentInput,
} from "@/lib/tools/payments"
import { RecordPaymentDialog } from "@/components/tools/RecordPaymentDialog"
import { formatMoney, roundMoney } from "@/lib/tools/totals"
import { exportElementToPdf } from "@/lib/pdf-export"
import { ShareLinkBox } from "@/components/tools/ShareLinkBox"
import { DuplicateButton } from "@/components/tools/DuplicateButton"
import { InvoicePreview } from "@/components/tools/InvoicePreview"

export default function InvoiceViewPage() {
    const params = useParams()
    const router = useRouter()
    const [invoice, setInvoice] = useState<Invoice | null>(null)
    const [settings, setSettings] = useState<InvoiceSettings | null>(null)
    const [isGenerating, setIsGenerating] = useState(false)
    const [showPaymentDialog, setShowPaymentDialog] = useState(false)
    const [receipts, setReceipts] = useState<Receipt[]>([])
    const [sourceQuotation, setSourceQuotation] = useState<Quotation | null>(null)
    const invoiceRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const loadData = async () => {
            const id = params.id as string
            const [loadedInvoice, loadedSettings] = await Promise.all([
                getInvoiceById(id),
                Promise.resolve(getSettings()),
            ])

            if (loadedInvoice) {
                const [loadedReceipts, quotation] = await Promise.all([
                    getInvoiceReceipts(loadedInvoice),
                    loadedInvoice.sourceQuotationId
                        ? getQuotationById(loadedInvoice.sourceQuotationId)
                        : Promise.resolve(null),
                ])
                setInvoice(loadedInvoice)
                setSettings(loadedSettings)
                setReceipts(loadedReceipts)
                setSourceQuotation(quotation)
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

    const reload = async (id: string) => {
        const fresh = await getInvoiceById(id)
        if (!fresh) return
        setInvoice(fresh)
        setReceipts(await getInvoiceReceipts(fresh))
    }

    const handleRecordPayment = async (input: PaymentInput, createReceipt: boolean) => {
        if (!invoice) return
        await recordPayment(invoice.id, input, { createReceipt })
        await reload(invoice.id)
        setShowPaymentDialog(false)
    }

    const handleRemovePayment = async (payment: Payment) => {
        if (!invoice) return
        const label = `${invoice.currency} ${formatMoney(payment.amount, invoice.currency)} on ${payment.date}`
        if (!confirm(`Remove the payment of ${label}?`)) return
        const deleteReceipt =
            !!payment.receiptId &&
            confirm("Also delete the receipt created for this payment?\n\nOK deletes it. Cancel keeps it as a standalone receipt.")
        await removePayment(invoice.id, payment.id, { deleteReceipt })
        await reload(invoice.id)
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


    const getStatusColor = (status: Invoice["status"]) => {
        switch (status) {
            case "paid":
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
            case "sent":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
            case "overdue":
                return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
            case "partially_paid":
                return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
            case "draft":
                return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
            case "cancelled":
                return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
        }
    }

    const paidSoFar = invoicePaidAmount(invoice, receipts)
    const balance = roundMoney(invoice.total - paidSoFar, invoice.currency)
    const payments = [...(invoice.payments ?? [])].sort((a, b) => a.date.localeCompare(b.date))
    const legacyReceipts = receipts.filter((r) => !r.paymentId)
    const displayStatus = deriveInvoiceStatus(invoice, receipts)
    const money = (v: number) => `${invoice.currency} ${formatMoney(v, invoice.currency)}`

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
                                {invoice.installment
                                    ? `Installment ${invoice.installment.index} of ${invoice.installment.count} · ${invoice.installment.label}`
                                    : "Invoice Details"}
                            </p>
                            {invoice.recurringTemplateId && (
                                <p className="mt-2 text-sm text-muted-foreground">
                                    Generated from a{" "}
                                    <Link href={`/tools/invoices/recurring/${invoice.recurringTemplateId}`} className="font-semibold text-purple-400 hover:underline">
                                        recurring template
                                    </Link>
                                </p>
                            )}
                            {invoice.sourceQuotationId && (
                                <p className="mt-2 text-sm text-muted-foreground">
                                    From quotation{" "}
                                    {sourceQuotation ? (
                                        <Link href={`/tools/quotations/${sourceQuotation.id}`} className="font-semibold text-purple-400 hover:underline">
                                            {sourceQuotation.invoiceNumber}
                                        </Link>
                                    ) : (
                                        <span>(deleted)</span>
                                    )}
                                </p>
                            )}
                        </div>
                        <div className="shrink-0 pt-14">
                            <span
                                className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(
                                    displayStatus,
                                )}`}
                            >
                                {(displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1)).replace(/_/g, " ")}
                            </span>
                        </div>
                    </div>

                    <ShareLinkBox kind="invoice" doc={invoice} settings={settings} amountPaid={paidSoFar} />

                    {(payments.length > 0 || legacyReceipts.length > 0) && (
                        <div className="mt-6 max-w-xl rounded-xl border border-border bg-card/60">
                            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border px-4 py-2">
                                <p className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase">Payments</p>
                                <p className="text-sm">
                                    Paid <span className="font-semibold tabular-nums">{money(paidSoFar)}</span> of {money(invoice.total)}
                                    {balance > 0 && <span className="ml-2 text-amber-600 dark:text-amber-400">· {money(balance)} due</span>}
                                </p>
                            </div>
                            <ul className="divide-y divide-border/60">
                                {payments.map((p) => {
                                    const receipt = receipts.find((r) => r.id === p.receiptId)
                                    return (
                                        <li key={p.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3 text-sm">
                                            <span className="font-medium tabular-nums">{p.date}</span>
                                            <span className="text-muted-foreground">{paymentMethodLabel(p.method)}</span>
                                            {p.reference && <span className="text-muted-foreground truncate max-w-[10rem]">#{p.reference}</span>}
                                            {receipt && (
                                                <Link href={`/tools/receipts/${receipt.id}`} className="text-purple-400 hover:underline">
                                                    {receipt.receiptNumber}
                                                </Link>
                                            )}
                                            <span className="ml-auto font-semibold tabular-nums">{money(p.amount)}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemovePayment(p)}
                                                aria-label={`Remove payment of ${money(p.amount)}`}
                                                className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive print:hidden"
                                            >
                                                <Trash2 className="size-4" />
                                            </button>
                                        </li>
                                    )
                                })}
                                {legacyReceipts.map((r) => (
                                    <li key={r.id}>
                                        <Link href={`/tools/receipts/${r.id}`} className="flex flex-wrap items-center gap-x-3 px-4 py-3 text-sm hover:bg-muted/40">
                                            <span className="font-medium tabular-nums">{r.paymentDate}</span>
                                            <span className="text-muted-foreground">{paymentMethodLabel(r.paymentMethod)}</span>
                                            <span className="text-purple-400">{r.receiptNumber}</span>
                                            <span className="ml-auto font-semibold tabular-nums">{money(r.amountPaid)}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="flex flex-wrap gap-3 mt-6">
                        {invoice.status !== "cancelled" && balance > 0 && (
                            <button
                                onClick={() => setShowPaymentDialog(true)}
                                className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700"
                            >
                                <Wallet className="size-4" />
                                Record Payment
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
                        <DuplicateButton kind="invoice" id={invoice.id} />
                        {!invoice.recurringTemplateId && (
                            <Link
                                href={`/tools/invoices/recurring/new?fromInvoice=${invoice.id}`}
                                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/60 px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-card"
                            >
                                <Repeat className="size-4" />
                                Make Recurring
                            </Link>
                        )}
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

            {showPaymentDialog && (
                <RecordPaymentDialog
                    invoice={invoice}
                    balance={balance}
                    onCancel={() => setShowPaymentDialog(false)}
                    onConfirm={handleRecordPayment}
                />
            )}

            {/* Invoice Preview */}
            <div className="mx-auto max-w-7xl px-6 py-16">
                <div className="max-w-4xl mx-auto">
                    <div ref={invoiceRef}>
                        <InvoicePreview invoice={invoice} settings={settings} amountPaid={paidSoFar} />
                    </div>
                </div>
            </div>
        </>
    )
}
