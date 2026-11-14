import { v7 as uuidv7 } from "uuid"
import { Invoice, Payment, Quotation, Receipt, SplitPart } from "@/types/invoice"
import {
    deleteReceipt,
    getClientById,
    getInvoiceById,
    getInvoices,
    getNextQuotationNumber,
    getRecurringTemplateById,
    getRecurringTemplates,
    incrementQuotationNumber,
    saveRecurringTemplate,
    getNextInvoiceNumber,
    getNextReceiptNumber,
    getQuotationById,
    getReceiptById,
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
import {
    invoiceBalance,
    storedStatusAfterPayments,
    validatePayment,
    type PaymentInput,
} from "@/lib/tools/payments"
import { roundMoney } from "@/lib/tools/totals"
import {
    buildInvoiceFromTemplate,
    dueDates,
    duplicateInvoice,
    duplicateQuotation,
    duplicateReceipt,
    nextDateAfter,
} from "@/lib/tools/recurring"
import type { RecurringTemplate } from "@/types/invoice"

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
    return invoiceBalance(invoice, await getInvoiceReceipts(invoice))
}

function buildPaymentReceipt(
    invoice: Invoice,
    payment: Payment,
    receiptNumber: string,
    balanceBefore: number,
): Receipt {
    const now = new Date().toISOString()
    return {
        id: uuidv7(),
        token: uuidv7(),
        receiptNumber,
        clientId: invoice.clientId ?? invoice.client.id,
        client: invoice.client,
        paymentDate: payment.date,
        paymentMethod: payment.method,
        relatedInvoiceNumber: invoice.invoiceNumber,
        invoiceId: invoice.id,
        paymentId: payment.id,
        items: invoice.items,
        subtotal: invoice.subtotal,
        taxRate: invoice.taxRate,
        taxAmount: invoice.taxAmount,
        discount: invoice.discount,
        discountType: invoice.discountType,
        total: invoice.total,
        amountPaid: payment.amount,
        notes: [
            payment.amount >= invoice.total
                ? `Payment received for Invoice ${invoice.invoiceNumber}`
                : payment.amount >= balanceBefore
                  ? `Final payment for Invoice ${invoice.invoiceNumber}`
                  : `Part payment for Invoice ${invoice.invoiceNumber}`,
            payment.reference ? `Reference: ${payment.reference}` : "",
        ]
            .filter(Boolean)
            .join("\n"),
        currency: invoice.currency,
        createdAt: now,
        updatedAt: now,
    }
}

/**
 * Record a payment on an invoice, optionally with a receipt, and update the
 * invoice status (partially paid / paid).
 */
export async function recordPayment(
    invoiceId: string,
    input: PaymentInput,
    options: { createReceipt: boolean },
): Promise<{ invoice: Invoice; payment: Payment; receipt: Receipt | null }> {
    // Always work from the stored invoice so concurrent edits aren't lost.
    const invoice = await getInvoiceById(invoiceId)
    if (!invoice) throw new Error("Invoice not found.")
    const receipts = await getInvoiceReceipts(invoice)
    const error = validatePayment(invoice, receipts, input)
    if (error) throw new Error(error)

    const balanceBefore = invoiceBalance(invoice, receipts)
    const payment: Payment = {
        id: uuidv7(),
        date: input.date,
        amount: roundMoney(input.amount, invoice.currency),
        method: input.method,
        reference: input.reference?.trim() || undefined,
    }

    let receipt: Receipt | null = null
    if (options.createReceipt) {
        const receiptNumber = await getNextReceiptNumber()
        receipt = buildPaymentReceipt(invoice, payment, receiptNumber, balanceBefore)
        payment.receiptId = receipt.id
        await saveReceipt(receipt)
        await incrementReceiptNumber(receiptNumber)
    }

    const withPayment: Invoice = { ...invoice, payments: [...(invoice.payments ?? []), payment] }
    const allReceipts = receipt ? [...receipts, receipt] : receipts
    const updated: Invoice = {
        ...withPayment,
        status: storedStatusAfterPayments(withPayment, allReceipts),
        updatedAt: new Date().toISOString(),
    }
    await saveInvoice(updated)
    return { invoice: updated, payment, receipt }
}

/** Remove a payment from an invoice; optionally delete its receipt too. */
export async function removePayment(
    invoiceId: string,
    paymentId: string,
    options: { deleteReceipt: boolean },
): Promise<Invoice | null> {
    const invoice = await getInvoiceById(invoiceId)
    if (!invoice) return null
    const payment = invoice.payments?.find((p) => p.id === paymentId)
    if (!payment) return invoice

    if (payment.receiptId) {
        if (options.deleteReceipt) {
            await deleteReceipt(payment.receiptId)
        } else {
            // Keep the receipt but detach it, so it no longer counts as payment.
            const receipt = await getReceiptById(payment.receiptId)
            if (receipt) await saveReceipt({ ...receipt, invoiceId: undefined, paymentId: undefined })
        }
    }

    const withoutPayment: Invoice = {
        ...invoice,
        payments: (invoice.payments ?? []).filter((p) => p.id !== paymentId),
    }
    const receipts = await getInvoiceReceipts(withoutPayment)
    const base = withoutPayment.status === "paid" ? { ...withoutPayment, status: "sent" as const } : withoutPayment
    const updated: Invoice = {
        ...base,
        status: storedStatusAfterPayments(base, receipts),
        updatedAt: new Date().toISOString(),
    }
    await saveInvoice(updated)
    return updated
}

/**
 * Delete a receipt. If it was created for a payment, `removeLinkedPayment`
 * decides whether that payment is removed from the invoice as well.
 */
