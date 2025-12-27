import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"

// GET /api/time-entries - Get all time entries
// GET /api/time-entries?id=xxx - Get single time entry
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
      const timeEntry = await prisma.timeEntry.findUnique({
        where: { id },
        include: { client: true },
      })

      if (!timeEntry) {
        return NextResponse.json(
          { error: "Time entry not found" },
          { status: 404 },
        )
      }

      // Transform to match frontend TimeEntry interface
      return NextResponse.json({
        id: timeEntry.id,
        clientId: timeEntry.clientId,
        client: {
          id: timeEntry.client.id,
          name: timeEntry.client.name,
          email: timeEntry.client.email,
          phone: timeEntry.client.phone,
          address: timeEntry.client.address,
          city: timeEntry.client.city,
          state: timeEntry.client.state,
          zipCode: timeEntry.client.zipCode,
          country: timeEntry.client.country,
          taxId: timeEntry.client.taxId,
          createdAt: timeEntry.client.createdAt.toISOString(),
        },
        projectName: timeEntry.projectName,
        description: timeEntry.description,
        date: timeEntry.date.toISOString(),
        startTime: timeEntry.startTime,
        endTime: timeEntry.endTime,
        duration: timeEntry.duration,
        hourlyRate: Number(timeEntry.hourlyRate),
        amount: Number(timeEntry.amount),
        billable: timeEntry.billable,
        invoiced: timeEntry.invoiced,
        invoiceId: timeEntry.invoiceId,
        tags: timeEntry.tags,
        createdAt: timeEntry.createdAt.toISOString(),
        updatedAt: timeEntry.updatedAt.toISOString(),
      })
    }

    const timeEntries = await prisma.timeEntry.findMany({
      where: { userId },
      include: { client: true },
      orderBy: { date: "desc" },
    })

    // Transform to match frontend TimeEntry interface
    return NextResponse.json(
      timeEntries.map((timeEntry: any) => ({
        id: timeEntry.id,
        clientId: timeEntry.clientId,
        client: {
          id: timeEntry.client.id,
          name: timeEntry.client.name,
          email: timeEntry.client.email,
          phone: timeEntry.client.phone,
          address: timeEntry.client.address,
          city: timeEntry.client.city,
          state: timeEntry.client.state,
          zipCode: timeEntry.client.zipCode,
          country: timeEntry.client.country,
          taxId: timeEntry.client.taxId,
          createdAt: timeEntry.client.createdAt.toISOString(),
        },
        projectName: timeEntry.projectName,
        description: timeEntry.description,
        date: timeEntry.date.toISOString(),
        startTime: timeEntry.startTime,
        endTime: timeEntry.endTime,
        duration: timeEntry.duration,
        hourlyRate: Number(timeEntry.hourlyRate),
        amount: Number(timeEntry.amount),
        billable: timeEntry.billable,
        invoiced: timeEntry.invoiced,
        invoiceId: timeEntry.invoiceId,
        tags: timeEntry.tags,
        createdAt: timeEntry.createdAt.toISOString(),
        updatedAt: timeEntry.updatedAt.toISOString(),
      })),
    )
  } catch (error) {
    console.error("Error fetching time entries:", error)
    return NextResponse.json(
      { error: "Failed to fetch time entries" },
      { status: 500 },
    )
  }
}

// POST /api/time-entries - Create or update time entry
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    const timeEntry = await request.json()

    // Validate required fields
    if (
      !timeEntry.id ||
      !timeEntry.clientId ||
      !timeEntry.projectName ||
      !timeEntry.date
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      )
    }

    await prisma.timeEntry.upsert({
      where: { userId, id: timeEntry.id },
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
    })
    return NextResponse.json({ success: true, timeEntry })
  } catch (error) {
    console.error("Error saving time entry:", error)
    return NextResponse.json(
      { error: "Failed to save time entry" },
      { status: 500 },
    )
  }
}

// DELETE /api/time-entries?id=xxx - Delete time entry
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
        { error: "Time entry ID required" },
        { status: 400 },
      )
    }

    await prisma.timeEntry.delete({
      where: { userId, id },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting time entry:", error)
    return NextResponse.json(
      { error: "Failed to delete time entry" },
      { status: 500 },
    )
  }
}

