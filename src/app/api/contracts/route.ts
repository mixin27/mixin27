import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"

// GET /api/contracts - Get all contracts
// GET /api/contracts?id=xxx - Get single contract
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
      const contract = await prisma.contract.findUnique({
        where: { id },
        include: { client: true },
      })

      if (!contract) {
        return NextResponse.json(
          { error: "Contract not found" },
          { status: 404 },
        )
      }

      // Transform to match frontend Contract interface
      return NextResponse.json({
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
      })
    }

    const contracts = await prisma.contract.findMany({
      where: { userId },
      include: { client: true },
      orderBy: { createdAt: "desc" },
    })

    // Transform to match frontend Contract interface
    return NextResponse.json(
      contracts.map((contract: any) => ({
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
      })),
    )
  } catch (error) {
    console.error("Error fetching contracts:", error)
    return NextResponse.json(
      { error: "Failed to fetch contracts" },
      { status: 500 },
    )
  }
}

// POST /api/contracts - Create or update contract
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    const contract = await request.json()

    // Validate required fields
    if (
      !contract.id ||
      !contract.contractNumber ||
      !contract.client ||
      !contract.templateType
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      )
    }

    await prisma.contract.upsert({
      where: { userId, id: contract.id },
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
    })
    return NextResponse.json({ success: true, contract })
  } catch (error) {
    console.error("Error saving contract:", error)
    return NextResponse.json(
      { error: "Failed to save contract" },
      { status: 500 },
    )
  }
}

// DELETE /api/contracts?id=xxx - Delete contract
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
      return NextResponse.json(
        { error: "Contract ID required" },
        { status: 400 },
      )
    }

    await prisma.contract.delete({
      where: { userId, id },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting contract:", error)
    return NextResponse.json(
      { error: "Failed to delete contract" },
      { status: 500 },
    )
  }
}

