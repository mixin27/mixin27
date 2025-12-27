import { Quotation, Invoice, Receipt } from "@/types/invoice"
import {
  saveInvoice,
  saveReceipt,
  getNextInvoiceNumber,
  incrementInvoiceNumber,
  getNextReceiptNumber,
} from "./storage/tools-storage"
import {v7 as uuidv7} from 'uuid'

/**
 * Convert a Quotation to an Invoice
 * Used when a quotation is accepted by the client
 */
export function convertQuotationToInvoice(quotation: Quotation): Invoice {
  const invoiceNumber = getNextInvoiceNumber()

  const invoice: Invoice = {
    id: uuidv7(),
    invoiceNumber,
    client: quotation.client,
    issueDate: new Date().toISOString().split("T")[0],
    dueDate: quotation.validUntil, // Use quotation's valid until as due date
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  saveInvoice(invoice)
  incrementInvoiceNumber()

  return invoice
}

/**
 * Convert an Invoice to a Receipt
 * Used when an invoice is paid
 */
export async function convertInvoiceToReceipt(
  invoice: Invoice,
  paymentMethod: Receipt["paymentMethod"],
  paymentDate?: string,
  amountPaid?: number,
): Promise<Receipt> {
  const receiptNumber = await getNextReceiptNumber()

  const receipt: Receipt = {
    id: uuidv7(),
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

/**
 * Check if a quotation can be converted to invoice
 */
export function canConvertQuotationToInvoice(quotation: Quotation): boolean {
  // Only accepted quotations can be converted
  return quotation.status === "accepted"
}

/**
 * Check if an invoice can be converted to receipt
 */
export function canConvertInvoiceToReceipt(invoice: Invoice): boolean {
  // Only paid or sent invoices can have receipts generated
  return invoice.status === "paid" || invoice.status === "sent"
}
