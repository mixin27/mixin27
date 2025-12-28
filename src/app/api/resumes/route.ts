import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"

// GET /api/resumes - Get all resumes
// GET /api/resumes?id=xxx - Get single resume
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get("id")

    if (id) {
      const resume = await prisma.resume.findFirst({
        where: { id, userId },
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
      })

      if (!resume) {
        return NextResponse.json({ error: "Resume not found" }, { status: 404 })
      }

      // Transform to match frontend Resume interface
      return NextResponse.json({
        id: resume.id,
        name: resume.name,
        template: resume.template,
        personal: resume.personal as Record<string, any>,
        summary: resume.summary,
        experience: Array.isArray((resume as any).experiences)
          ? (resume as any).experiences.map((exp: any) => ({
              id: exp.id,
              company: exp.company,
              position: exp.position,
              location: exp.location,
              startDate: exp.startDate,
              endDate: exp.endDate,
              current: exp.current,
              description: exp.description,
              highlights: exp.highlights,
            }))
          : [],
        education: Array.isArray((resume as any).education)
          ? (resume as any).educations.map((edu: any) => ({
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
            }))
          : [],
        skills: Array.isArray((resume as any).skills)
          ? (resume as any).skills.map((skill: any) => ({
              id: skill.id,
              name: skill.name,
              category: skill.category,
              level: skill.level,
            }))
          : [],
        projects: Array.isArray((resume as any).projects)
          ? (resume as any).projects.map((project: any) => ({
              id: project.id,
              name: project.name,
              description: project.description,
              technologies: project.technologies,
              startDate: project.startDate,
              endDate: project.endDate,
              current: project.current,
              url: project.url,
              highlights: project.highlights,
            }))
          : [],
        certifications: Array.isArray((resume as any).certifications)
          ? (resume as any).certifications.map((cert: any) => ({
              id: cert.id,
              name: cert.name,
              issuer: cert.issuer,
              issueDate: cert.issueDate,
              expiryDate: cert.expiryDate,
              credentialId: cert.credentialId,
              url: cert.url,
            }))
          : [],
        languages: (resume as any).languages.map((lang: any) => ({
          id: lang.id,
          name: lang.name,
          proficiency: lang.proficiency,
        })),
        customSections: (resume as any).customSections.map((section: any) => ({
          id: section.id,
          title: section.title,
          content: section.content,
          items: section.items as any,
        })),
        sections: (resume as any).sections.map((section: any) => ({
          id: section.id,
          type: section.type,
          title: section.title,
          visible: section.visible,
          order: section.order,
        })),
        style: (resume as any).style
          ? {
              template: (resume as any).style.template,
              primaryColor: (resume as any).style.primaryColor,
              fontFamily: (resume as any).style.fontFamily,
              fontSize: (resume as any).style.fontSize,
              spacing: (resume as any).style.spacing,
              showPhoto: (resume as any).style.showPhoto,
              showIcons: (resume as any).style.showIcons,
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
      })
    }

    const resumes = await prisma.resume.findMany({
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
      orderBy: { createdAt: "desc" },
    })

    // Transform to match frontend Resume interface
    return NextResponse.json(
      resumes.map((resume) => ({
        id: resume.id,
        name: resume.name,
        template: resume.template,
        personal: resume.personal as any,
        summary: resume.summary,
        experience: (resume as any).experiences.map((exp: any) => ({
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
        education: (resume as any).educations.map((edu: any) => ({
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
        skills: (resume as any).skills.map((skill: any) => ({
          id: skill.id,
          name: skill.name,
          category: skill.category,
          level: skill.level,
        })),
        projects: (resume as any).projects.map((project: any) => ({
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
        certifications: (resume as any).certifications.map((cert: any) => ({
          id: cert.id,
          name: cert.name,
          issuer: cert.issuer,
          issueDate: cert.issueDate,
          expiryDate: cert.expiryDate,
          credentialId: cert.credentialId,
          url: cert.url,
        })),
        languages: (resume as any).languages.map((lang: any) => ({
          id: lang.id,
          name: lang.name,
          proficiency: lang.proficiency,
        })),
        customSections: (resume as any).customSections.map((section: any) => ({
          id: section.id,
          title: section.title,
          content: section.content,
          items: section.items as any,
        })),
        sections: (resume as any).sections.map((section: any) => ({
          id: section.id,
          type: section.type,
          title: section.title,
          visible: section.visible,
          order: section.order,
        })),
        style: (resume as any).style
          ? {
              template: (resume as any).style.template,
              primaryColor: (resume as any).style.primaryColor,
              fontFamily: (resume as any).style.fontFamily,
              fontSize: (resume as any).style.fontSize,
              spacing: (resume as any).style.spacing,
              showPhoto: (resume as any).style.showPhoto,
              showIcons: (resume as any).style.showIcons,
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
      })),
    )
  } catch (error) {
    console.error("Error fetching resumes:", error)
    return NextResponse.json(
      { error: "Failed to fetch resumes" },
      { status: 500 },
    )
  }
}

// POST /api/resumes - Create or update resume
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    const resume = await request.json()

    // Validate required fields
    if (!resume.id || !resume.name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      )
    }

    await prisma.$transaction(
      async (tx) => {
        // Upsert main resume
        await tx.resume.upsert({
          where: { userId, id: resume.id },
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

        // Upsert style
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

        // Delete old related data and create new ones
        await Promise.all([
          tx.resumeExperience.deleteMany({ where: { resumeId: resume.id } }),
          tx.resumeEducation.deleteMany({ where: { resumeId: resume.id } }),
          tx.resumeSkill.deleteMany({ where: { resumeId: resume.id } }),
          tx.resumeProject.deleteMany({ where: { resumeId: resume.id } }),
          tx.resumeCertification.deleteMany({ where: { resumeId: resume.id } }),
          tx.resumeLanguage.deleteMany({ where: { resumeId: resume.id } }),
          tx.resumeCustomSection.deleteMany({ where: { resumeId: resume.id } }),
          tx.resumeSection.deleteMany({ where: { resumeId: resume.id } }),
        ])

        // Create experiences
        if (resume.experience && resume.experience.length > 0) {
          await tx.resumeExperience.createMany({
            data: resume.experience.map((exp: any, index: number) => ({
              id: exp.id,
              resumeId: resume.id,
              company: exp.company,
              position: exp.position,
              location: exp.location,
              startDate: exp.startDate,
              endDate: exp.endDate,
              current: exp.current || false,
              description: exp.description || "",
              highlights: exp.highlights || [],
              order: index,
            })),
          })
        }

        // Create educations
        if (resume.education && resume.education.length > 0) {
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
              current: edu.current || false,
              gpa: edu.gpa,
              description: edu.description,
              order: index,
            })),
          })
        }

        // Create skills
        if (resume.skills && resume.skills.length > 0) {
          await tx.resumeSkill.createMany({
            data: resume.skills.map((skill: any) => ({
              id: skill.id,
              resumeId: resume.id,
              name: skill.name,
              category: skill.category,
              level: skill.level,
            })),
          })
        }

        // Create projects
        if (resume.projects && resume.projects.length > 0) {
          await tx.resumeProject.createMany({
            data: resume.projects.map((project: any, index: number) => ({
              id: project.id,
              resumeId: resume.id,
              name: project.name,
              description: project.description || "",
              technologies: project.technologies || [],
              startDate: project.startDate,
              endDate: project.endDate,
              current: project.current || false,
              url: project.url,
              highlights: project.highlights || [],
              order: index,
            })),
          })
        }

        // Create certifications
        if (resume.certifications && resume.certifications.length > 0) {
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
          })
        }

        // Create languages
        if (resume.languages && resume.languages.length > 0) {
          await tx.resumeLanguage.createMany({
            data: resume.languages.map((lang: any) => ({
              id: lang.id,
              resumeId: resume.id,
              name: lang.name,
              proficiency: lang.proficiency,
            })),
          })
        }

        // Create custom sections
        if (resume.customSections && resume.customSections.length > 0) {
          await tx.resumeCustomSection.createMany({
            data: resume.customSections.map((section: any) => ({
              id: section.id,
              resumeId: resume.id,
              title: section.title,
              content: section.content || "",
              items: section.items,
            })),
          })
        }

        // Create sections
        if (resume.sections && resume.sections.length > 0) {
          await tx.resumeSection.createMany({
            data: resume.sections.map((section: any) => ({
              id: section.id,
              resumeId: resume.id,
              type: section.type,
              title: section.title,
              visible: section.visible !== undefined ? section.visible : true,
              order: section.order,
            })),
          })
        }
      },
      {
        maxWait: 10000,
        timeout: 15000,
      },
    )

    return NextResponse.json({ success: true, resume })
  } catch (error) {
    console.error("Error saving resume:", error)
    return NextResponse.json(
      { error: "Failed to save resume" },
      { status: 500 },
    )
  }
}

// DELETE /api/resumes?id=xxx - Delete resume
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Resume ID required" }, { status: 400 })
    }

    await prisma.resume.delete({
      where: { userId, id },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting resume:", error)
    return NextResponse.json(
      { error: "Failed to delete resume" },
      { status: 500 },
    )
  }
}
