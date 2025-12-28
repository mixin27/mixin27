import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ token: string }> }
) {
    try {
        const token = (await params).token

        if (!token) {
            return NextResponse.json({ error: "Token required" }, { status: 400 })
        }

        const receipt = await prisma.receipt.findFirst({
            where: { token },
            include: { client: true, items: true },
        })

        if (!receipt) {
            return NextResponse.json({ error: "Receipt not found" }, { status: 404 })
        }

        const settings = await prisma.invoiceSettings.findUnique({
            where: { userId: receipt.userId }
        })

        return NextResponse.json({
            receipt: {
                id: receipt.id,
                receiptNumber: receipt.receiptNumber,
                client: {
                    id: receipt.client.id,
                    name: receipt.client.name,
                    email: receipt.client.email,
                    phone: receipt.client.phone,
                    address: receipt.client.address,
                    city: receipt.client.city,
                    state: receipt.client.state,
                    zipCode: receipt.client.zipCode,
                    country: receipt.client.country,
                    taxId: receipt.client.taxId,
                    createdAt: receipt.client.createdAt.toISOString(),
                },
                paymentDate: receipt.paymentDate.toISOString(),
                paymentMethod: receipt.paymentMethod,
                relatedInvoiceNumber: receipt.relatedInvoiceNumber,
                items: receipt.items.map((item: any) => ({
                    id: item.id,
                    description: item.description,
                    quantity: Number(item.quantity),
                    rate: Number(item.rate),
                    amount: Number(item.amount),
                })),
                subtotal: Number(receipt.subtotal),
                taxRate: Number(receipt.taxRate),
                taxAmount: Number(receipt.taxAmount),
                discount: Number(receipt.discount),
                discountType: receipt.discountType,
                total: Number(receipt.total),
                amountPaid: Number(receipt.amountPaid),
                notes: receipt.notes,
                currency: receipt.currency,
                createdAt: receipt.createdAt.toISOString(),
                updatedAt: receipt.updatedAt.toISOString(),
            },
            settings: settings ? {
                id: settings.id,
                businessName: settings.businessName,
                businessEmail: settings.businessEmail,
                businessPhone: settings.businessPhone,
                businessAddress: settings.businessAddress,
                businessCity: settings.businessCity,
                businessState: settings.businessState,
                businessZipCode: settings.businessZipCode,
                businessCountry: settings.businessCountry,
                taxId: settings.taxId,
                logo: settings.logo,
                defaultCurrency: settings.defaultCurrency,
                defaultTaxRate: Number(settings.defaultTaxRate),
                defaultPaymentTerms: settings.defaultPaymentTerms,
                invoicePrefix: settings.invoicePrefix,
                nextInvoiceNumber: settings.nextInvoiceNumber
            } : null
        })

    } catch (error) {
        console.error("Error fetching receipt:", error)
        return NextResponse.json(
            { error: "Failed to fetch receipt" },
            { status: 500 },
        )
    }
}
