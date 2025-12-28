import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import {
    Client,
    Invoice,
    InvoiceItem,
    Quotation,
    Receipt,
    Contract,
    TimeEntry,
} from "@/types/invoice"

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const userId = session.user.id

        // Verify user exists in database to avoid foreign key constraints
        const user = await prisma.user.findUnique({
            where: { id: userId },
        })

        if (!user) {
            return NextResponse.json(
                { error: "User not found. Please re-login." },
                { status: 401 },
            )
        }

        const data = await request.json()

        // Increase transaction timeout and use maxWait
        await prisma.$transaction(
            async (tx) => {
                // 1. Sync Clients
                if (data.clients && Array.isArray(data.clients)) {
                    const uniqueClients = deduplicateById<Client>(data.clients)
                    // Batch upsert for better performance
                    await Promise.all(
                        uniqueClients.map((client) =>
                            tx.client.upsert({
                                where: { id: client.id },
                                update: {
                                    name: client.name,
                                    email: client.email,
                                    phone: client.phone,
                                    address: client.address,
                                    city: client.city,
                                    state: client.state,
                                    zipCode: client.zipCode,
                                    country: client.country,
                                    taxId: client.taxId,
                                },
                                create: {
                                    id: client.id,
                                    userId,
                                    name: client.name,
                                    email: client.email,
                                    phone: client.phone,
                                    address: client.address,
                                    city: client.city,
                                    state: client.state,
                                    zipCode: client.zipCode,
                                    country: client.country,
                                    taxId: client.taxId,
                                    createdAt: new Date(client.createdAt),
                                },
                            }),
                        ),
                    )
                }

                // 2. Sync Invoices
                if (data.invoices && Array.isArray(data.invoices)) {
                    const uniqueInvoices = deduplicateById<Invoice>(data.invoices)
                    await Promise.all(
                        uniqueInvoices.map(async (invoice) => {
                            await tx.invoice.upsert({
                                where: { id: invoice.id },
                                update: {
                                    invoiceNumber: invoice.invoiceNumber,
                                    issueDate: new Date(invoice.issueDate),
                                    dueDate: new Date(invoice.dueDate),
                                    status: invoice.status,
                                    subtotal: invoice.subtotal,
                                    taxRate: invoice.taxRate,
                                    taxAmount: invoice.taxAmount,
                                    discount: invoice.discount,
                                    discountType: invoice.discountType,
                                    total: invoice.total,
                                    notes: invoice.notes,
                                    terms: invoice.terms,
                                    currency: invoice.currency,
                                    token: invoice.token,
                                    updatedAt: new Date(),
                                },
                                create: {
                                    id: invoice.id,
                                    userId,
                                    clientId: invoice.client.id,
                                    invoiceNumber: invoice.invoiceNumber,
                                    issueDate: new Date(invoice.issueDate),
                                    dueDate: new Date(invoice.dueDate),
                                    status: invoice.status,
                                    subtotal: invoice.subtotal,
                                    taxRate: invoice.taxRate,
                                    taxAmount: invoice.taxAmount,
                                    discount: invoice.discount,
                                    discountType: invoice.discountType,
                                    total: invoice.total,
                                    notes: invoice.notes,
                                    terms: invoice.terms,
                                    currency: invoice.currency,
                                    token: invoice.token,
                                    createdAt: new Date(invoice.createdAt),
                                },
                            })

                            // Delete old items and create new ones
                            await tx.invoiceItem.deleteMany({
                                where: { invoiceId: invoice.id },
                            })

                            if (invoice.items && invoice.items.length > 0) {
                                const uniqueItems = deduplicateById<InvoiceItem>(invoice.items)
                                await tx.invoiceItem.createMany({
                                    data: uniqueItems.map((item) => ({
                                        id: item.id,
                                        invoiceId: invoice.id,
                                        description: item.description,
                                        quantity: item.quantity,
                                        rate: item.rate,
                                        amount: item.amount,
                                    })),
                                    skipDuplicates: true,
                                })
                            }
                        }),
                    )
                }

                // 3. Sync Settings
                if (data.settings) {
                    await tx.invoiceSettings.upsert({
                        where: { userId },
                        update: {
                            businessName: data.settings.businessName,
                            businessEmail: data.settings.businessEmail,
                            businessPhone: data.settings.businessPhone,
                            businessAddress: data.settings.businessAddress,
                            businessCity: data.settings.businessCity,
                            businessState: data.settings.businessState,
                            businessZipCode: data.settings.businessZipCode,
                            businessCountry: data.settings.businessCountry,
                            taxId: data.settings.taxId,
                            logo: data.settings.logo,
                            defaultCurrency: data.settings.defaultCurrency,
                            defaultTaxRate: data.settings.defaultTaxRate,
                            defaultPaymentTerms: data.settings.defaultPaymentTerms,
                            invoicePrefix: data.settings.invoicePrefix,
                            nextInvoiceNumber: data.settings.nextInvoiceNumber,
                        },
                        create: {
                            userId,
                            businessName: data.settings.businessName,
                            businessEmail: data.settings.businessEmail,
                            businessPhone: data.settings.businessPhone,
                            businessAddress: data.settings.businessAddress,
                            businessCity: data.settings.businessCity,
                            businessState: data.settings.businessState,
                            businessZipCode: data.settings.businessZipCode,
                            businessCountry: data.settings.businessCountry,
                            taxId: data.settings.taxId,
                            logo: data.settings.logo,
                            defaultCurrency: data.settings.defaultCurrency,
                            defaultTaxRate: data.settings.defaultTaxRate,
                            defaultPaymentTerms: data.settings.defaultPaymentTerms,
                            invoicePrefix: data.settings.invoicePrefix,
                            nextInvoiceNumber: data.settings.nextInvoiceNumber,
                        },
                    })
                }

                // 4. Sync Quotations
                if (data.quotations && Array.isArray(data.quotations)) {
                    const uniqueQuotations = deduplicateById<Quotation>(data.quotations)
                    await Promise.all(
                        uniqueQuotations.map(async (quotation) => {
                            await tx.quotation.upsert({
                                where: { id: quotation.id },
                                update: {
                                    invoiceNumber: quotation.invoiceNumber,
                                    issueDate: new Date(quotation.issueDate),
                                    dueDate: new Date(quotation.dueDate),
                                    validUntil: new Date(quotation.validUntil),
                                    status: quotation.status,
                                    subtotal: quotation.subtotal,
                                    taxRate: quotation.taxRate,
                                    taxAmount: quotation.taxAmount,
                                    discount: quotation.discount,
                                    discountType: quotation.discountType,
                                    total: quotation.total,
                                    notes: quotation.notes,
                                    terms: quotation.terms,
                                    currency: quotation.currency,
                                    token: quotation.token,
                                    updatedAt: new Date(),
                                },
                                create: {
                                    id: quotation.id,
                                    userId,
                                    clientId: quotation.client.id,
                                    invoiceNumber: quotation.invoiceNumber,
                                    issueDate: new Date(quotation.issueDate),
                                    dueDate: new Date(quotation.dueDate),
                                    validUntil: new Date(quotation.validUntil),
                                    status: quotation.status,
                                    subtotal: quotation.subtotal,
                                    taxRate: quotation.taxRate,
                                    taxAmount: quotation.taxAmount,
                                    discount: quotation.discount,
                                    discountType: quotation.discountType,
                                    total: quotation.total,
                                    notes: quotation.notes,
                                    terms: quotation.terms,
                                    currency: quotation.currency,
                                    token: quotation.token,
                                    createdAt: new Date(quotation.createdAt),
                                },
                            })

                            // Delete old items and create new ones
                            await tx.invoiceItem.deleteMany({
                                where: { quotationId: quotation.id },
                            })

                            if (quotation.items && quotation.items.length > 0) {
                                const uniqueItems = deduplicateById<InvoiceItem>(quotation.items)
                                await tx.invoiceItem.createMany({
                                    data: uniqueItems.map((item) => ({
                                        id: item.id,
                                        quotationId: quotation.id,
                                        description: item.description,
                                        quantity: item.quantity,
                                        rate: item.rate,
                                        amount: item.amount,
                                    })),
                                    skipDuplicates: true,
                                })
                            }
                        }),
                    )
                }

                // 5. Sync Receipts
                if (data.receipts && Array.isArray(data.receipts)) {
                    const uniqueReceipts = deduplicateById<Receipt>(data.receipts)
                    await Promise.all(
                        uniqueReceipts.map(async (receipt) => {
                            await tx.receipt.upsert({
                                where: { id: receipt.id },
                                update: {
                                    receiptNumber: receipt.receiptNumber,
                                    paymentDate: new Date(receipt.paymentDate),
                                    paymentMethod: receipt.paymentMethod,
                                    relatedInvoiceNumber: receipt.relatedInvoiceNumber,
                                    subtotal: receipt.subtotal,
                                    taxRate: receipt.taxRate,
                                    taxAmount: receipt.taxAmount,
                                    discount: receipt.discount,
                                    discountType: receipt.discountType,
                                    total: receipt.total,
                                    amountPaid: receipt.amountPaid,
                                    notes: receipt.notes,
                                    currency: receipt.currency,
                                    token: receipt.token,
                                    updatedAt: new Date(),
                                },
                                create: {
                                    id: receipt.id,
                                    userId,
                                    clientId: receipt.client.id,
                                    receiptNumber: receipt.receiptNumber,
                                    paymentDate: new Date(receipt.paymentDate),
                                    paymentMethod: receipt.paymentMethod,
                                    relatedInvoiceNumber: receipt.relatedInvoiceNumber,
                                    subtotal: receipt.subtotal,
                                    taxRate: receipt.taxRate,
                                    taxAmount: receipt.taxAmount,
                                    discount: receipt.discount,
                                    discountType: receipt.discountType,
                                    total: receipt.total,
                                    amountPaid: receipt.amountPaid,
                                    notes: receipt.notes,
                                    currency: receipt.currency,
                                    token: receipt.token,
                                    createdAt: new Date(receipt.createdAt),
                                },
                            })

                            // Delete old items and create new ones
                            await tx.invoiceItem.deleteMany({
                                where: { receiptId: receipt.id },
                            })

                            if (receipt.items && receipt.items.length > 0) {
                                const uniqueItems = deduplicateById<InvoiceItem>(receipt.items)
                                await tx.invoiceItem.createMany({
                                    data: uniqueItems.map((item) => ({
                                        id: item.id,
                                        receiptId: receipt.id,
                                        description: item.description,
                                        quantity: item.quantity,
                                        rate: item.rate,
                                        amount: item.amount,
                                    })),
                                    skipDuplicates: true,
                                })
                            }
                        }),
                    )
                }

                // 6. Sync Contracts
                if (data.contracts && Array.isArray(data.contracts)) {
                    const uniqueContracts = deduplicateById<Contract>(data.contracts)
                    await Promise.all(
                        uniqueContracts.map((contract) =>
                            tx.contract.upsert({
                                where: { id: contract.id },
                                update: {
                                    contractNumber: contract.contractNumber,
                                    templateType: contract.templateType,
                                    templateName: contract.templateName,
                                    projectName: contract.projectName,
                                    projectScope: contract.projectScope,
                                    deliverables: contract.deliverables,
                                    startDate: new Date(contract.startDate),
                                    endDate: new Date(contract.endDate),
                                    signatureDate: new Date(contract.signatureDate),
                                    projectFee: contract.projectFee,
                                    paymentTerms: contract.paymentTerms,
                                    currency: contract.currency,
                                    clientSignature: contract.clientSignature,
                                    clientSignatureType: contract.clientSignatureType,
                                    businessSignature: contract.businessSignature,
                                    businessSignatureType: contract.businessSignatureType,
                                    status: contract.status,
                                    generatedContent: contract.generatedContent,
                                    notes: contract.notes,
                                    updatedAt: new Date(),
                                },
                                create: {
                                    id: contract.id,
                                    userId,
                                    clientId: contract.client.id,
                                    contractNumber: contract.contractNumber,
                                    templateType: contract.templateType,
                                    templateName: contract.templateName,
                                    projectName: contract.projectName,
                                    projectScope: contract.projectScope,
                                    deliverables: contract.deliverables,
                                    startDate: new Date(contract.startDate),
                                    endDate: new Date(contract.endDate),
                                    signatureDate: new Date(contract.signatureDate),
                                    projectFee: contract.projectFee,
                                    paymentTerms: contract.paymentTerms,
                                    currency: contract.currency,
                                    clientSignature: contract.clientSignature,
                                    clientSignatureType: contract.clientSignatureType,
                                    businessSignature: contract.businessSignature,
                                    businessSignatureType: contract.businessSignatureType,
                                    status: contract.status,
                                    generatedContent: contract.generatedContent,
                                    notes: contract.notes,
                                    createdAt: new Date(contract.createdAt),
                                },
                            }),
                        ),
                    )
                }

                // 7. Sync Time Entries
                if (data.timeEntries && Array.isArray(data.timeEntries)) {
                    const uniqueTimeEntries = deduplicateById<TimeEntry>(data.timeEntries)
                    await Promise.all(
                        uniqueTimeEntries.map((timeEntry) =>
                            tx.timeEntry.upsert({
                                where: { id: timeEntry.id },
                                update: {
                                    clientId: timeEntry.clientId,
                                    projectName: timeEntry.projectName,
                                    description: timeEntry.description,
                                    date: new Date(timeEntry.date),
                                    startTime: timeEntry.startTime,
                                    endTime: timeEntry.endTime,
                                    duration: timeEntry.duration,
                                    hourlyRate: timeEntry.hourlyRate,
                                    amount: timeEntry.amount,
                                    billable: timeEntry.billable,
                                    invoiced: timeEntry.invoiced,
                                    invoiceId: timeEntry.invoiceId,
                                    tags: timeEntry.tags || [],
                                    updatedAt: new Date(),
                                },
                                create: {
                                    id: timeEntry.id,
                                    userId,
                                    clientId: timeEntry.clientId,
                                    projectName: timeEntry.projectName,
                                    description: timeEntry.description,
                                    date: new Date(timeEntry.date),
                                    startTime: timeEntry.startTime,
                                    endTime: timeEntry.endTime,
                                    duration: timeEntry.duration,
                                    hourlyRate: timeEntry.hourlyRate,
                                    amount: timeEntry.amount,
                                    billable: timeEntry.billable ?? true,
                                    invoiced: timeEntry.invoiced ?? false,
                                    invoiceId: timeEntry.invoiceId,
                                    tags: timeEntry.tags || [],
                                    createdAt: new Date(timeEntry.createdAt),
                                },
                            }),
                        ),
                    )
                }
            },
            {
                maxWait: 10000, // 10 seconds max wait
                timeout: 15000, // 15 seconds timeout
            },
        )

        // 8. Sync Resumes OUTSIDE transaction to avoid timeout
        if (data.resumes && Array.isArray(data.resumes)) {
            await syncResumes(userId, data.resumes)
        }

        return NextResponse.json({
            success: true,
            message: "Data synced successfully",
        })
    } catch (error) {
        console.error("Sync upload error:", error)
        return NextResponse.json(
            { error: "Sync failed", details: (error as Error).message },
            { status: 500 },
        )
    }
}

