import { Quotation, Invoice, Receipt } from "@/types/invoice"
import {
    saveInvoice,
    saveReceipt,
    getNextInvoiceNumber,
    incrementInvoiceNumber,
    getNextReceiptNumber,
} from "@/lib/storage/tools-storage"
import { v7 as uuidv7 } from 'uuid'

export function convertQuotationToInvoice(quotation: Quotation): Invoice {
    const invoiceNumber = getNextInvoiceNumber()

    const invoice: Invoice = {
        id: uuidv7(),
        invoiceNumber,
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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }

    saveInvoice(invoice)
    incrementInvoiceNumber()

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
        client: invoice.client,
        paymentDate: paymentDate || new Date().toISOString().split("T")[0],
        paymentMethod,
        relatedInvoiceNumber: invoice.invoiceNumber,
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

    saveReceipt(receipt)

    return receipt
}

export function canConvertQuotationToInvoice(quotation: Quotation): boolean {
    return quotation.status === "accepted"
}

export function canConvertInvoiceToReceipt(invoice: Invoice): boolean {
    return invoice.status === "paid" || invoice.status === "sent"
}
