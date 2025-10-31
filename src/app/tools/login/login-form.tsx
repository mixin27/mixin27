"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Lock } from "lucide-react"

export default function ToolsLoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (response.ok) {
        // Redirect to the page they were trying to access, or /tools
        const from = searchParams.get("from") || "/tools/invoices"
        router.push(from)
        router.refresh()
      } else {
        setError(data.error || "Invalid password")
      }
    } catch (_) {
      setError("Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="rounded-lg border bg-card p-8 shadow-lg">
          <div className="flex flex-col items-center mb-6">
            <div className="p-3 rounded-full bg-primary/10 mb-4">
              <Lock className="size-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">Tools Access</h1>
            <p className="text-muted-foreground text-sm mt-2">
              Enter your password to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter password"
                autoFocus
                required
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
