import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const userId = session.user.id

        // Fetch all data
        const [
            clients,
            invoices,
            resumes,
            settings,
            quotations,
            receipts,
            contracts,
            timeEntries,
        ] = await Promise.all([
            prisma.client.findMany({
                where: { userId },
            }),
            prisma.invoice.findMany({
                where: { userId },
                include: {
                    client: true,
                    items: true,
                },
            }),
            prisma.resume.findMany({
                where: { userId },
                include: {
                    experiences: { orderBy: { order: "asc" } },
                    educations: { orderBy: { order: "asc" } },
                    skills: true,
                    projects: { orderBy: { order: "asc" } },
                    certifications: true,
                    languages: true,
                    customSections: true,
                    sections: { orderBy: { order: "asc" } },
                    style: true,
                },
            }) as any,
            prisma.invoiceSettings.findUnique({
                where: { userId },
            }),
            prisma.quotation.findMany({
                where: { userId },
                include: {
                    client: true,
                    items: true,
                },
            }),
            prisma.receipt.findMany({
                where: { userId },
                include: {
                    client: true,
                    items: true,
                },
            }),
            prisma.contract.findMany({
                where: { userId },
                include: {
                    client: true,
                },
            }),
            prisma.timeEntry.findMany({
                where: { userId },
                include: {
                    client: true,
                },
            }),
        ])

        // Transform resumes to match localStorage format
        const transformedResumes = resumes.map((resume: any) => ({
            id: resume.id,
            name: resume.name,
            template: resume.template,
            personal: resume.personal,
            summary: resume.summary,
            experience: resume.experiences.map((exp: any) => ({
                id: exp.id,
                company: exp.company,
                position: exp.position,
                location: exp.location,
                startDate: exp.startDate,
                endDate: exp.endDate,
                current: exp.current,
                description: exp.description,
                highlights: exp.highlights,
            })),
            education: resume.educations.map((edu: any) => ({
                id: edu.id,
                institution: edu.institution,
                degree: edu.degree,
                field: edu.field,
                location: edu.location,
                startDate: edu.startDate,
                endDate: edu.endDate,
                current: edu.current,
                gpa: edu.gpa,
                description: edu.description,
            })),
            skills: resume.skills.map((skill: any) => ({
                id: skill.id,
                name: skill.name,
                category: skill.category,
                level: skill.level,
            })),
            projects: resume.projects.map((project: any) => ({
                id: project.id,
                name: project.name,
                description: project.description,
                technologies: project.technologies,
                startDate: project.startDate,
                endDate: project.endDate,
                current: project.current,
                url: project.url,
                highlights: project.highlights,
            })),
            certifications: resume.certifications.map((cert: any) => ({
                id: cert.id,
                name: cert.name,
                issuer: cert.issuer,
                issueDate: cert.issueDate,
                expiryDate: cert.expiryDate,
                credentialId: cert.credentialId,
                url: cert.url,
            })),
            languages: resume.languages.map((lang: any) => ({
                id: lang.id,
                name: lang.name,
                proficiency: lang.proficiency,
            })),
            customSections: resume.customSections.map((section: any) => ({
                id: section.id,
                title: section.title,
                content: section.content,
                items: section.items,
            })),
            sections: resume.sections.map((section: any) => ({
                id: section.id,
                type: section.type,
                title: section.title,
                visible: section.visible,
                order: section.order,
            })),
            style: resume.style
                ? {
                    template: resume.style.template,
                    primaryColor: resume.style.primaryColor,
                    fontFamily: resume.style.fontFamily,
                    fontSize: resume.style.fontSize,
                    spacing: resume.style.spacing,
                    showPhoto: resume.style.showPhoto,
                    showIcons: resume.style.showIcons,
                }
                : {
                    template: resume.template,
                    primaryColor: "#2563eb",
                    fontFamily: "Inter",
                    fontSize: "medium",
                    spacing: "normal",
                    showPhoto: true,
                    showIcons: true,
                },
            createdAt: resume.createdAt.toISOString(),
            updatedAt: resume.updatedAt.toISOString(),
        }))

        // Transform invoices to match frontend format
        const transformedInvoices = invoices.map((invoice: any) => ({
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
            token: invoice.token,
            createdAt: invoice.createdAt.toISOString(),
            updatedAt: invoice.updatedAt.toISOString(),
        }))

        // Transform quotations to match frontend format
        const transformedQuotations = quotations.map((quotation: any) => ({
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
            token: quotation.token,
            createdAt: quotation.createdAt.toISOString(),
            updatedAt: quotation.updatedAt.toISOString(),
        }))

        // Transform receipts to match frontend format
        const transformedReceipts = receipts.map((receipt: any) => ({
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
            token: receipt.token,
            createdAt: receipt.createdAt.toISOString(),
            updatedAt: receipt.updatedAt.toISOString(),
        }))

        // Transform contracts to match frontend format
        const transformedContracts = contracts.map((contract: any) => ({
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
            token: contract.token,
            createdAt: contract.createdAt.toISOString(),
            updatedAt: contract.updatedAt.toISOString(),
        }))

        // Transform time entries to match frontend format
        const transformedTimeEntries = timeEntries.map((timeEntry: any) => ({
            id: timeEntry.id,
            clientId: timeEntry.clientId,
            client: {
                id: timeEntry.client.id,
                name: timeEntry.client.name,
                email: timeEntry.client.email,
                phone: timeEntry.client.phone,
                address: timeEntry.client.address,
                city: timeEntry.client.city,
                state: timeEntry.client.state,
                zipCode: timeEntry.client.zipCode,
                country: timeEntry.client.country,
                taxId: timeEntry.client.taxId,
                createdAt: timeEntry.client.createdAt.toISOString(),
            },
            projectName: timeEntry.projectName,
            description: timeEntry.description,
            date: timeEntry.date.toISOString(),
            startTime: timeEntry.startTime,
            endTime: timeEntry.endTime,
            duration: timeEntry.duration,
            hourlyRate: Number(timeEntry.hourlyRate),
            amount: Number(timeEntry.amount),
            billable: timeEntry.billable,
            invoiced: timeEntry.invoiced,
            invoiceId: timeEntry.invoiceId,
            tags: timeEntry.tags,
            createdAt: timeEntry.createdAt.toISOString(),
            updatedAt: timeEntry.updatedAt.toISOString(),
        }))

        // Transform clients to match frontend format
        const transformedClients = clients.map((client: any) => ({
            id: client.id,
            name: client.name,
            email: client.email,
            phone: client.phone,
            address: client.address,
            city: client.city,
            state: client.state,
            zipCode: client.zipCode,
            country: client.country,
            taxId: client.taxId,
            createdAt: client.createdAt.toISOString(),
        }))

        // Transform settings to match frontend format
        const transformedSettings = settings
            ? {
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
                nextInvoiceNumber: settings.nextInvoiceNumber,
            }
            : null

        return NextResponse.json({
            clients: transformedClients,
            invoices: transformedInvoices,
            resumes: transformedResumes,
            settings: transformedSettings,
            quotations: transformedQuotations,
            receipts: transformedReceipts,
            contracts: transformedContracts,
            timeEntries: transformedTimeEntries,
        })
    } catch (error) {
        console.error("Sync download error:", error)
        return NextResponse.json(
            { error: "Download failed", details: (error as Error).message },
            { status: 500 },
        )
    }
}