// Sync resumes separately with batching
async function syncResumes(userId: string, resumes: any[]) {
    const batchSize = 10; // Increased batch size for better performance

    for (let i = 0; i < resumes.length; i += batchSize) {
        const batch = resumes.slice(i, i + batchSize);

        await Promise.all(
            batch.map(async (resume) => {
                // Upsert resume
                await prisma.resume.upsert({
                    where: { id: resume.id },
                    update: {
                        name: resume.name,
                        template: resume.template,
                        personal: resume.personal,
                        summary: resume.summary,
                        updatedAt: new Date(),
                    },
                    create: {
                        id: resume.id,
                        userId,
                        name: resume.name,
                        template: resume.template,
                        personal: resume.personal,
                        summary: resume.summary,
                        createdAt: new Date(resume.createdAt),
                    },
                });

                // Delete existing related records in parallel
                await Promise.all([
                    prisma.resumeExperience.deleteMany({ where: { resumeId: resume.id } }),
                    prisma.resumeEducation.deleteMany({ where: { resumeId: resume.id } }),
                    prisma.resumeSkill.deleteMany({ where: { resumeId: resume.id } }),
                    prisma.resumeProject.deleteMany({ where: { resumeId: resume.id } }),
                    prisma.resumeCertification.deleteMany({ where: { resumeId: resume.id } }),
                    prisma.resumeLanguage.deleteMany({ where: { resumeId: resume.id } }),
                    prisma.resumeCustomSection.deleteMany({ where: { resumeId: resume.id } }),
                    prisma.resumeSection.deleteMany({ where: { resumeId: resume.id } }),
                ]);

                // Create new records using createMany for better performance
                if (resume.experience?.length > 0) {
                    await prisma.resumeExperience.createMany({
                        data: resume.experience.map((exp: any, index: number) => ({
                            id: exp.id,
                            resumeId: resume.id,
                            company: exp.company,
                            position: exp.position,
                            location: exp.location,
                            startDate: exp.startDate,
                            endDate: exp.endDate,
                            current: exp.current,
                            description: exp.description,
                            highlights: exp.highlights,
                            order: index,
                        })),
                        skipDuplicates: true,
                    });
                }

                if (resume.education?.length > 0) {
                    await prisma.resumeEducation.createMany({
                        data: resume.education.map((edu: any, index: number) => ({
                            id: edu.id,
                            resumeId: resume.id,
                            institution: edu.institution,
                            degree: edu.degree,
                            field: edu.field,
                            location: edu.location,
                            startDate: edu.startDate,
                            endDate: edu.endDate,
                            current: edu.current,
                            gpa: edu.gpa,
                            description: edu.description,
                            order: index,
                        })),
                        skipDuplicates: true,
                    });
                }

                if (resume.skills?.length > 0) {
                    await prisma.resumeSkill.createMany({
                        data: resume.skills.map((skill: any) => ({
                            id: skill.id,
                            resumeId: resume.id,
                            name: skill.name,
                            category: skill.category,
                            level: skill.level,
                        })),
                        skipDuplicates: true,
                    });
                }

                if (resume.projects?.length > 0) {
                    await prisma.resumeProject.createMany({
                        data: resume.projects.map((project: any, index: number) => ({
                            id: project.id,
                            resumeId: resume.id,
                            name: project.name,
                            description: project.description,
                            technologies: project.technologies,
                            startDate: project.startDate,
                            endDate: project.endDate,
                            current: project.current,
                            url: project.url,
                            highlights: project.highlights,
                            order: index,
                        })),
                        skipDuplicates: true,
                    });
                }

                if (resume.certifications?.length > 0) {
                    await prisma.resumeCertification.createMany({
                        data: resume.certifications.map((cert: any) => ({
                            id: cert.id,
                            resumeId: resume.id,
                            name: cert.name,
                            issuer: cert.issuer,
                            issueDate: cert.issueDate,
                            expiryDate: cert.expiryDate,
                            credentialId: cert.credentialId,
                            url: cert.url,
                        })),
                        skipDuplicates: true,
                    });
                }

                if (resume.languages?.length > 0) {
                    await prisma.resumeLanguage.createMany({
                        data: resume.languages.map((lang: any) => ({
                            id: lang.id,
                            resumeId: resume.id,
                            name: lang.name,
                            proficiency: lang.proficiency,
                        })),
                        skipDuplicates: true,
                    });
                }

                if (resume.customSections?.length > 0) {
                    await prisma.resumeCustomSection.createMany({
                        data: resume.customSections.map((section: any) => ({
                            id: section.id,
                            resumeId: resume.id,
                            title: section.title,
                            content: section.content || "",
                            items: section.items,
                        })),
                        skipDuplicates: true,
                    });
                }

                if (resume.sections?.length > 0) {
                    await prisma.resumeSection.createMany({
                        data: resume.sections.map((section: any) => ({
                            id: section.id,
                            resumeId: resume.id,
                            type: section.type,
                            title: section.title,
                            visible: section.visible,
                            order: section.order,
                        })),
                        skipDuplicates: true,
                    });
                }

                // Sync style
                if (resume.style) {
                    await prisma.resumeStyle.upsert({
                        where: { resumeId: resume.id },
                        update: {
                            template: resume.style.template,
                            primaryColor: resume.style.primaryColor,
                            fontFamily: resume.style.fontFamily,
                            fontSize: resume.style.fontSize,
                            spacing: resume.style.spacing,
                            showPhoto: resume.style.showPhoto,
                            showIcons: resume.style.showIcons,
                        },
                        create: {
                            resumeId: resume.id,
                            template: resume.style.template,
                            primaryColor: resume.style.primaryColor,
                            fontFamily: resume.style.fontFamily,
                            fontSize: resume.style.fontSize,
                            spacing: resume.style.spacing,
                            showPhoto: resume.style.showPhoto,
                            showIcons: resume.style.showIcons,
                        },
                    });
                }
            })
        );
    }
}

// Helper function to deduplicate items by ID
function deduplicateById<T extends { id: string }>(items: T[]): T[] {
    const map = new Map<string, T>()
    items.forEach((item) => map.set(item.id, item))
    return Array.from(map.values())
}
