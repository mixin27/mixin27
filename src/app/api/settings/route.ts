import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"

// GET /api/settings - Get invoice settings
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    const settings = await prisma.invoiceSettings.findUnique({
      where: { userId },
    })

    if (!settings) {
      // Return default settings if none exist
      return NextResponse.json({
        businessName: "",
        businessEmail: "",
        businessPhone: "",
        businessAddress: "",
        businessCity: "",
        businessState: "",
        businessZipCode: "",
        businessCountry: "",
        taxId: "",
        logo: "",
        defaultCurrency: "USD",
        defaultTaxRate: 0,
        defaultPaymentTerms: "Net 30",
        invoicePrefix: "INV-",
        nextInvoiceNumber: 1,
      })
    }

    // Transform to match frontend InvoiceSettings interface
    return NextResponse.json({
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
    })
  } catch (error) {
    console.error("Error fetching settings:", error)
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 },
    )
  }
}

// POST /api/settings - Create or update invoice settings
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    const settings = await request.json()

    await prisma.invoiceSettings.upsert({
      where: { userId },
      update: {
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
        defaultTaxRate: settings.defaultTaxRate,
        defaultPaymentTerms: settings.defaultPaymentTerms,
        invoicePrefix: settings.invoicePrefix,
        nextInvoiceNumber: settings.nextInvoiceNumber,
      },
      create: {
        userId,
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
        defaultCurrency: settings.defaultCurrency || "USD",
        defaultTaxRate: settings.defaultTaxRate || 0,
        defaultPaymentTerms: settings.defaultPaymentTerms || "Net 30",
        invoicePrefix: settings.invoicePrefix || "INV-",
        nextInvoiceNumber: settings.nextInvoiceNumber || 1,
      },
    })

    return NextResponse.json({ success: true, settings })
  } catch (error) {
    console.error("Error saving settings:", error)
    return NextResponse.json(
      { error: "Failed to save settings" },
      { status: 500 },
    )
  }
}

