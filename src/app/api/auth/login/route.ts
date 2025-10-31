import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    // Check password against env variable
    if (password === process.env.TOOLS_PASSWORD) {
      // Set auth cookie
      const cookieStore = await cookies()
      cookieStore.set("tools-auth", process.env.TOOLS_AUTH_SECRET!, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
      })

      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 })
    }
  } catch (_) {
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}

// Logout endpoint
export async function DELETE() {
  const cookieStore = await cookies()
  cookieStore.delete("tools-auth")
  return NextResponse.json({ success: true })
}