export async function deleteReceiptWithPayment(
    receipt: Receipt,
    removeLinkedPayment: boolean,
): Promise<void> {
    if (receipt.invoiceId && receipt.paymentId && removeLinkedPayment) {
        await removePayment(receipt.invoiceId, receipt.paymentId, { deleteReceipt: true })
        return
    }
    if (receipt.invoiceId && receipt.paymentId) {
        // Keep the payment, just forget the receipt.
        const invoice = await getInvoiceById(receipt.invoiceId)
        if (invoice) {
            await saveInvoice({
                ...invoice,
                payments: (invoice.payments ?? []).map((p) =>
                    p.id === receipt.paymentId ? { ...p, receiptId: undefined } : p,
                ),
            })
        }
    }
    await deleteReceipt(receipt.id)
    if (receipt.invoiceId && !receipt.paymentId) {
        // An older receipt counted towards the invoice; refresh its status.
        const invoice = await getInvoiceById(receipt.invoiceId)
        if (invoice) {
            const receipts = await getInvoiceReceipts(invoice)
            const base = invoice.status === "paid" ? { ...invoice, status: "sent" as const } : invoice
            await saveInvoice({ ...base, status: storedStatusAfterPayments(base, receipts) })
        }
    }
}

/** Ask how to delete a receipt; returns false if the user cancels. */
export async function confirmAndDeleteReceipt(receipt: Receipt): Promise<boolean> {
    if (!confirm(`Delete receipt ${receipt.receiptNumber}?`)) return false
    const removePaymentToo =
        !!receipt.paymentId &&
        confirm(
            `This receipt records a payment on ${receipt.relatedInvoiceNumber ?? "an invoice"}.\n\nOK also removes that payment, so the invoice shows it as unpaid again. Cancel keeps the payment and deletes only the receipt.`,
        )
    await deleteReceiptWithPayment(receipt, removePaymentToo)
    return true
}

/** Accepted quotations can be invoiced; sent ones can too after a confirmation. */
export function canConvertQuotationToInvoice(quotation: Quotation): boolean {
    return quotation.status === "accepted" || quotation.status === "sent"
}

// ---------- Duplicating ----------

const newIds = (number: string) => ({
    id: uuidv7(),
    token: uuidv7(),
    number,
    now: new Date().toISOString(),
    newItemId: () => uuidv7(),
})

/** Copy a document as a new draft dated today. Returns the new document's id. */
export async function duplicateDocument(
    kind: "quotation" | "invoice" | "receipt",
    id: string,
): Promise<string | null> {
    if (kind === "invoice") {
        const source = await getInvoiceById(id)
        if (!source) return null
        const number = getNextInvoiceNumber()
        const copy = duplicateInvoice(source, newIds(number), today())
        await saveInvoice(copy)
        await incrementInvoiceNumber(number)
        return copy.id
    }
    if (kind === "quotation") {
        const source = await getQuotationById(id)
        if (!source) return null
        const number = getNextQuotationNumber()
        const copy = duplicateQuotation(source, newIds(number), today())
        await saveQuotation(copy)
        await incrementQuotationNumber(number)
        return copy.id
    }
    const source = await getReceiptById(id)
    if (!source) return null
    const number = await getNextReceiptNumber()
    const copy = duplicateReceipt(source, newIds(number), today())
    await saveReceipt(copy)
    await incrementReceiptNumber(number)
    return copy.id
}

// ---------- Recurring invoices ----------

export interface DueTemplate {
    template: RecurringTemplate
    dates: string[]
}

/** Active templates with at least one invoice due today or earlier. */
export async function getDueRecurring(on: string = today()): Promise<DueTemplate[]> {
    const templates = await getRecurringTemplates()
    return templates
        .map((template) => ({ template, dates: dueDates(template, on) }))
        .filter((t) => t.dates.length > 0)
}

/**
 * Create draft invoices for every due date of a template (including missed
 * ones) and move the template forward. Uses the client's current details.
 */
export async function generateRecurringInvoices(templateId: string, on: string = today()): Promise<Invoice[]> {
    const template = await getRecurringTemplateById(templateId)
    if (!template) return []
    const dates = dueDates(template, on)
    if (!dates.length) return []
    const client = (await getClientById(template.clientId)) ?? template.client

    const created: Invoice[] = []
    for (const date of dates) {
        const number = getNextInvoiceNumber()
        const invoice = buildInvoiceFromTemplate(template, date, newIds(number), client)
        await saveInvoice(invoice)
        await incrementInvoiceNumber(number)
        created.push(invoice)
    }

    const generatedCount = template.generatedCount + dates.length
    const next = nextDateAfter(template, generatedCount)
    const now = new Date().toISOString()
    await saveRecurringTemplate({
        ...template,
        client,
        generatedCount,
        nextDate: next ?? template.nextDate,
        active: next === null ? false : template.active,
        lastGeneratedAt: now,
        updatedAt: now,
    })
    return created
}

/** Generate everything that is due across all templates. */
export async function generateAllDueRecurring(on: string = today()): Promise<Invoice[]> {
    const due = await getDueRecurring(on)
    const created: Invoice[] = []
    for (const { template } of due) created.push(...(await generateRecurringInvoices(template.id, on)))
    return created
}

/** Invoices generated from a template, newest first. */
export async function getTemplateInvoices(templateId: string): Promise<Invoice[]> {
    return (await getInvoices())
        .filter((i) => i.recurringTemplateId === templateId)
        .sort((a, b) => b.issueDate.localeCompare(a.issueDate))
}
