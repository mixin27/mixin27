// Small per-browser preferences and status for Drive backups (no tokens here).
const AUTO_KEY = "tools_drive_auto_backup"
const LAST_KEY = "tools_drive_last_backup"
const PENDING_KEY = "tools_drive_backup_pending"
export const DRIVE_BACKUP_STATUS = "tools-drive-backup-status"

function read(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}
function write(key: string, value: string | null) {
  try {
    if (value === null) localStorage.removeItem(key)
    else localStorage.setItem(key, value)
  } catch {
    /* storage unavailable */
  }
  window.dispatchEvent(new Event(DRIVE_BACKUP_STATUS))
}

export const isAutoBackupEnabled = () => read(AUTO_KEY) === "1"
export const setAutoBackupEnabled = (on: boolean) => write(AUTO_KEY, on ? "1" : null)

export const lastDriveBackupAt = () => read(LAST_KEY)
export const markDriveBackedUp = (iso: string) => {
  write(LAST_KEY, iso)
  write(PENDING_KEY, null)
}

/** Changes made while auto-backup couldn't run (not connected this session). */
export const hasPendingChanges = () => read(PENDING_KEY) === "1"
export const markPendingChanges = () => write(PENDING_KEY, "1")
