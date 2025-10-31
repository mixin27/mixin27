import { NextRequest, NextResponse } from "next/server"
import {
  dbSaveClient,
  dbGetClients,
  dbGetClientById,
  dbDeleteClient,
} from "@/lib/db"

// GET /api/clients - Get all clients
// GET /api/clients?id=xxx - Get single client
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get("id")

    if (id) {
      const client = await dbGetClientById(id)
      if (!client) {
        return NextResponse.json({ error: "Client not found" }, { status: 404 })
      }
      return NextResponse.json(client)
    }

    const clients = await dbGetClients()
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
    const client = await request.json()
    await dbSaveClient(client)
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
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Client ID required" }, { status: 400 })
    }

    await dbDeleteClient(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting client:", error)
    return NextResponse.json(
      { error: "Failed to delete client" },
      { status: 500 },
    )
  }
}
