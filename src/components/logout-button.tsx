"use client"

import { signOut, useSession } from "next-auth/react"
import { LogOut } from "lucide-react"
import { Button } from "./ui/button"

export function LogoutButton() {
    const { data: session } = useSession()

    return (
        <Button
            variant="destructive"
            className="my-4"
            onClick={() => signOut({ callbackUrl: "/tools/login" })}
        >
            <LogOut className="size-4" />
            Sign Out
        </Button>
    )
}
