"use client"

import { useEffect, useRef } from "react"
import { TOOLS_DATA_CHANGED } from "@/lib/storage/change-events"
import { buildBackup } from "@/lib/tools/backup"
import { driveClient, hasValidToken } from "@/lib/tools/google-drive"
import {
  isAutoBackupEnabled,
  markDriveBackedUp,
  markPendingChanges,
} from "@/lib/tools/drive-backup-state"

const DEBOUNCE_MS = 30_000

/**
 * Backs up to Google Drive 30 seconds after the last change, while auto-backup
 * is on and this tab is connected. It never opens a sign-in popup on its own;
 * if not connected, it remembers that there are changes to back up.
 */
export function DriveAutoBackup() {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const running = useRef(false)

  useEffect(() => {
    const run = async () => {
      timer.current = null
      if (running.current) {
        timer.current = setTimeout(run, DEBOUNCE_MS)
        return
      }
      if (!isAutoBackupEnabled()) return
      if (!hasValidToken()) {
        markPendingChanges()
        return
      }
      running.current = true
      try {
        const backup = buildBackup()
        await driveClient({ interactive: false }).upload(backup, { auto: true })
        markDriveBackedUp(backup.exportedAt)
      } catch {
        markPendingChanges()
      } finally {
        running.current = false
      }
    }

    const onChange = () => {
      if (!isAutoBackupEnabled()) return
      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(run, DEBOUNCE_MS)
    }

    window.addEventListener(TOOLS_DATA_CHANGED, onChange)
    return () => {
      window.removeEventListener(TOOLS_DATA_CHANGED, onChange)
      if (timer.current) clearTimeout(timer.current)
    }
  }, [])

  return null
}
