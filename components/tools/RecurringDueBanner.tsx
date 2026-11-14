"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { CalendarClock } from "lucide-react"
import { getDueRecurring } from "@/lib/document-conversions"

/** Shows how many recurring invoices are due, linking to where they're generated. */
export function RecurringDueBanner({ className = "" }: { className?: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    getDueRecurring().then((due) => setCount(due.reduce((n, d) => n + d.dates.length, 0)))
  }, [])

  if (!count) return null
  return (
    <Link
      href="/tools/invoices/recurring"
      className={`flex items-center justify-between gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-800 transition-colors hover:bg-amber-500/15 dark:text-amber-200 ${className}`}
    >
      <span className="flex items-center gap-2">
        <CalendarClock className="size-4 shrink-0" />
        {count} recurring invoice{count === 1 ? " is" : "s are"} due
      </span>
      <span className="font-semibold">Generate →</span>
    </Link>
  )
}
