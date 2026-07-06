"use client"

import Link from "next/link"
import { Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          {/* 404 Illustration */}
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-primary/20 dark:text-primary/80">
              404
            </h1>
          </div>

          {/* Error Message */}
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Page Not Found
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Oops! The page you're looking for doesn't exist. It might have been
            moved or deleted.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-purple-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-purple-400"
            >
              <Home className="size-4" />
              Go Home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/60 px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-card"
            >
              <ArrowLeft className="size-4" />
              Go Back
            </button>
          </div>

          {/* Helpful Links */}
          <div className="mt-12 border-t pt-8">
            <p className="mb-4 text-sm text-muted-foreground">
              Maybe these links will help:
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link href="/projects" className="text-primary hover:underline">
                Projects
              </Link>
              <Link href="/blog" className="text-primary hover:underline">
                Blog
              </Link>
              <Link href="/apps" className="text-primary hover:underline">
                Apps
              </Link>
              <Link href="/about" className="text-primary hover:underline">
                About
              </Link>
              <Link href="/contact" className="text-primary hover:underline">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
