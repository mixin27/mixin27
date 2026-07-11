"use client"

import { useState } from "react"
import Link from "next/link"
import {
    Download,
    Upload,
    AlertCircle,
    CheckCircle,
    ArrowLeft,
} from "lucide-react"
import { exportAllData, importAllData } from "@/lib/storage/tools-storage"

export default function MigratePage() {
    const [status, setStatus] = useState<
        "idle" | "exporting" | "importing" | "success" | "error"
    >("idle")
    const [message, setMessage] = useState("")

    const handleExport = async () => {
        try {
            setStatus("exporting")
            setMessage("Preparing data...")

            const data = await exportAllData()
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
                `✓ Exported ${data.clients?.length || 0} clients, ${data.invoices?.length || 0} invoices, ${data.resumes?.length || 0} resumes, and more!`,
            )
        } catch (error) {
            setStatus("error")
            setMessage("Failed to export data: " + (error as Error).message)
        }
    }

    const handleImport = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = event.target.files?.[0]
        if (!file) return

        try {
            setStatus("importing")
            setMessage("Reading file...")

            const text = await file.text()
            const data = JSON.parse(text)

            await importAllData(data)

            setStatus("success")
            setMessage(
                `✓ Imported ${data.clients?.length || 0} clients, ${data.invoices?.length || 0} invoices, ${data.resumes?.length || 0} resumes to localStorage!`,
            )
        } catch (error) {
            setStatus("error")
            setMessage("Failed to import: " + (error as Error).message)
        }
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
                            <h1 className="mb-4 text-5xl font-bold tracking-tight">Data Migration</h1>
                            <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">Export or import your data for backup and transfer</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-6 py-16">
                <div className="grid gap-6">
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
                            {(status === "importing" || status === "exporting") && (
                                <div className="size-5 border-2 border-current border-t-transparent rounded-full animate-spin mt-0.5 shrink-0" />
                            )}
                            <div className="flex-1">
                                <p className="font-medium">{message}</p>
                            </div>
                        </div>
                    )}

                    <div className="rounded-2xl border border-border bg-card/60 p-6 shadow-sm">
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-lg bg-primary/10">
                                <Download className="size-6 text-primary" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-xl font-semibold mb-2">
                                    Export Data
                                </h2>
                                <p className="text-muted-foreground mb-4">
                                    Download all your data as a JSON backup file
                                </p>
                                <button
                                    onClick={handleExport}
                                    disabled={status === "exporting" || status === "importing"}
                                    className="inline-flex items-center gap-2 rounded-xl bg-purple-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-purple-400 disabled:opacity-50"
                                >
                                    <Download className="size-4" />
                                    Export Backup
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-border bg-card/60 p-6 shadow-sm">
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-lg bg-blue-500/10">
                                <Upload className="size-6 text-blue-500" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-xl font-semibold mb-2">
                                    Import Data
                                </h2>
                                <p className="text-muted-foreground mb-4">
                                    Restore from a backup JSON file
                                </p>
                                <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-purple-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-purple-400 disabled:opacity-50">
                                    <Upload className="size-4" />
                                    Select File to Import
                                    <input
                                        type="file"
                                        accept=".json"
                                        onChange={handleImport}
                                        disabled={status === "exporting" || status === "importing"}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-border bg-card/60 p-6 shadow-sm">
                        <h3 className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase mb-3">About Data Storage:</h3>
                        <div className="space-y-2 text-sm text-muted-foreground">
                            <p>
                                All data is stored locally in your browser (localStorage).
                                Export regularly to keep backups.
                            </p>
                            <p>
                                When you import a backup file, existing data will be
                                overwritten or merged depending on IDs.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
