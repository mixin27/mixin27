import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect all /tools routes except login
  if (pathname.startsWith("/tools") && pathname !== "/tools/login") {
    // Check if user is authenticated
    const token = request.cookies.get("tools-auth")?.value

    if (!token || token !== process.env.TOOLS_AUTH_SECRET) {
      // Redirect to login
      const loginUrl = new URL("/tools/login", request.url)
      loginUrl.searchParams.set("from", pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: "/tools/:path*",
}
