import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"
import { InvoiceItem } from "@/types/invoice"

// GET /api/invoices - Get all invoices
// GET /api/invoices?id=xxx - Get single invoice
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
      const invoice = await prisma.invoice.findFirst({
        where: { id, userId },
        include: { client: true, items: true },
      })

      if (!invoice) {
        return NextResponse.json(
          { error: "Invoice not found" },
          { status: 404 },
        )
      }

      // Transform to match frontend Invoice interface
      return NextResponse.json({
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
      })
    }

    const invoices = await prisma.invoice.findMany({
      where: { userId },
      include: { client: true, items: true },
      orderBy: { createdAt: "desc" },
    })

    // Transform to match frontend Invoice interface
    return NextResponse.json(
      invoices.map((invoice: any) => ({
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
      })),
    )
  } catch (error) {
    console.error("Error fetching invoices:", error)
    return NextResponse.json(
      { error: "Failed to fetch invoices" },
      { status: 500 },
    )
  }
}

// POST /api/invoices - Create or update invoice
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    const invoice = await request.json()

    // Validate required fields
    if (!invoice.id || !invoice.invoiceNumber || !invoice.client) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      )
    }

    await prisma.$transaction(async (tx) => {
      await tx.invoice.upsert({
        where: { userId, id: invoice.id },
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
    })
    return NextResponse.json({ success: true, invoice })
  } catch (error) {
    console.error("Error saving invoice:", error)
    return NextResponse.json(
      { error: "Failed to save invoice" },
      { status: 500 },
    )
  }
}

// DELETE /api/invoices?id=xxx - Delete invoice
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
        { error: "Invoice ID required" },
        { status: 400 },
      )
    }

    await prisma.invoice.delete({
      where: { userId, id }
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting invoice:", error)
    return NextResponse.json(
      { error: "Failed to delete invoice" },
      { status: 500 },
    )
  }
}
