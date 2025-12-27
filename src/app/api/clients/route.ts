import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// GET /api/clients - Get all clients
// GET /api/clients?id=xxx - Get single client
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    const clients = await prisma.client.findMany({
      where: { userId }
    })

    return NextResponse.json(clients)
  } catch (error) {
    console.error("Error fetching clients:", error)
    return NextResponse.json(
      { error: "Failed to fetch clients" },
      { status: 500 },
    )
  }
}

// POST /api/clients - Create or update client
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    const client = await request.json()
    await prisma.client.upsert({
      where: { userId, id: client.id },
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
    })

    return NextResponse.json({ success: true, client })
  } catch (error) {
    console.error("Error saving client:", error)
    return NextResponse.json(
      { error: "Failed to save client" },
      { status: 500 },
    )
  }
}

// DELETE /api/clients?id=xxx - Delete client
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
      return NextResponse.json({ error: "Client ID required" }, { status: 400 })
    }

    await prisma.client.delete({
      where: { userId, id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting client:", error)
    return NextResponse.json(
      { error: "Failed to delete client" },
      { status: 500 },
    )
  }
}
