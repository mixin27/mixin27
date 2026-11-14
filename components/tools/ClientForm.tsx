"use client"

import { useState } from "react"
import Link from "next/link"
import { Save } from "lucide-react"
import type { Client } from "@/types/invoice"

export type ClientFormValues = Pick<
  Client,
  "name" | "email" | "phone" | "address" | "city" | "state" | "zipCode" | "country" | "taxId"
>

const EMPTY: Required<ClientFormValues> = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  country: "",
  taxId: "",
}

const inputClass =
  "w-full px-4 py-3 rounded-xl border border-border bg-background/80 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20"
const labelClass =
  "block font-mono text-[11px] tracking-widest text-muted-foreground uppercase mb-2"

/** Trimmed values with empty optional fields removed. */
export function cleanClientValues(values: ClientFormValues): ClientFormValues {
  const out: ClientFormValues = { name: values.name.trim(), email: values.email.trim() }
  for (const key of ["phone", "address", "city", "state", "zipCode", "country", "taxId"] as const) {
    const v = values[key]?.trim()
    out[key] = v || undefined
  }
  return out
}

interface ClientFormProps {
  initial?: Partial<ClientFormValues>
  submitLabel: string
  cancelHref: string
  onSubmit: (values: ClientFormValues) => Promise<void> | void
}

export function ClientForm({ initial, submitLabel, cancelHref, onSubmit }: ClientFormProps) {
  const [values, setValues] = useState<Required<ClientFormValues>>(() => {
    const merged = { ...EMPTY }
    for (const key of Object.keys(EMPTY) as (keyof ClientFormValues)[]) {
      merged[key] = initial?.[key] ?? ""
    }
    return merged
  })
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const field = (key: keyof ClientFormValues) => ({
    id: `client-${key}`,
    value: values[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setValues((prev) => ({ ...prev, [key]: e.target.value })),
    className: inputClass,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const cleaned = cleanClientValues(values)
    if (!cleaned.name) return setError("Please enter a client name.")
    if (!cleaned.email) return setError("Please enter a client email.")
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned.email)) {
      return setError("Please enter a valid email address.")
    }
    setError(null)
    setSaving(true)
    try {
      await onSubmit(cleaned)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl border border-border bg-card/60 p-6 md:p-8 shadow-sm"
    >
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="client-name" className={labelClass}>
              Name <span className="text-destructive">*</span>
            </label>
            <input type="text" placeholder="Client or company name" autoFocus {...field("name")} />
          </div>
          <div>
            <label htmlFor="client-email" className={labelClass}>
              Email <span className="text-destructive">*</span>
            </label>
            <input type="email" placeholder="client@example.com" {...field("email")} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="client-phone" className={labelClass}>Phone</label>
              <input type="tel" placeholder="+95 9 123 456 789" {...field("phone")} />
            </div>
            <div>
              <label htmlFor="client-taxId" className={labelClass}>Tax ID / VAT Number</label>
              <input type="text" placeholder="Optional" {...field("taxId")} />
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Address</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="client-address" className={labelClass}>Street Address</label>
            <input type="text" placeholder="123 Main Street" {...field("address")} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="client-city" className={labelClass}>City</label>
              <input type="text" {...field("city")} />
            </div>
            <div>
              <label htmlFor="client-state" className={labelClass}>State / Province</label>
              <input type="text" {...field("state")} />
            </div>
            <div>
              <label htmlFor="client-zipCode" className={labelClass}>ZIP / Postal Code</label>
              <input type="text" {...field("zipCode")} />
            </div>
            <div>
              <label htmlFor="client-country" className={labelClass}>Country</label>
              <input type="text" {...field("country")} />
            </div>
          </div>
        </div>
      </div>

      {error && (
        <p role="alert" className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <Link
          href={cancelHref}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card/60 px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-card"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={saving}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-purple-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-purple-400 disabled:opacity-60"
        >
          <Save className="size-4" />
          {submitLabel}
        </button>
      </div>
    </form>
  )
}

export function ToolsPageHeader({
  backHref,
  backLabel,
  title,
  subtitle,
  actions,
}: {
  backHref: string
  backLabel: string
  title: React.ReactNode
  subtitle?: React.ReactNode
  actions?: React.ReactNode
}) {
  return (
    <div className="relative border-b border-border/70 pt-32 pb-16 md:pb-20">
      <div
        className="pointer-events-none absolute -top-10 right-0 size-[500px] max-w-full rounded-full bg-purple-500/8 blur-[120px]"
        aria-hidden="true"
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Link
          href={backHref}
          className="mb-8 inline-flex items-center gap-2 font-mono text-[11px] tracking-widest text-purple-400 uppercase transition-colors hover:text-purple-300"
        >
          <span aria-hidden="true">←</span>
          {backLabel}
        </Link>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            <h1 className="mb-4 text-4xl md:text-5xl font-bold tracking-tight break-words">{title}</h1>
            {subtitle && (
              <div className="max-w-xl text-lg leading-relaxed text-muted-foreground">{subtitle}</div>
            )}
          </div>
          {actions && <div className="flex flex-wrap gap-2 shrink-0">{actions}</div>}
        </div>
      </div>
    </div>
  )
}
