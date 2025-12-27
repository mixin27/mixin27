import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

export async function getCurrentUser() {
    const session = await getServerSession(authOptions)
    return session?.user
}

export async function requireAuth() {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        redirect("/tools/login")
    }

    return session.user
}

export async function getUserId() {
    const user = await requireAuth()
    return user.id
}
