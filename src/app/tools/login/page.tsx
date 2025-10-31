"use client"

import { Suspense } from "react"
import ToolsLoginForm from "./login-form"

export default function ToolsLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      }
    >
      <ToolsLoginForm />
    </Suspense>
  )
}
