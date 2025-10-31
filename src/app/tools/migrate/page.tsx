"use client"

import { useState } from "react"
import {
  Download,
  Upload,
  Database,
  AlertCircle,
  CheckCircle,
} from "lucide-react"

export default function MigratePage() {
  const [status, setStatus] = useState<
    "idle" | "exporting" | "importing" | "success" | "error"
  >("idle")
  const [message, setMessage] = useState("")

  // Export from localStorage
  const handleExportLocalStorage = () => {
    try {
      setStatus("exporting")

      const data = {
        invoices: JSON.parse(localStorage.getItem("invoices") || "[]"),
        clients: JSON.parse(localStorage.getItem("clients") || "[]"),
        quotations: JSON.parse(localStorage.getItem("quotations") || "[]"),
        receipts: JSON.parse(localStorage.getItem("receipts") || "[]"),
        contracts: JSON.parse(localStorage.getItem("contracts") || "[]"),
        timeEntries: JSON.parse(localStorage.getItem("time_entries") || "[]"),
        settings: JSON.parse(
          localStorage.getItem("invoice_settings") || "null",
        ),
        exportedAt: new Date().toISOString(),
      }

      // Download as JSON file
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `invoice-data-backup-${new Date().toISOString().split("T")[0]}.json`
      a.click()
      URL.revokeObjectURL(url)

      setStatus("success")
      setMessage(
        `Exported ${data.clients.length} clients, ${data.invoices.length} invoices, and more!`,
      )
    } catch (error) {
      setStatus("error")
      setMessage("Failed to export data: " + (error as Error).message)
    }
  }

  // Import to cloud database
  const handleImportToCloud = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setStatus("importing")
      setMessage("Reading file...")

      const text = await file.text()
      const data = JSON.parse(text)

      setMessage("Uploading to cloud database...")

      // Import clients first (foreign key dependency)
      if (data.clients?.length > 0) {
        for (const client of data.clients) {
          await fetch("/api/clients", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(client),
          })
        }
        setMessage(`Imported ${data.clients.length} clients...`)
      }

      // Import invoices
      if (data.invoices?.length > 0) {
        for (const invoice of data.invoices) {
          await fetch("/api/invoices", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(invoice),
          })
        }
        setMessage(`Imported ${data.invoices.length} invoices...`)
      }

      // Import quotations
      if (data.quotations?.length > 0) {
        for (const quotation of data.quotations) {
          await fetch("/api/quotations", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(quotation),
          })
        }
      }

      // Import receipts
      if (data.receipts?.length > 0) {
        for (const receipt of data.receipts) {
          await fetch("/api/receipts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(receipt),
          })
        }
      }

      // Import contracts
      if (data.contracts?.length > 0) {
        for (const contract of data.contracts) {
          await fetch("/api/contracts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(contract),
          })
        }
      }

      // Import time entries
      if (data.timeEntries?.length > 0) {
        for (const entry of data.timeEntries) {
          await fetch("/api/time-entries", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(entry),
          })
        }
      }

      // Import settings
      if (data.settings) {
        await fetch("/api/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data.settings),
        })
      }

      setStatus("success")
      setMessage("✓ All data imported successfully!")
    } catch (error) {
      setStatus("error")
      setMessage("Failed to import: " + (error as Error).message)
    }
  }

  // Export from cloud
  const handleExportFromCloud = async () => {
    try {
      setStatus("exporting")
      setMessage("Fetching data from cloud...")

      const [
        clients,
        invoices,
        quotations,
        receipts,
        contracts,
        timeEntries,
        settings,
      ] = await Promise.all([
        fetch("/api/clients").then((r) => r.json()),
        fetch("/api/invoices").then((r) => r.json()),
        fetch("/api/quotations").then((r) => r.json()),
        fetch("/api/receipts").then((r) => r.json()),
        fetch("/api/contracts").then((r) => r.json()),
        fetch("/api/time-entries").then((r) => r.json()),
        fetch("/api/settings").then((r) => r.json()),
      ])

      const data = {
        clients,
        invoices,
        quotations,
        receipts,
        contracts,
        timeEntries,
        settings,
        exportedAt: new Date().toISOString(),
      }

      // Download
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `invoice-cloud-backup-${new Date().toISOString().split("T")[0]}.json`
      a.click()
      URL.revokeObjectURL(url)

      setStatus("success")
      setMessage(
        `✓ Exported ${clients.length} clients, ${invoices.length} invoices, and more!`,
      )
    } catch (error) {
      setStatus("error")
      setMessage("Failed to export: " + (error as Error).message)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container py-6">
          <h1 className="text-3xl font-bold">Data Migration</h1>
          <p className="text-muted-foreground">
            Transfer your data between localStorage and cloud database
          </p>
        </div>
      </div>

      <div className="container py-8 max-w-4xl">
        <div className="grid gap-6">
          {/* Status Message */}
          {status !== "idle" && (
            <div
              className={`p-4 rounded-lg border flex items-start gap-3 ${
                status === "success"
                  ? "bg-green-50 border-green-200 text-green-800"
                  : status === "error"
                    ? "bg-red-50 border-red-200 text-red-800"
                    : "bg-blue-50 border-blue-200 text-blue-800"
              }`}
            >
              {status === "success" && (
                <CheckCircle className="size-5 mt-0.5" />
              )}
              {status === "error" && <AlertCircle className="size-5 mt-0.5" />}
              {(status === "importing" || status === "exporting") && (
                <div className="size-5 border-2 border-current border-t-transparent rounded-full animate-spin mt-0.5" />
              )}
              <div className="flex-1">
                <p className="font-medium">{message}</p>
              </div>
            </div>
          )}

          {/* Export from localStorage */}
          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Download className="size-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-2">
                  1. Export from Browser
                </h2>
                <p className="text-muted-foreground mb-4">
                  Download your current localStorage data as a backup JSON file
                </p>
                <button
                  onClick={handleExportLocalStorage}
                  disabled={status === "importing" || status === "exporting"}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  <Download className="size-4" />
                  Export LocalStorage Data
                </button>
              </div>
            </div>
          </div>

          {/* Import to Cloud */}
          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-blue-500/10">
                <Upload className="size-6 text-blue-500" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-2">
                  2. Import to Cloud Database
                </h2>
                <p className="text-muted-foreground mb-4">
                  Upload your backup file to migrate data to Vercel Postgres
                </p>
                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors cursor-pointer disabled:opacity-50">
                  <Upload className="size-4" />
                  Select File to Import
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportToCloud}
                    disabled={status === "importing" || status === "exporting"}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Export from Cloud */}
          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-green-500/10">
                <Database className="size-6 text-green-500" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-2">
                  3. Backup Cloud Data
                </h2>
                <p className="text-muted-foreground mb-4">
                  Download a backup of your cloud database (recommended
                  regularly)
                </p>
                <button
                  onClick={handleExportFromCloud}
                  disabled={status === "importing" || status === "exporting"}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors disabled:opacity-50"
                >
                  <Download className="size-4" />
                  Backup Cloud Data
                </button>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="rounded-lg border bg-muted/50 p-6">
            <h3 className="font-semibold mb-3">Migration Steps:</h3>
            <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
              <li>
                Click "Export LocalStorage Data" to download your current data
              </li>
              <li>
                Click "Select File to Import" and choose the downloaded JSON
                file
              </li>
              <li>Wait for the import to complete (may take a minute)</li>
              <li>
                Your data is now in the cloud! You can delete localStorage if
                desired
              </li>
              <li>Use "Backup Cloud Data" regularly to keep safe copies</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
