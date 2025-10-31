import { NextRequest, NextResponse } from "next/server"
import {
  dbSaveInvoice,
  dbGetInvoices,
  dbGetInvoiceById,
  dbDeleteInvoice,
} from "@/lib/db"

// GET /api/invoices - Get all invoices
// GET /api/invoices?id=xxx - Get single invoice
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get("id")

    if (id) {
      const invoice = await dbGetInvoiceById(id)
      if (!invoice) {
        return NextResponse.json(
          { error: "Invoice not found" },
          { status: 404 },
        )
      }
      return NextResponse.json(invoice)
    }

    const invoices = await dbGetInvoices()
    return NextResponse.json(invoices)
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
    const invoice = await request.json()

    // Validate required fields
    if (!invoice.id || !invoice.invoiceNumber || !invoice.client) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      )
    }

    await dbSaveInvoice(invoice)
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
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { error: "Invoice ID required" },
        { status: 400 },
      )
    }

    await dbDeleteInvoice(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting invoice:", error)
    return NextResponse.json(
      { error: "Failed to delete invoice" },
      { status: 500 },
    )
  }
}
