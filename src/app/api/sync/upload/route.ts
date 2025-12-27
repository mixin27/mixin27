import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { Client, Invoice, InvoiceItem } from "@/types/invoice"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const data = await request.json()

    // Increase transaction timeout and use maxWait
    await prisma.$transaction(
      async (tx) => {
        // 1. Sync Clients
        if (data.clients && Array.isArray(data.clients)) {
          // Batch upsert for better performance
          await Promise.all(
            data.clients.map((client: Client) =>
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
          await Promise.all(
            data.invoices.map(async (invoice: Invoice) => {
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
                  createdAt: new Date(invoice.createdAt),
                },
              })

              // Delete old items and create new ones
              await tx.invoiceItem.deleteMany({
                where: { invoiceId: invoice.id },
              })

              if (invoice.items && invoice.items.length > 0) {
                await tx.invoiceItem.createMany({
                  data: invoice.items.map((item: InvoiceItem) => ({
                    id: item.id,
                    invoiceId: invoice.id,
                    description: item.description,
                    quantity: item.quantity,
                    rate: item.rate,
                    amount: item.amount,
                  })),
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
      },
      {
        maxWait: 10000, // 10 seconds max wait
        timeout: 15000, // 15 seconds timeout
      },
    )

    // 4. Sync Resumes OUTSIDE transaction to avoid timeout
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
  // Process resumes in smaller batches to avoid timeouts
  const batchSize = 3

  for (let i = 0; i < resumes.length; i += batchSize) {
    const batch = resumes.slice(i, i + batchSize)

    await Promise.all(
      batch.map(async (resume) => {
        // Each resume in its own transaction
        await prisma.$transaction(
          async (tx) => {
            // Upsert resume
            await tx.resume.upsert({
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
            })

            // Delete existing related records in parallel
            await Promise.all([
              tx.resumeExperience.deleteMany({
                where: { resumeId: resume.id },
              }),
              tx.resumeEducation.deleteMany({ where: { resumeId: resume.id } }),
              tx.resumeSkill.deleteMany({ where: { resumeId: resume.id } }),
              tx.resumeProject.deleteMany({ where: { resumeId: resume.id } }),
              tx.resumeCertification.deleteMany({
                where: { resumeId: resume.id },
              }),
              tx.resumeLanguage.deleteMany({ where: { resumeId: resume.id } }),
              tx.resumeSection.deleteMany({ where: { resumeId: resume.id } }),
            ])

            // Create new records using createMany for better performance
            // Skip if arrays are empty to avoid errors
            if (resume.experience?.length > 0) {
              await tx.resumeExperience.createMany({
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
                skipDuplicates: true, // Skip if ID already exists
              })
            }

            if (resume.education?.length > 0) {
              await tx.resumeEducation.createMany({
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
              })
            }

            if (resume.skills?.length > 0) {
              await tx.resumeSkill.createMany({
                data: resume.skills.map((skill: any) => ({
                  id: skill.id,
                  resumeId: resume.id,
                  name: skill.name,
                  category: skill.category,
                  level: skill.level,
                })),
                skipDuplicates: true,
              })
            }

            if (resume.projects?.length > 0) {
              await tx.resumeProject.createMany({
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
              })
            }

            if (resume.certifications?.length > 0) {
              await tx.resumeCertification.createMany({
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
              })
            }

            if (resume.languages?.length > 0) {
              await tx.resumeLanguage.createMany({
                data: resume.languages.map((lang: any) => ({
                  id: lang.id,
                  resumeId: resume.id,
                  name: lang.name,
                  proficiency: lang.proficiency,
                })),
                skipDuplicates: true,
              })
            }

            if (resume.sections?.length > 0) {
              await tx.resumeSection.createMany({
                data: resume.sections.map((section: any) => ({
                  id: section.id,
                  resumeId: resume.id,
                  type: section.type,
                  title: section.title,
                  visible: section.visible,
                  order: section.order,
                })),
                skipDuplicates: true,
              })
            }

            // Sync style
            if (resume.style) {
              await tx.resumeStyle.upsert({
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
              })
            }
          },
          {
            maxWait: 8000,
            timeout: 10000,
          },
        )
      }),
    )
  }
}
