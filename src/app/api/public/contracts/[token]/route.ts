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

        const contract = await prisma.contract.findFirst({
            where: { token },
            include: { client: true },
        })

        if (!contract) {
            return NextResponse.json({ error: "Contract not found" }, { status: 404 })
        }

        const settings = await prisma.invoiceSettings.findUnique({
            where: { userId: contract.userId }
        })

        return NextResponse.json({
            contract: {
                id: contract.id,
                contractNumber: contract.contractNumber,
                templateType: contract.templateType,
                templateName: contract.templateName,
                client: {
                    id: contract.client.id,
                    name: contract.client.name,
                    email: contract.client.email,
                    phone: contract.client.phone,
                    address: contract.client.address,
                    city: contract.client.city,
                    state: contract.client.state,
                    zipCode: contract.client.zipCode,
                    country: contract.client.country,
                    taxId: contract.client.taxId,
                    createdAt: contract.client.createdAt.toISOString(),
                },
                projectName: contract.projectName,
                projectScope: contract.projectScope,
                deliverables: contract.deliverables,
                startDate: contract.startDate.toISOString(),
                endDate: contract.endDate.toISOString(),
                signatureDate: contract.signatureDate.toISOString(),
                projectFee: Number(contract.projectFee),
                paymentTerms: contract.paymentTerms,
                currency: contract.currency,
                clientSignature: contract.clientSignature,
                clientSignatureType: contract.clientSignatureType,
                businessSignature: contract.businessSignature,
                businessSignatureType: contract.businessSignatureType,
                status: contract.status,
                generatedContent: contract.generatedContent,
                notes: contract.notes,
                createdAt: contract.createdAt.toISOString(),
                updatedAt: contract.updatedAt.toISOString(),
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
        console.error("Error fetching contract:", error)
        return NextResponse.json(
            { error: "Failed to fetch contract" },
            { status: 500 },
        )
    }
}
