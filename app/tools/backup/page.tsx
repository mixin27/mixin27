"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import {
  CheckCircle2,
  Cloud,
  CloudOff,
  Download,
  HardDrive,
  Loader2,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  Trash2,
  Upload,
} from "lucide-react"
import { ToolsPageHeader } from "@/components/tools/ClientForm"
import { BACKUP_KEY_LABELS, RestoreBackupDialog } from "@/components/tools/RestoreBackupDialog"
import {
  buildBackup,
  downloadBackupFile,
  restoreBackup,
  summarizeBackup,
  validateBackup,
  type ToolsBackup,
} from "@/lib/tools/backup"
import {
  DriveError,
  MAX_DRIVE_BACKUPS,
  disconnectDrive,
  driveClient,
  getAccessToken,
  googleClientId,
  hasValidToken,
  preloadGoogleSignIn,
  wasConnected,
  type DriveBackupFile,
} from "@/lib/tools/google-drive"
import {
  DRIVE_BACKUP_STATUS,
  hasPendingChanges,
  isAutoBackupEnabled,
  lastDriveBackupAt,
  markDriveBackedUp,
  setAutoBackupEnabled,
} from "@/lib/tools/drive-backup-state"

type Restoring = { backup: ToolsBackup; label: string } | null
type Message = { tone: "success" | "error"; text: string } | null

