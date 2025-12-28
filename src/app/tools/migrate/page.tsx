"use client"

import { useState } from "react"
import Link from "next/link"
import {
    Download,
    Upload,
    Database,
    AlertCircle,
    CheckCircle,
    ArrowLeft,
    Cloud,
    HardDrive,
    RefreshCw,
} from "lucide-react"
import {
    syncToCloud,
    syncFromCloud,
    isSyncEnabled,
    setSyncEnabled,
    getLastSyncTime,
} from "@/lib/storage/hybrid-storage"

export default function MigratePage() {
    const [status, setStatus] = useState<
        "idle" | "exporting" | "importing" | "syncing" | "success" | "error"
    >("idle")
    const [message, setMessage] = useState("")
    const [cloudSyncEnabled, setCloudSyncEnabled] = useState(isSyncEnabled())
    const [lastSync, setLastSync] = useState(getLastSyncTime())

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
                resumes: JSON.parse(localStorage.getItem("resumes") || "[]"),
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
            a.download = `tools-backup-${new Date().toISOString().split("T")[0]}.json`
            a.click()
            URL.revokeObjectURL(url)

            setStatus("success")
            setMessage(
                `✓ Exported ${data.clients.length} clients, ${data.invoices.length} invoices, ${data.resumes.length} resumes, and more!`,
            )
        } catch (error) {
            setStatus("error")
            setMessage("Failed to export data: " + (error as Error).message)
        }
    }

    // Import to localStorage (and optionally sync to cloud)
    const handleImportToLocal = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = event.target.files?.[0]
        if (!file) return

        try {
            setStatus("importing")
            setMessage("Reading file...")

            const text = await file.text()
            const data = JSON.parse(text)

            // Import to localStorage
            if (data.clients)
                localStorage.setItem("clients", JSON.stringify(data.clients))
            if (data.invoices)
                localStorage.setItem("invoices", JSON.stringify(data.invoices))
            if (data.quotations)
                localStorage.setItem("quotations", JSON.stringify(data.quotations))
            if (data.receipts)
                localStorage.setItem("receipts", JSON.stringify(data.receipts))
            if (data.contracts)
                localStorage.setItem("contracts", JSON.stringify(data.contracts))
            if (data.timeEntries)
                localStorage.setItem("time_entries", JSON.stringify(data.timeEntries))
            if (data.resumes)
                localStorage.setItem("resumes", JSON.stringify(data.resumes))
            if (data.settings)
                localStorage.setItem("invoice_settings", JSON.stringify(data.settings))

            const counts = {
                clients: data.clients?.length || 0,
                invoices: data.invoices?.length || 0,
                resumes: data.resumes?.length || 0,
            }

            setStatus("success")
            setMessage(
                `✓ Imported ${counts.clients} clients, ${counts.invoices} invoices, ${counts.resumes} resumes to localStorage!`,
            )

            // If cloud sync is enabled, sync automatically
            if (cloudSyncEnabled) {
                setTimeout(() => handleSyncToCloud(), 1000)
            }
        } catch (error) {
            setStatus("error")
            setMessage("Failed to import: " + (error as Error).message)
        }
    }

    // Sync to cloud
    const handleSyncToCloud = async () => {
        try {
            setStatus("syncing")
            setMessage("Syncing to cloud...")

            const counts = await syncToCloud()
            setLastSync(getLastSyncTime())

            setStatus("success")
            setMessage(
                `✓ Synced ${counts?.clients} clients, ${counts?.invoices} invoices, ${counts?.receipts} receipts, ${counts?.contracts} contracts, ${counts?.timeEntries} time entries, ${counts?.resumes} resumes to cloud!`,
            )
        } catch (error) {
            setStatus("error")
            setMessage("Sync failed: " + (error as Error).message)
        }
    }

    // Sync from cloud
    const handleSyncFromCloud = async () => {
        try {
            setStatus("syncing")
            setMessage("Syncing from cloud...")

            await syncFromCloud()
            setLastSync(getLastSyncTime())

            setStatus("success")
            setMessage("✓ Data synced from cloud to localStorage!")

            // Reload the page to refresh all data
            setTimeout(() => window.location.reload(), 1000)
        } catch (error) {
            setStatus("error")
            setMessage("Sync failed: " + (error as Error).message)
        }
    }

    // Toggle cloud sync
    const handleToggleSync = () => {
        const newState = !cloudSyncEnabled
        setSyncEnabled(newState)
        setCloudSyncEnabled(newState)

        if (newState) {
            setMessage("Cloud sync enabled! Your changes will auto-sync.")
        } else {
            setMessage("Cloud sync disabled. Using localStorage only.")
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
                resumes,
                settings,
            ] = await Promise.all([
                fetch("/api/clients").then((r) => r.json()),
                fetch("/api/invoices").then((r) => r.json()),
                fetch("/api/quotations").then((r) => r.json()),
                fetch("/api/receipts").then((r) => r.json()),
                fetch("/api/contracts").then((r) => r.json()),
                fetch("/api/time-entries").then((r) => r.json()),
                fetch("/api/resumes").then((r) => r.json()),
                fetch("/api/settings").then((r) => r.json()),
            ])

            const data = {
                clients,
                invoices,
                quotations,
                receipts,
                contracts,
                timeEntries,
                resumes,
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
            a.download = `cloud-backup-${new Date().toISOString().split("T")[0]}.json`
            a.click()
            URL.revokeObjectURL(url)

            setStatus("success")
            setMessage(
                `✓ Exported ${clients.length} clients, ${invoices.length} invoices, ${resumes.length} resumes from cloud!`,
            )
        } catch (error) {
            setStatus("error")
            setMessage("Failed to export: " + (error as Error).message)
        }
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="border-b bg-card">
                <div className="container py-6">
                    <div className="flex items-center gap-4 mb-2">
                        <Link
                            href="/tools"
                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                        >
                            <ArrowLeft className="size-5" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold">Data Migration & Sync</h1>
                            <p className="text-muted-foreground">
                                Manage your data between localStorage and cloud
                            </p>
                        </div>
                    </div>

                    {/* Sync Status */}
                    {lastSync && (
                        <div className="mt-4 text-sm text-muted-foreground">
                            Last synced: {lastSync.toLocaleString()}
                        </div>
                    )}
                </div>
            </div>

            <div className="container py-8 max-w-4xl">
                <div className="grid gap-6">
                    {/* Status Message */}
                    {status !== "idle" && (
                        <div
                            className={`p-4 rounded-lg border flex items-start gap-3 ${status === "success"
                                    ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200"
                                    : status === "error"
                                        ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200"
                                        : "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200"
                                }`}
                        >
                            {status === "success" && (
                                <CheckCircle className="size-5 mt-0.5 shrink-0" />
                            )}
                            {status === "error" && (
                                <AlertCircle className="size-5 mt-0.5 shrink-0" />
                            )}
                            {(status === "importing" ||
                                status === "exporting" ||
                                status === "syncing") && (
                                    <div className="size-5 border-2 border-current border-t-transparent rounded-full animate-spin mt-0.5 shrink-0" />
                                )}
                            <div className="flex-1">
                                <p className="font-medium">{message}</p>
                            </div>
                        </div>
                    )}

                    {/* Cloud Sync Toggle */}
                    <div className="rounded-lg border bg-card p-6">
                        <div className="flex items-start gap-4">
                            <div
                                className={`p-3 rounded-lg ${cloudSyncEnabled ? "bg-green-500/10" : "bg-gray-500/10"}`}
                            >
                                {cloudSyncEnabled ? (
                                    <Cloud className="size-6 text-green-500" />
                                ) : (
                                    <HardDrive className="size-6 text-gray-500" />
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <h2 className="text-xl font-semibold">Cloud Sync</h2>
                                    <button
                                        onClick={handleToggleSync}
                                        className={`px-4 py-2 rounded-lg transition-colors ${cloudSyncEnabled
                                                ? "bg-green-500 text-white hover:bg-green-600"
                                                : "bg-gray-500 text-white hover:bg-gray-600"
                                            }`}
                                    >
                                        {cloudSyncEnabled ? "Enabled" : "Disabled"}
                                    </button>
                                </div>
                                <p className="text-muted-foreground mb-4">
                                    {cloudSyncEnabled
                                        ? "Your data automatically syncs to the cloud. Changes are saved locally first for speed."
                                        : "Using localStorage only. Enable cloud sync for backup and multi-device access."}
                                </p>
                                {cloudSyncEnabled && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleSyncToCloud}
                                            disabled={status === "syncing"}
                                            className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-muted transition-colors disabled:opacity-50"
                                        >
                                            <RefreshCw className="size-4" />
                                            Sync to Cloud
                                        </button>
                                        <button
                                            onClick={handleSyncFromCloud}
                                            disabled={status === "syncing"}
                                            className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-muted transition-colors disabled:opacity-50"
                                        >
                                            <Download className="size-4" />
                                            Sync from Cloud
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Export from localStorage */}
                    <div className="rounded-lg border bg-card p-6">
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-lg bg-primary/10">
                                <Download className="size-6 text-primary" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-xl font-semibold mb-2">
                                    Export Local Data
                                </h2>
                                <p className="text-muted-foreground mb-4">
                                    Download your localStorage data as a backup JSON file
                                    (includes resumes, invoices, etc.)
                                </p>
                                <button
                                    onClick={handleExportLocalStorage}
                                    disabled={
                                        status === "importing" ||
                                        status === "exporting" ||
                                        status === "syncing"
                                    }
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                                >
                                    <Download className="size-4" />
                                    Export LocalStorage
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Import to Local */}
                    <div className="rounded-lg border bg-card p-6">
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-lg bg-blue-500/10">
                                <Upload className="size-6 text-blue-500" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-xl font-semibold mb-2">
                                    Import Local Data
                                </h2>
                                <p className="text-muted-foreground mb-4">
                                    Restore from a backup file to localStorage
                                    {cloudSyncEnabled && " (will auto-sync to cloud)"}
                                </p>
                                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors cursor-pointer disabled:opacity-50">
                                    <Upload className="size-4" />
                                    Select File to Import
                                    <input
                                        type="file"
                                        accept=".json"
                                        onChange={handleImportToLocal}
                                        disabled={
                                            status === "importing" ||
                                            status === "exporting" ||
                                            status === "syncing"
                                        }
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
                                    Backup Cloud Data
                                </h2>
                                <p className="text-muted-foreground mb-4">
                                    Download a backup of your cloud database (recommended
                                    regularly)
                                </p>
                                <button
                                    onClick={handleExportFromCloud}
                                    disabled={
                                        status === "importing" ||
                                        status === "exporting" ||
                                        status === "syncing"
                                    }
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
                        <h3 className="font-semibold mb-3">How It Works:</h3>
                        <div className="space-y-3 text-sm text-muted-foreground">
                            <div className="flex gap-2">
                                <span className="font-bold text-foreground">
                                    💾 Primary Storage:
                                </span>
                                <span>
                                    All data is stored in localStorage for instant access
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <span className="font-bold text-foreground">
                                    ☁️ Cloud Sync:
                                </span>
                                <span>
                                    When enabled, changes auto-sync to cloud after 2 seconds
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <span className="font-bold text-foreground">
                                    🔄 Two-Way Sync:
                                </span>
                                <span>
                                    Sync to cloud (upload) or from cloud (download/restore)
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <span className="font-bold text-foreground">📦 Backup:</span>
                                <span>Export JSON files for manual backups anytime</span>
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t">
                            <h3 className="font-semibold mb-3">Migration Steps:</h3>
                            <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                                <li>Enable "Cloud Sync" to start syncing your data</li>
                                <li>
                                    Click "Sync to Cloud" to upload existing localStorage data
                                </li>
                                <li>
                                    Your data is now backed up! Auto-sync will handle future
                                    changes
                                </li>
                                <li>Use "Backup Cloud Data" regularly for extra safety</li>
                                <li>On another device: Enable sync and "Sync from Cloud"</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
