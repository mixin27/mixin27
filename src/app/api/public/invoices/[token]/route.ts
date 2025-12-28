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

        const invoice = await prisma.invoice.findFirst({
            where: { token },
            include: { client: true, items: true },
        })

        if (!invoice) {
            return NextResponse.json({ error: "Invoice not found" }, { status: 404 })
        }

        const settings = await prisma.invoiceSettings.findUnique({
            where: { userId: invoice.userId }
        })

        return NextResponse.json({
            invoice: {
                id: invoice.id,
                invoiceNumber: invoice.invoiceNumber,
                client: {
                    id: invoice.client.id,
                    name: invoice.client.name,
                    email: invoice.client.email,
                    phone: invoice.client.phone,
                    address: invoice.client.address,
                    city: invoice.client.city,
                    state: invoice.client.state,
                    zipCode: invoice.client.zipCode,
                    country: invoice.client.country,
                    taxId: invoice.client.taxId,
                    createdAt: invoice.client.createdAt.toISOString(),
                },
                issueDate: invoice.issueDate.toISOString(),
                dueDate: invoice.dueDate.toISOString(),
                status: invoice.status,
                items: invoice.items.map((item: any) => ({
                    id: item.id,
                    description: item.description,
                    quantity: Number(item.quantity),
                    rate: Number(item.rate),
                    amount: Number(item.amount),
                })),
                subtotal: Number(invoice.subtotal),
                taxRate: Number(invoice.taxRate),
                taxAmount: Number(invoice.taxAmount),
                discount: Number(invoice.discount),
                discountType: invoice.discountType,
                total: Number(invoice.total),
                notes: invoice.notes,
                terms: invoice.terms,
                currency: invoice.currency,
                createdAt: invoice.createdAt.toISOString(),
                updatedAt: invoice.updatedAt.toISOString(),
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
        console.error("Error fetching invoice:", error)
        return NextResponse.json(
            { error: "Failed to fetch invoice" },
            { status: 500 },
        )
    }
}