function formatWhen(iso: string | null): string {
  if (!iso) return "never"
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return "unknown"
  return d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

function countsText(counts: Record<string, number>): string {
  const parts = Object.entries(counts)
    .filter(([, n]) => n)
    .map(([k, n]) => {
      const plural = (BACKUP_KEY_LABELS[k] ?? k).toLowerCase()
      const label = n === 1 ? plural.replace(/ies$/, "y").replace(/s$/, "") : plural
      return `${n} ${label}`
    })
  return parts.length ? parts.join(", ") : "Settings only"
}

const primaryButton =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-purple-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-purple-400 disabled:opacity-50"
const ghostButton =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card/60 px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-card disabled:opacity-50"

export default function BackupPage() {
  const configured = !!googleClientId()
  const [connected, setConnected] = useState(false)
  const [email, setEmail] = useState<string | null>(null)
  const [files, setFiles] = useState<DriveBackupFile[] | null>(null)
  const [busy, setBusy] = useState<string | null>(null)
  const [message, setMessage] = useState<Message>(null)
  const [restoring, setRestoring] = useState<Restoring>(null)
  const [autoBackup, setAutoBackup] = useState(false)
  const [lastBackup, setLastBackup] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const [reconnectHint, setReconnectHint] = useState(false)
  const fileInput = useRef<HTMLInputElement>(null)

  const refreshStatus = useCallback(() => {
    setAutoBackup(isAutoBackupEnabled())
    setLastBackup(lastDriveBackupAt())
    setPending(hasPendingChanges())
  }, [])

  useEffect(() => {
    refreshStatus()
    preloadGoogleSignIn()
    setReconnectHint(wasConnected())
    setConnected(hasValidToken())
    window.addEventListener(DRIVE_BACKUP_STATUS, refreshStatus)
    return () => window.removeEventListener(DRIVE_BACKUP_STATUS, refreshStatus)
  }, [refreshStatus])

  const fail = (error: unknown) => {
    const text = error instanceof Error ? error.message : "Something went wrong."
    if (error instanceof DriveError && error.kind === "auth") setConnected(false)
    setMessage({ tone: "error", text })
  }

  const loadFiles = useCallback(async () => {
    const client = driveClient({ interactive: false })
    setFiles(await client.list())
  }, [])

  // If this tab already has a token (e.g. came back from another tools page), load the list.
  useEffect(() => {
    if (!hasValidToken()) return
    const client = driveClient({ interactive: false })
    Promise.all([client.accountEmail(), client.list()])
      .then(([mail, list]) => {
        setEmail(mail)
        setFiles(list)
      })
      .catch(fail)
  }, [])

  const connect = async () => {
    setBusy("connect")
    setMessage(null)
    try {
      await getAccessToken({ interactive: true })
      const client = driveClient({ interactive: true })
      const [mail, list] = await Promise.all([client.accountEmail(), client.list()])
      setConnected(true)
      setEmail(mail)
      setFiles(list)
      setReconnectHint(true)
    } catch (error) {
      fail(error)
    } finally {
      setBusy(null)
    }
  }

  const disconnect = async () => {
    if (!confirm("Disconnect Google Drive? Backups already in your Drive stay there, and you can reconnect later.")) return
    await disconnectDrive()
    setAutoBackupEnabled(false)
    setConnected(false)
    setEmail(null)
    setFiles(null)
    setReconnectHint(false)
    setMessage({ tone: "success", text: "Disconnected from Google Drive." })
  }

  const backupNow = async () => {
    setBusy("backup")
    setMessage(null)
    try {
      const backup = buildBackup()
      await driveClient({ interactive: true }).upload(backup)
      markDriveBackedUp(backup.exportedAt)
      await loadFiles()
      setMessage({ tone: "success", text: "Backed up to Google Drive." })
    } catch (error) {
      fail(error)
    } finally {
      setBusy(null)
    }
  }

  const openDriveBackup = async (file: DriveBackupFile) => {
    setBusy(`open-${file.id}`)
    setMessage(null)
    try {
      const result = validateBackup(await driveClient({ interactive: true }).download(file.id))
      if (!result.ok) throw new Error(result.error)
      setRestoring({ backup: result.backup, label: "Google Drive backup" })
    } catch (error) {
      fail(error)
    } finally {
      setBusy(null)
    }
  }

  const deleteDriveBackup = async (file: DriveBackupFile) => {
    if (!confirm(`Delete the backup from ${formatWhen(file.createdTime)}? This removes it from your Google Drive.`)) return
    setBusy(`delete-${file.id}`)
    try {
      await driveClient({ interactive: true }).remove(file.id)
      setFiles((prev) => prev?.filter((f) => f.id !== file.id) ?? null)
    } catch (error) {
      fail(error)
    } finally {
      setBusy(null)
    }
  }

  const exportFile = () => {
    const backup = buildBackup()
    downloadBackupFile(backup)
    const counts = countsText(summarizeBackup(backup).counts)
    setMessage({ tone: "success", text: `Downloaded a backup file (${counts}).` })
  }

  const importFile = async (file: File) => {
    setMessage(null)
    try {
      const result = validateBackup(JSON.parse(await file.text()))
      if (!result.ok) throw new Error(result.error)
      setRestoring({ backup: result.backup, label: file.name })
    } catch (error) {
      fail(error instanceof SyntaxError ? new Error("That file isn't valid JSON.") : error)
    }
  }

  const confirmRestore = async (mode: "merge" | "replace") => {
    if (!restoring) return
    restoreBackup(restoring.backup, mode)
    const counts = countsText(summarizeBackup(restoring.backup).counts)
    setRestoring(null)
    setMessage({
      tone: "success",
      text: mode === "replace" ? `Restored: this device now matches the backup (${counts}).` : `Merged the backup into this device (${counts}).`,
    })
  }

  const toggleAuto = (on: boolean) => {
    setAutoBackupEnabled(on)
    setAutoBackup(on)
  }

  return (
    <>
      <ToolsPageHeader
        backHref="/tools"
        backLabel="Back to Tools"
        title="Backup & Restore"
        subtitle="Your tools data lives only in this browser. Back it up to your own Google Drive or a file so you don't lose it, and to move it to another device."
      />

      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12 md:py-16 space-y-8">
        {message && (
          <div
            role={message.tone === "error" ? "alert" : "status"}
            className={`flex items-start justify-between gap-4 rounded-xl border px-4 py-3 text-sm ${
              message.tone === "error"
                ? "border-destructive/30 bg-destructive/10 text-destructive"
                : "border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-300"
            }`}
          >
            <span>{message.text}</span>
            <button type="button" onClick={() => setMessage(null)} aria-label="Dismiss" className="opacity-70 hover:opacity-100">
              ×
            </button>
          </div>
        )}

        {/* Google Drive */}
        <section className="rounded-2xl border border-border bg-card/60 p-5 sm:p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-purple-500/10">
              <Cloud className="size-5 text-purple-400" />
            </div>
            <div className="min-w-0">
              <h2 className="text-xl font-semibold">Google Drive</h2>
              <p className="text-sm text-muted-foreground truncate">
                {connected && email ? `Connected as ${email}` : "Back up to a private folder in your own Drive"}
              </p>
            </div>
          </div>

          {!configured ? (
            <p className="flex items-start gap-2 rounded-xl bg-muted/60 px-4 py-3 text-sm text-muted-foreground">
              <CloudOff className="size-4 shrink-0 mt-0.5" />
              Google Drive backup isn&apos;t set up on this site yet. You can still back up to a file below.
            </p>
          ) : !connected ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Backups go into a hidden app folder in your Google Drive. This site can only see the backups it creates there, not your other files.
                Your Google sign-in is kept only while this tab is open.
              </p>
              {pending && (
                <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-300">
                  You have changes that haven&apos;t been backed up. Connect to back them up.
                </p>
              )}
              <button type="button" onClick={connect} disabled={busy === "connect"} className={primaryButton}>
                {busy === "connect" ? <Loader2 className="size-4 animate-spin" /> : <Cloud className="size-4" />}
                {reconnectHint ? "Reconnect Google Drive" : "Connect Google Drive"}
              </button>
              {lastBackup && <p className="text-xs text-muted-foreground">Last backup from this browser: {formatWhen(lastBackup)}</p>}
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <button type="button" onClick={backupNow} disabled={!!busy} className={primaryButton}>
                  {busy === "backup" ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
                  Back up now
                </button>
                <button type="button" onClick={() => loadFiles().catch(fail)} disabled={!!busy} className={ghostButton}>
                  <RefreshCw className="size-4" />
                  Refresh
                </button>
                <button type="button" onClick={disconnect} disabled={!!busy} className={`${ghostButton} sm:ml-auto`}>
                  Disconnect
                </button>
              </div>

              <p className="text-sm text-muted-foreground">
                Last backup: <span className="text-foreground">{formatWhen(lastBackup)}</span>
                {pending && <span className="ml-2 text-amber-600 dark:text-amber-400">· changes not backed up yet</span>}
              </p>

              <label className="flex items-start gap-3 rounded-xl border border-border p-3 text-sm">
                <input type="checkbox" checked={autoBackup} onChange={(e) => toggleAuto(e.target.checked)} className="mt-0.5 accent-purple-500" />
                <span>
                  <span className="font-medium">Back up automatically</span>
                  <span className="block text-muted-foreground">
                    While this tab stays connected, back up 30 seconds after you change anything. Keeps the newest {MAX_DRIVE_BACKUPS} backups.
                  </span>
                </span>
              </label>

              <div>
                <h3 className="mb-2 font-mono text-[11px] tracking-widest text-muted-foreground uppercase">Backups in your Drive</h3>
                {files === null ? (
                  <p className="text-sm text-muted-foreground">Loading…</p>
                ) : files.length === 0 ? (
                  <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                    No backups yet. Use “Back up now” to make the first one.
                  </p>
                ) : (
                  <ul className="divide-y divide-border/60 overflow-hidden rounded-xl border border-border">
                    {files.map((file, i) => (
                      <li key={file.id} className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium">
                            {formatWhen(file.createdTime)}
                            {i === 0 && <span className="ml-2 rounded-full bg-purple-500/10 px-2 py-0.5 text-xs text-purple-500">Latest</span>}
                            {file.auto && <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">Auto</span>}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {countsText(file.counts)} · {formatSize(file.size)}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button type="button" onClick={() => openDriveBackup(file)} disabled={!!busy} className={ghostButton}>
                            {busy === `open-${file.id}` ? <Loader2 className="size-4 animate-spin" /> : <RotateCcw className="size-4" />}
                            Restore
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteDriveBackup(file)}
                            disabled={!!busy}
                            aria-label={`Delete backup from ${formatWhen(file.createdTime)}`}
                            className={`${ghostButton} text-destructive hover:bg-destructive/10`}
                          >
                            {busy === `delete-${file.id}` ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </section>

        {/* File */}
        <section className="rounded-2xl border border-border bg-card/60 p-5 sm:p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-purple-500/10">
              <HardDrive className="size-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Backup file</h2>
              <p className="text-sm text-muted-foreground">Save a .json file, or restore from one</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={exportFile} className={ghostButton}>
              <Download className="size-4" />
              Download backup file
            </button>
            <button type="button" onClick={() => fileInput.current?.click()} className={ghostButton}>
              <Upload className="size-4" />
              Restore from file
            </button>
            <input
              ref={fileInput}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                e.target.value = ""
                if (file) importFile(file)
              }}
            />
          </div>
        </section>

        <p className="flex items-start gap-2 text-sm text-muted-foreground">
          <ShieldCheck className="size-4 shrink-0 mt-0.5" />
          Your data never passes through this website&apos;s servers. It stays in your browser, your own Google Drive, and any files you download.
        </p>
        {connected && (
          <p className="flex items-start gap-2 text-xs text-muted-foreground">
            <CheckCircle2 className="size-4 shrink-0" />
            Restoring a backup does not delete anything from Google Drive.
          </p>
        )}
      </div>

      {restoring && (
        <RestoreBackupDialog
          backup={restoring.backup}
          sourceLabel={restoring.label}
          onCancel={() => setRestoring(null)}
          onConfirm={confirmRestore}
        />
      )}
    </>
  )
}
