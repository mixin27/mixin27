"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Save, Download, Upload } from "lucide-react"
import {
  getSettings,
  saveSettings,
  exportAllData,
  importAllData,
} from "@/lib/storage/tools-storage"
import { InvoiceSettings } from "@/types/invoice"

export default function SettingsPage() {
  const [settings, setSettings] = useState<InvoiceSettings | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setSettings(getSettings())
  }, [])

  const handleSave = () => {
    if (settings) {
      saveSettings(settings)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
  }

  const handleExport = () => {
    const data = exportAllData()
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `invoice-data-backup-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "application/json"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target?.result as string)
            if (
              confirm("This will replace all your current data. Are you sure?")
            ) {
              importAllData(data)
              setSettings(getSettings())
              alert("Data imported successfully!")
            }
          } catch (error) {
            alert("Invalid file format!")
            console.error("Error importing data:", error)
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  if (!settings) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <>
      <div className="relative border-b border-border/70 pt-32 pb-20">
        <div className="pointer-events-none absolute -top-10 right-0 size-[500px] rounded-full bg-purple-500/8 blur-[120px]" aria-hidden="true" />
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-start justify-between">
            <div>
              <Link href="/tools" className="mb-8 flex items-center gap-2 font-mono text-[11px] tracking-widest text-purple-400 uppercase transition-colors hover:text-purple-300">
                <ArrowLeft className="size-3" />
                Back to Tools
              </Link>
              <h1 className="mb-4 text-5xl font-bold tracking-tight">Settings</h1>
              <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">Configure your tools and preferences</p>
            </div>
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 rounded-xl bg-purple-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-purple-400"
            >
              <Save className="size-4" />
              {saved ? "Saved!" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Business Information */}
          <div className="rounded-2xl border border-border bg-card/60 shadow-sm p-6">
            <h2 className="text-2xl font-bold tracking-tight mb-6">Business Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase mb-2">
                  Business Name <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={settings.businessName}
                  onChange={(e) =>
                    setSettings({ ...settings, businessName: e.target.value })
                  }
                  className="w-full rounded-xl border border-border bg-background/80 px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20"
                  required
                />
              </div>

              <div>
                <label className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase mb-2">
                  Email <span className="text-destructive">*</span>
                </label>
                <input
                  type="email"
                  value={settings.businessEmail}
                  onChange={(e) =>
                    setSettings({ ...settings, businessEmail: e.target.value })
                  }
                  className="w-full rounded-xl border border-border bg-background/80 px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20"
                  required
                />
              </div>

              <div>
                <label className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase mb-2">Phone</label>
                <input
                  type="tel"
                  value={settings.businessPhone || ""}
                  onChange={(e) =>
                    setSettings({ ...settings, businessPhone: e.target.value })
                  }
                  className="w-full rounded-xl border border-border bg-background/80 px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20"
                />
              </div>

              <div className="md:col-span-2">
                <label className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase mb-2">
                  Address
                </label>
                <input
                  type="text"
                  value={settings.businessAddress || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      businessAddress: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-border bg-background/80 px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20"
                />
              </div>

              <div>
                <label className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase mb-2">City</label>
                <input
                  type="text"
                  value={settings.businessCity || ""}
                  onChange={(e) =>
                    setSettings({ ...settings, businessCity: e.target.value })
                  }
                  className="w-full rounded-xl border border-border bg-background/80 px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20"
                />
              </div>

              <div>
                <label className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase mb-2">
                  State/Province
                </label>
                <input
                  type="text"
                  value={settings.businessState || ""}
                  onChange={(e) =>
                    setSettings({ ...settings, businessState: e.target.value })
                  }
                  className="w-full rounded-xl border border-border bg-background/80 px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20"
                />
              </div>

              <div>
                <label className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase mb-2">
                  ZIP/Postal Code
                </label>
                <input
                  type="text"
                  value={settings.businessZipCode || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      businessZipCode: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-border bg-background/80 px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20"
                />
              </div>

              <div>
                <label className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase mb-2">
                  Country
                </label>
                <input
                  type="text"
                  value={settings.businessCountry || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      businessCountry: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-border bg-background/80 px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20"
                />
              </div>

              <div className="md:col-span-2">
                <label className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase mb-2">
                  Tax ID / VAT Number
                </label>
                <input
                  type="text"
                  value={settings.taxId || ""}
                  onChange={(e) =>
                    setSettings({ ...settings, taxId: e.target.value })
                  }
                  className="w-full rounded-xl border border-border bg-background/80 px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20"
                />
              </div>
            </div>
          </div>

          {/* Invoice Settings */}
          <div className="rounded-2xl border border-border bg-card/60 shadow-sm p-6">
            <h2 className="text-2xl font-bold tracking-tight mb-6">Invoice Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase mb-2">
                  Default Currency
                </label>
                <select
                  value={settings.defaultCurrency}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      defaultCurrency: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-border bg-background/80 px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20"
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="MMK">MMK - Myanmar Kyat</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="JPY">JPY - Japanese Yen</option>
                  <option value="CAD">CAD - Canadian Dollar</option>
                  <option value="AUD">AUD - Australian Dollar</option>
                  <option value="INR">INR - Indian Rupee</option>
                </select>
              </div>

              <div>
                <label className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase mb-2">
                  Default Tax Rate (%)
                </label>
                <input
                  type="number"
                  value={settings.defaultTaxRate}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      defaultTaxRate: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full rounded-xl border border-border bg-background/80 px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase mb-2">
                  Invoice Prefix
                </label>
                <input
                  type="text"
                  value={settings.invoicePrefix}
                  onChange={(e) =>
                    setSettings({ ...settings, invoicePrefix: e.target.value })
                  }
                  className="w-full rounded-xl border border-border bg-background/80 px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20"
                />
              </div>

              <div>
                <label className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase mb-2">
                  Next Invoice Number
                </label>
                <input
                  type="number"
                  value={settings.nextInvoiceNumber}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      nextInvoiceNumber: parseInt(e.target.value) || 1,
                    })
                  }
                  className="w-full rounded-xl border border-border bg-background/80 px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20"
                  min="1"
                />
              </div>

              <div className="md:col-span-2">
                <label className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase mb-2">
                  Default Payment Terms
                </label>
                <textarea
                  value={settings.defaultPaymentTerms}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      defaultPaymentTerms: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full rounded-xl border border-border bg-background/80 px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 resize-none"
                  placeholder="Payment due within 30 days..."
                />
              </div>
            </div>
          </div>

          {/* Data Management */}
          <div className="rounded-2xl border border-border bg-card/60 shadow-sm p-6">
            <h2 className="text-2xl font-bold tracking-tight mb-6">Data Management</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Export or import all your data including invoices, clients, and
              settings.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleExport}
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/60 px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-card"
              >
                <Download className="size-4" />
                Export Data
              </button>
              <button
                onClick={handleImport}
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/60 px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-card"
              >
                <Upload className="size-4" />
                Import Data
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              💡 Tip: Export your data regularly as a backup. All data is stored
              locally in your browser.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
