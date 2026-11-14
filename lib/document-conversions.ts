import { v7 as uuidv7 } from "uuid"
import { Invoice, Quotation, Receipt, SplitPart } from "@/types/invoice"
import {
    getInvoices,
    getNextInvoiceNumber,
    getNextReceiptNumber,
    getQuotationById,
    getReceipts,
    incrementInvoiceNumber,
    incrementReceiptNumber,
    saveInvoice,
    saveQuotation,
    saveReceipt,
} from "@/lib/storage/tools-storage"
import {
    allocateInstallments,
    buildInstallmentInvoice,
    linkedInvoices,
    missingInstallments,
} from "@/lib/tools/split"
import { invoicePaidAmount } from "@/lib/tools/client-stats"
import { roundMoney } from "@/lib/tools/totals"

const today = () => new Date().toISOString().slice(0, 10)

/** Invoices created from this quotation, read fresh from storage. */
export async function getLinkedInvoices(quotation: Quotation): Promise<Invoice[]> {
    return linkedInvoices(quotation, await getInvoices())
}

async function linkInvoicesToQuotation(
    quotationId: string,
    invoiceIds: string[],
    splitPlan?: SplitPart[],
): Promise<Quotation | null> {
    // Re-read so we never overwrite edits made since the page loaded.
    const latest = await getQuotationById(quotationId)
    if (!latest) return null
    const updated: Quotation = {
        ...latest,
        invoiceIds: Array.from(new Set([...(latest.invoiceIds ?? []), ...invoiceIds])),
        ...(splitPlan ? { splitPlan } : {}),
        updatedAt: new Date().toISOString(),
    }
    await saveQuotation(updated)
    return updated
}

/**
 * Turn the whole quotation into one invoice. If an invoice for it already
 * exists, that invoice is returned instead and nothing new is created.
 */
export async function convertQuotationToInvoice(
    quotation: Quotation,
): Promise<{ invoice: Invoice; created: boolean }> {
    const existing = (await getLinkedInvoices(quotation)).filter((i) => i.status !== "cancelled")
    if (existing.length) return { invoice: existing[0], created: false }

    const invoiceNumber = getNextInvoiceNumber()
    const now = new Date().toISOString()
    const invoice: Invoice = {
        id: uuidv7(),
        invoiceNumber,
        clientId: quotation.clientId ?? quotation.client.id,
        client: quotation.client,
        issueDate: today(),
        dueDate: quotation.validUntil,
        status: "draft",
        items: quotation.items,
        subtotal: quotation.subtotal,
        taxRate: quotation.taxRate,
        taxAmount: quotation.taxAmount,
        discount: quotation.discount,
        discountType: quotation.discountType,
        total: quotation.total,
        notes: quotation.notes
            ? `${quotation.notes}\n\nConverted from Quotation: ${quotation.invoiceNumber}`
            : `Converted from Quotation: ${quotation.invoiceNumber}`,
        terms: quotation.terms,
        currency: quotation.currency,
        token: uuidv7(),
        sourceQuotationId: quotation.id,
        createdAt: now,
        updatedAt: now,
    }

    await saveInvoice(invoice)
    await incrementInvoiceNumber(invoiceNumber)
    await linkInvoicesToQuotation(quotation.id, [invoice.id])

    return { invoice, created: true }
}

/**
 * Create one invoice per installment. With a saved split plan, only the parts
 * that have no active invoice are created, so running it twice is safe.
 */
