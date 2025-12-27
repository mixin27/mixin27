import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"

// GET /api/receipts - Get all receipts
// GET /api/receipts?id=xxx - Get single receipt
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
      const receipt = await prisma.receipt.findUnique({
        where: { id },
        include: { client: true, items: true },
      })

      if (!receipt) {
        return NextResponse.json(
          { error: "Receipt not found" },
          { status: 404 },
        )
      }

      // Transform to match frontend Receipt interface
      return NextResponse.json({
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
        createdAt: receipt.createdAt.toISOString(),
        updatedAt: receipt.updatedAt.toISOString(),
      })
    }

    const receipts = await prisma.receipt.findMany({
      where: { userId },
      include: { client: true, items: true },
      orderBy: { createdAt: "desc" },
    })

    // Transform to match frontend Receipt interface
    return NextResponse.json(
      receipts.map((receipt: any) => ({
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
        createdAt: receipt.createdAt.toISOString(),
        updatedAt: receipt.updatedAt.toISOString(),
      })),
    )
  } catch (error) {
    console.error("Error fetching receipts:", error)
    return NextResponse.json(
      { error: "Failed to fetch receipts" },
      { status: 500 },
    )
  }
}

// POST /api/receipts - Create or update receipt
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    const receipt = await request.json()

    // Validate required fields
    if (
      !receipt.id ||
      !receipt.receiptNumber ||
      !receipt.client ||
      !receipt.paymentMethod
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      )
    }

    await prisma.$transaction(async (tx) => {
      await tx.receipt.upsert({
        where: { userId, id: receipt.id },
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
          createdAt: new Date(receipt.createdAt),
        },
      })

      // Delete old items and create new ones
      await tx.invoiceItem.deleteMany({
        where: { receiptId: receipt.id },
      })

      if (receipt.items && receipt.items.length > 0) {
        await tx.invoiceItem.createMany({
          data: receipt.items.map((item: any) => ({
            id: item.id,
            receiptId: receipt.id,
            description: item.description,
            quantity: item.quantity,
            rate: item.rate,
            amount: item.amount,
          })),
        })
      }
    })

    return NextResponse.json({ success: true, receipt })
  } catch (error) {
    console.error("Error saving receipt:", error)
    return NextResponse.json(
      { error: "Failed to save receipt" },
      { status: 500 },
    )
  }
}

// DELETE /api/receipts?id=xxx - Delete receipt
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
        { error: "Receipt ID required" },
        { status: 400 },
      )
    }

    await prisma.receipt.delete({
      where: { userId, id },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting receipt:", error)
    return NextResponse.json(
      { error: "Failed to delete receipt" },
      { status: 500 },
    )
  }
}

