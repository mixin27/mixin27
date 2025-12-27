import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Protect all /tools routes except login and auth routes
    if (pathname.startsWith("/tools") &&
        !pathname.startsWith("/tools/login") &&
        !pathname.startsWith("/api/auth")) {
        // Get the JWT token from NextAuth
        const token = await getToken({
            req: request,
            secret: process.env.NEXTAUTH_SECRET,
        })

        // If no token, redirect to login
        if (!token) {
            const loginUrl = new URL("/tools/login", request.url)
            loginUrl.searchParams.set("callbackUrl", pathname)
            return NextResponse.redirect(loginUrl)
        }

        // Optional: Add user info to headers for API routes
        const response = NextResponse.next()
        response.headers.set("x-user-id", token.id as string)
        response.headers.set("x-user-email", token.email as string)

        return response
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api/auth (NextAuth routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
    ],
}
