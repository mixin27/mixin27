"use client"

import { Receipt, InvoiceSettings } from "@/types/invoice"
import { formatDate } from "@/lib/utils"

interface ReceiptPreviewProps {
    receipt: Receipt
    settings: InvoiceSettings
}

export function ReceiptPreview({ receipt, settings }: ReceiptPreviewProps) {
    return (
        <div className="bg-white text-black p-8 md:p-12 rounded-lg shadow-lg print:shadow-none print:rounded-none">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-6">
                <div>
                    <h1 className="text-4xl font-bold mb-2">{settings.businessName}</h1>
                    <div className="text-sm text-gray-600">
                        {settings.businessEmail && <p>{settings.businessEmail}</p>}
                        {settings.businessPhone && <p>{settings.businessPhone}</p>}
                        {settings.businessAddress && <p>{settings.businessAddress}</p>}
                        {settings.businessCity && (
                            <p>
                                {settings.businessCity}
                                {settings.businessState && `, ${settings.businessState}`}
                                {settings.businessZipCode && ` ${settings.businessZipCode}`}
                            </p>
                        )}
                        {settings.taxId && <p>Tax ID: {settings.taxId}</p>}
                    </div>
                </div>
                <div className="text-left md:text-right">
                    <h2 className="text-3xl font-bold mb-2">RECEIPT</h2>
                    <p className="text-sm text-gray-600">#{receipt.receiptNumber}</p>
                </div>
            </div>

            {/* Bill To & Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div>
                    <h3 className="text-sm font-semibold mb-2 text-gray-600">BILL TO:</h3>
                    <div className="text-sm">
                        <p className="font-semibold">{receipt.client.name}</p>
                        <p>{receipt.client.email}</p>
                        {receipt.client.phone && <p>{receipt.client.phone}</p>}
                        {receipt.client.address && <p>{receipt.client.address}</p>}
                        {receipt.client.city && (
                            <p>
                                {receipt.client.city}
                                {receipt.client.state && `, ${receipt.client.state}`}
                                {receipt.client.zipCode && ` ${receipt.client.zipCode}`}
                            </p>
                        )}
                        {receipt.client.taxId && <p>Tax ID: {receipt.client.taxId}</p>}
                    </div>
                </div>
                <div className="text-left md:text-right">
                    <div className="mb-4">
                        <p className="text-sm text-gray-600">Payment Date</p>
                        <p className="font-semibold">{formatDate(receipt.paymentDate)}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Payment Method</p>
                        <p className="font-semibold capitalize">
                            {receipt.paymentMethod.replace("_", " ")}
                        </p>
                    </div>
                </div>
            </div>

            {/* Items Table */}
            <div className="overflow-x-auto mb-8">
                <table className="w-full">
                    <thead>
                        <tr className="border-b-2 border-gray-300">
                            <th className="text-left py-3 text-sm font-semibold">DESCRIPTION</th>
                            <th className="text-right py-3 text-sm font-semibold">AMOUNT</th>
                        </tr>
                    </thead>
                    <tbody>
                        {receipt.relatedInvoiceNumber && (
                            <tr className="border-b border-gray-200">
                                <td className="py-3 text-sm">
                                    Payment for Invoice #{receipt.relatedInvoiceNumber}
                                </td>
                                <td className="text-right py-3 text-sm">
                                    {receipt.currency} {receipt.amountPaid.toFixed(2)}
                                </td>
                            </tr>
                        )}
                        {!receipt.relatedInvoiceNumber && receipt.items?.map((item) => (
                            <tr key={item.id} className="border-b border-gray-200">
                                <td className="py-3 text-sm">{item.description}</td>
                                <td className="text-right py-3 text-sm">
                                    {receipt.currency} {item.amount.toFixed(2)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-12">
                <div className="w-64">
                    <div className="flex justify-between py-3 text-lg font-bold border-t-2 border-gray-300">
                        <span>Amount Paid:</span>
                        <span>
                            {receipt.currency} {receipt.amountPaid.toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Notes */}
            {receipt.notes && (
                <div className="text-sm">
                    <h4 className="font-semibold mb-2">NOTES</h4>
                    <p className="text-gray-600 whitespace-pre-wrap">{receipt.notes}</p>
                </div>
            )}
        </div>
    )
}
