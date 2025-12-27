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
          sections: { orderBy: { order: "asc" } },
          style: true,
        },
      }) as any,
      prisma.invoiceSettings.findUnique({
        where: { userId },
      }),
      prisma.quotation.findMany({
        where: { userId },
      }),
      prisma.receipt.findMany({
        where: { userId },
      }),
      prisma.contract.findMany({
        where: { userId },
      }),
      prisma.timeEntry.findMany({
        where: { userId },
      }),
    ])

    // Transform resumes to match localStorage format
    const transformedResumes = resumes.map((resume: any) => ({
      id: resume.id,
      name: resume.name,
      template: resume.template,
      personal: resume.personal,
      summary: resume.summary,
      experience: resume.experiences,
      education: resume.educations,
      skills: resume.skills,
      projects: resume.projects,
      certifications: resume.certifications,
      languages: resume.languages,
      sections: resume.sections,
      style: resume.style || {},
      createdAt: resume.createdAt.toISOString(),
      updatedAt: resume.updatedAt.toISOString(),
    }))

    return NextResponse.json({
      clients,
      invoices,
      resumes: transformedResumes,
      settings,
      quotations: quotations,
      receipts: receipts,
      contracts: contracts,
      timeEntries: timeEntries,
    })
  } catch (error) {
    console.error("Sync download error:", error)
    return NextResponse.json(
      { error: "Download failed", details: (error as Error).message },
      { status: 500 },
    )
  }
}
