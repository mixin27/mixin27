"use client"

import { v7 as uuidv7 } from "uuid"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save } from "lucide-react"
import { Client } from "@/types/invoice"
import { saveClient } from "@/lib/storage/tools-storage"

export default function NewClientPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    taxId: "",
  })

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      alert("Please enter a client name")
      return
    }

    if (!formData.email.trim()) {
      alert("Please enter a client email")
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      alert("Please enter a valid email address")
      return
    }

    const client: Client = {
      //   id: Date.now().toString(),
      id: uuidv7(),
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim() || undefined,
      address: formData.address.trim() || undefined,
      city: formData.city.trim() || undefined,
      state: formData.state.trim() || undefined,
      zipCode: formData.zipCode.trim() || undefined,
      country: formData.country.trim() || undefined,
      taxId: formData.taxId.trim() || undefined,
      createdAt: new Date().toISOString(),
    }

    saveClient(client)
    router.push("/tools/invoices/clients")
  }

  return (
    <>
      {/* Header */}
      <div className="relative border-b border-border/70 pt-32 pb-20">
        <div
          className="pointer-events-none absolute -top-10 right-0 size-[500px] rounded-full bg-purple-500/8 blur-[120px]"
          aria-hidden="true"
        />
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-start justify-between">
            <div>
              <Link
                href="/tools/invoices/clients"
                className="mb-8 flex items-center gap-2 font-mono text-[11px] tracking-widest text-purple-400 uppercase transition-colors hover:text-purple-300"
              >
                <ArrowLeft className="size-3" />
                Back to Clients
              </Link>
              <h1 className="mb-4 text-5xl font-bold tracking-tight">New Client</h1>
              <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
                Add a new client to your database
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="max-w-2xl mx-auto">
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-border bg-card/60 p-6 md:p-8 shadow-sm"
          >
            {/* Basic Information */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block font-mono text-[11px] tracking-widest text-muted-foreground uppercase mb-2">
                    Name <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background/80 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20"
                    placeholder="Client Name"
                    required
                  />
                </div>

                <div>
                  <label className="block font-mono text-[11px] tracking-widest text-muted-foreground uppercase mb-2">
                    Email <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background/80 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20"
                    placeholder="client@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block font-mono text-[11px] tracking-widest text-muted-foreground uppercase mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background/80 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[11px] tracking-widest text-muted-foreground uppercase mb-2">
                    Tax ID / VAT Number
                  </label>
                  <input
                    type="text"
                    value={formData.taxId}
                    onChange={(e) => handleChange("taxId", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background/80 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20"
                    placeholder="Optional"
                  />
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">
                Address Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block font-mono text-[11px] tracking-widest text-muted-foreground uppercase mb-2">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background/80 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20"
                    placeholder="123 Main Street"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-[11px] tracking-widest text-muted-foreground uppercase mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleChange("city", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background/80 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20"
                      placeholder="New York"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[11px] tracking-widest text-muted-foreground uppercase mb-2">
                      State / Province
                    </label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => handleChange("state", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background/80 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20"
                      placeholder="NY"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-[11px] tracking-widest text-muted-foreground uppercase mb-2">
                      ZIP / Postal Code
                    </label>
                    <input
                      type="text"
                      value={formData.zipCode}
                      onChange={(e) => handleChange("zipCode", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background/80 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20"
                      placeholder="10001"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[11px] tracking-widest text-muted-foreground uppercase mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => handleChange("country", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background/80 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20"
                      placeholder="United States"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Link
                href="/tools/invoices/clients"
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card/60 px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-card"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-purple-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-purple-400"
              >
                <Save className="size-4" />
                Save Client
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