export async function createInstallmentInvoices(
    quotation: Quotation,
    parts: SplitPart[],
): Promise<Invoice[]> {
    const linked = (await getLinkedInvoices(quotation)).filter((i) => i.status !== "cancelled")

    let plan: SplitPart[]
    let toCreate
    if (quotation.splitPlan?.length) {
        plan = quotation.splitPlan
        toCreate = missingInstallments(quotation, linked)
    } else {
        if (linked.length) {
            throw new Error("This quotation already has an invoice. Cancel or delete it before splitting.")
        }
        const { parts: allocated, errors } = allocateInstallments(quotation, parts)
        if (errors.length) throw new Error(errors[0])
        plan = parts
        toCreate = allocated
    }

    const created: Invoice[] = []
    for (const part of toCreate) {
        const invoiceNumber = getNextInvoiceNumber()
        const now = new Date().toISOString()
        const invoice = buildInstallmentInvoice(quotation, part, plan.length, {
            id: uuidv7(),
            token: uuidv7(),
            invoiceNumber,
            issueDate: today(),
            now,
        })
        await saveInvoice(invoice)
        await incrementInvoiceNumber(invoiceNumber)
        created.push(invoice)
    }

    await linkInvoicesToQuotation(
        quotation.id,
        created.map((i) => i.id),
        plan,
    )
    return created
}

/** Receipts that belong to this invoice. */
export async function getInvoiceReceipts(invoice: Invoice): Promise<Receipt[]> {
    return (await getReceipts()).filter((r) => r.invoiceId === invoice.id)
}

/** What is still owed on an invoice. */
export async function getInvoiceBalance(invoice: Invoice): Promise<number> {
    const paid = invoicePaidAmount(invoice, await getInvoiceReceipts(invoice))
    return roundMoney(invoice.total - paid, invoice.currency)
}

/**
 * Create a receipt for a payment against an invoice (defaults to the balance)
 * and mark the invoice paid or partially paid.
 */
export async function convertInvoiceToReceipt(
    invoice: Invoice,
    paymentMethod: Receipt["paymentMethod"],
    paymentDate?: string,
    amountPaid?: number,
): Promise<{ receipt: Receipt; invoice: Invoice }> {
    const balance = await getInvoiceBalance(invoice)
    const amount = roundMoney(amountPaid && amountPaid > 0 ? amountPaid : balance, invoice.currency)
    const receiptNumber = await getNextReceiptNumber()
    const now = new Date().toISOString()

    const receipt: Receipt = {
        id: uuidv7(),
        token: uuidv7(),
        receiptNumber,
        clientId: invoice.clientId ?? invoice.client.id,
        client: invoice.client,
        paymentDate: paymentDate || today(),
        paymentMethod,
        relatedInvoiceNumber: invoice.invoiceNumber,
        invoiceId: invoice.id,
        items: invoice.items,
        subtotal: invoice.subtotal,
        taxRate: invoice.taxRate,
        taxAmount: invoice.taxAmount,
        discount: invoice.discount,
        discountType: invoice.discountType,
        total: invoice.total,
        amountPaid: amount,
        notes:
            amount >= invoice.total
                ? `Payment received for Invoice ${invoice.invoiceNumber}`
                : amount >= balance
                  ? `Final payment for Invoice ${invoice.invoiceNumber}`
                  : `Part payment for Invoice ${invoice.invoiceNumber}`,
        currency: invoice.currency,
        createdAt: now,
        updatedAt: now,
    }

    await saveReceipt(receipt)
    await incrementReceiptNumber(receiptNumber)

    const remaining = roundMoney(balance - amount, invoice.currency)
    const status: Invoice["status"] = remaining <= 0 ? "paid" : "partially_paid"
    const updatedInvoice = invoice.status === status ? invoice : { ...invoice, status, updatedAt: now }
    if (updatedInvoice !== invoice) await saveInvoice(updatedInvoice)

    return { receipt, invoice: updatedInvoice }
}

/** Accepted quotations can be invoiced; sent ones can too after a confirmation. */
export function canConvertQuotationToInvoice(quotation: Quotation): boolean {
    return quotation.status === "accepted" || quotation.status === "sent"
}

export function canConvertInvoiceToReceipt(invoice: Invoice): boolean {
    return ["sent", "partially_paid", "overdue", "paid"].includes(invoice.status)
}
