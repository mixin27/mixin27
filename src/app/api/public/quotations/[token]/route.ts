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

        const quotation = await prisma.quotation.findFirst({
            where: { token },
            include: { client: true, items: true },
        })

        if (!quotation) {
            return NextResponse.json({ error: "Quotation not found" }, { status: 404 })
        }

        const settings = await prisma.invoiceSettings.findUnique({
            where: { userId: quotation.userId }
        })

        return NextResponse.json({
            quotation: {
                id: quotation.id,
                invoiceNumber: quotation.invoiceNumber,
                client: {
                    id: quotation.client.id,
                    name: quotation.client.name,
                    email: quotation.client.email,
                    phone: quotation.client.phone,
                    address: quotation.client.address,
                    city: quotation.client.city,
                    state: quotation.client.state,
                    zipCode: quotation.client.zipCode,
                    country: quotation.client.country,
                    taxId: quotation.client.taxId,
                    createdAt: quotation.client.createdAt.toISOString(),
                },
                issueDate: quotation.issueDate.toISOString(),
                dueDate: quotation.dueDate.toISOString(),
                validUntil: quotation.validUntil.toISOString(),
                status: quotation.status,
                items: quotation.items.map((item: any) => ({
                    id: item.id,
                    description: item.description,
                    quantity: Number(item.quantity),
                    rate: Number(item.rate),
                    amount: Number(item.amount),
                })),
                subtotal: Number(quotation.subtotal),
                taxRate: Number(quotation.taxRate),
                taxAmount: Number(quotation.taxAmount),
                discount: Number(quotation.discount),
                discountType: quotation.discountType,
                total: Number(quotation.total),
                notes: quotation.notes,
                terms: quotation.terms,
                currency: quotation.currency,
                createdAt: quotation.createdAt.toISOString(),
                updatedAt: quotation.updatedAt.toISOString(),
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
        console.error("Error fetching quotation:", error)
        return NextResponse.json(
            { error: "Failed to fetch quotation" },
            { status: 500 },
        )
    }
}
