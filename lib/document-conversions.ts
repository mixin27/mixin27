import { Quotation, Invoice, Receipt } from "@/types/invoice"
import {
    saveInvoice,
    saveReceipt,
    getNextInvoiceNumber,
    incrementInvoiceNumber,
    getNextReceiptNumber,
    incrementReceiptNumber,
} from "@/lib/storage/tools-storage"
import { v7 as uuidv7 } from 'uuid'

export async function convertQuotationToInvoice(quotation: Quotation): Promise<Invoice> {
    const invoiceNumber = getNextInvoiceNumber()

    const invoice: Invoice = {
        id: uuidv7(),
        invoiceNumber,
        clientId: quotation.clientId ?? quotation.client.id,
        client: quotation.client,
        issueDate: new Date().toISOString().split("T")[0],
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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }

    await saveInvoice(invoice)
    await incrementInvoiceNumber(invoiceNumber)

    return invoice
}

export async function convertInvoiceToReceipt(
    invoice: Invoice,
    paymentMethod: Receipt["paymentMethod"],
    paymentDate?: string,
    amountPaid?: number,
): Promise<Receipt> {
    const receiptNumber = await getNextReceiptNumber()

    const receipt: Receipt = {
        id: uuidv7(),
        token: uuidv7(),
        receiptNumber,
        clientId: invoice.clientId ?? invoice.client.id,
        client: invoice.client,
        paymentDate: paymentDate || new Date().toISOString().split("T")[0],
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
        amountPaid: amountPaid || invoice.total,
        notes: `Payment received for Invoice ${invoice.invoiceNumber}`,
        currency: invoice.currency,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }

    await saveReceipt(receipt)
    await incrementReceiptNumber(receiptNumber)

    return receipt
}

export function canConvertQuotationToInvoice(quotation: Quotation): boolean {
    return quotation.status === "accepted"
}

export function canConvertInvoiceToReceipt(invoice: Invoice): boolean {
    return invoice.status === "paid" || invoice.status === "sent"
}
