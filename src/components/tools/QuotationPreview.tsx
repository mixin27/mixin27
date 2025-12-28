"use client"

import { Quotation, InvoiceSettings } from "@/types/invoice"
import { formatDate } from "@/lib/utils"

interface QuotationPreviewProps {
    quotation: Quotation
    settings: InvoiceSettings
}

export function QuotationPreview({ quotation, settings }: QuotationPreviewProps) {
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
                    <h2 className="text-3xl font-bold mb-2">QUOTATION</h2>
                    <p className="text-sm text-gray-600">#{quotation.invoiceNumber}</p>
                </div>
            </div>

            {/* Bill To & Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div>
                    <h3 className="text-sm font-semibold mb-2 text-gray-600">PREPARED FOR:</h3>
                    <div className="text-sm">
                        <p className="font-semibold">{quotation.client.name}</p>
                        <p>{quotation.client.email}</p>
                        {quotation.client.phone && <p>{quotation.client.phone}</p>}
                        {quotation.client.address && <p>{quotation.client.address}</p>}
                        {quotation.client.city && (
                            <p>
                                {quotation.client.city}
                                {quotation.client.state && `, ${quotation.client.state}`}
                                {quotation.client.zipCode && ` ${quotation.client.zipCode}`}
                            </p>
                        )}
                        {quotation.client.taxId && <p>Tax ID: {quotation.client.taxId}</p>}
                    </div>
                </div>
                <div className="text-left md:text-right">
                    <div className="mb-4">
                        <p className="text-sm text-gray-600">Issue Date</p>
                        <p className="font-semibold">{formatDate(quotation.issueDate)}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Valid Until</p>
                        <p className="font-semibold">{formatDate(quotation.validUntil)}</p>
                    </div>
                </div>
            </div>

            {/* Items Table */}
            <div className="overflow-x-auto mb-8">
                <table className="w-full">
                    <thead>
                        <tr className="border-b-2 border-gray-300">
                            <th className="text-left py-3 text-sm font-semibold">
                                DESCRIPTION
                            </th>
                            <th className="text-right py-3 text-sm font-semibold">QTY</th>
                            <th className="text-right py-3 text-sm font-semibold">RATE</th>
                            <th className="text-right py-3 text-sm font-semibold">AMOUNT</th>
                        </tr>
                    </thead>
                    <tbody>
                        {quotation.items.map((item) => (
                            <tr key={item.id} className="border-b border-gray-200">
                                <td className="py-3 text-sm">{item.description}</td>
                                <td className="text-right py-3 text-sm">{item.quantity}</td>
                                <td className="text-right py-3 text-sm">
                                    {quotation.currency} {item.rate.toFixed(2)}
                                </td>
                                <td className="text-right py-3 text-sm">
                                    {quotation.currency} {item.amount.toFixed(2)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-12">
                <div className="w-64">
                    <div className="flex justify-between py-2 text-sm">
                        <span className="text-gray-600">Subtotal:</span>
                        <span>
                            {quotation.currency} {quotation.subtotal.toFixed(2)}
                        </span>
                    </div>
                    {quotation.discount > 0 && (
                        <div className="flex justify-between py-2 text-sm">
                            <span className="text-gray-600">
                                Discount{" "}
                                {quotation.discountType === "percentage"
                                    ? `(${quotation.discount}%)`
                                    : ""}
                                :
                            </span>
                            <span>
                                -{quotation.currency}{" "}
                                {quotation.discountType === "percentage"
                                    ? (quotation.subtotal * (quotation.discount / 100)).toFixed(2)
                                    : quotation.discount.toFixed(2)}
                            </span>
                        </div>
                    )}
                    {quotation.taxRate > 0 && (
                        <div className="flex justify-between py-2 text-sm">
                            <span className="text-gray-600">Tax ({quotation.taxRate}%):</span>
                            <span>
                                {quotation.currency} {quotation.taxAmount.toFixed(2)}
                            </span>
                        </div>
                    )}
                    <div className="flex justify-between py-3 text-lg font-bold border-t-2 border-gray-300">
                        <span>Total:</span>
                        <span>
                            {quotation.currency} {quotation.total.toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Notes & Terms */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                {quotation.notes && (
                    <div>
                        <h4 className="font-semibold mb-2">NOTES</h4>
                        <p className="text-gray-600 whitespace-pre-wrap">{quotation.notes}</p>
                    </div>
                )}
                {quotation.terms && (
                    <div>
                        <h4 className="font-semibold mb-2">TERMS & CONDITIONS</h4>
                        <p className="text-gray-600 whitespace-pre-wrap">{quotation.terms}</p>
                    </div>
                )}
            </div>
        </div>
    )
}
