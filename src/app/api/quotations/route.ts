import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"

// GET /api/quotations - Get all quotations
// GET /api/quotations?id=xxx - Get single quotation
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
      const quotation = await prisma.quotation.findUnique({
        where: { id },
        include: { client: true, items: true },
      })

      if (!quotation) {
        return NextResponse.json(
          { error: "Quotation not found" },
          { status: 404 },
        )
      }

      // Transform to match frontend Quotation interface
      return NextResponse.json({
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
        items: quotation.items.map((item) => ({
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
      })
    }

    const quotations = await prisma.quotation.findMany({
      where: { userId },
      include: { client: true, items: true },
      orderBy: { createdAt: "desc" },
    })

    // Transform to match frontend Quotation interface
    return NextResponse.json(
      quotations.map((quotation: any) => ({
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
      })),
    )
  } catch (error) {
    console.error("Error fetching quotations:", error)
    return NextResponse.json(
      { error: "Failed to fetch quotations" },
      { status: 500 },
    )
  }
}

// POST /api/quotations - Create or update quotation
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    const quotation = await request.json()

    // Validate required fields
    if (
      !quotation.id ||
      !quotation.invoiceNumber ||
      !quotation.client ||
      !quotation.validUntil
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      )
    }

    await prisma.$transaction(async (tx) => {
      await tx.quotation.upsert({
        where: { userId, id: quotation.id },
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
          createdAt: new Date(quotation.createdAt),
        },
      })

      // Delete old items and create new ones
      await tx.invoiceItem.deleteMany({
        where: { quotationId: quotation.id },
      })

      if (quotation.items && quotation.items.length > 0) {
        await tx.invoiceItem.createMany({
          data: quotation.items.map((item: any) => ({
            id: item.id,
            quotationId: quotation.id,
            description: item.description,
            quantity: item.quantity,
            rate: item.rate,
            amount: item.amount,
          })),
        })
      }
    })

    return NextResponse.json({ success: true, quotation })
  } catch (error) {
    console.error("Error saving quotation:", error)
    return NextResponse.json(
      { error: "Failed to save quotation" },
      { status: 500 },
    )
  }
}

// DELETE /api/quotations?id=xxx - Delete quotation
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
        { error: "Quotation ID required" },
        { status: 400 },
      )
    }

    await prisma.quotation.delete({
      where: { userId, id },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting quotation:", error)
    return NextResponse.json(
      { error: "Failed to delete quotation" },
      { status: 500 },
    )
  }
}

