/**
 * Hybrid Storage System
 * Uses localStorage as primary storage with optional cloud sync
 */

// Storage keys
export const STORAGE_KEYS = {
  SYNC_ENABLED: "cloud_sync_enabled",
  LAST_SYNC: "last_cloud_sync",
  SYNC_STATUS: "sync_status",
} as const

// Check if cloud sync is enabled
export function isSyncEnabled(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem(STORAGE_KEYS.SYNC_ENABLED) === "true"
}

// Enable/disable cloud sync
export function setSyncEnabled(enabled: boolean): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEYS.SYNC_ENABLED, enabled.toString())
}

// Get last sync timestamp
export function getLastSyncTime(): Date | null {
  if (typeof window === "undefined") return null
  const timestamp = localStorage.getItem(STORAGE_KEYS.LAST_SYNC)
  return timestamp ? new Date(timestamp) : null
}

// Update last sync timestamp
export function updateLastSyncTime(): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString())
}

// Sync status type
export type SyncStatus = "idle" | "syncing" | "success" | "error"

// Get sync status
export function getSyncStatus(): SyncStatus {
  if (typeof window === "undefined") return "idle"
  return (
    (localStorage.getItem(STORAGE_KEYS.SYNC_STATUS) as SyncStatus) || "idle"
  )
}

// Set sync status
export function setSyncStatus(status: SyncStatus): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEYS.SYNC_STATUS, status)
}

// Generic hybrid storage operation
export async function hybridOperation<T>(
  localOperation: () => T,
  cloudOperation?: () => Promise<void>,
): Promise<T> {
  // Always perform local operation first
  const result = localOperation()

  // If sync is enabled, perform cloud operation in background
  if (isSyncEnabled() && cloudOperation) {
    cloudOperation().catch((error) => {
      console.error("Cloud sync failed:", error)
      setSyncStatus("error")
    })
  }

  return result
}

// Sync all data to cloud
export async function syncToCloud() {
  if (typeof window === "undefined") return

  setSyncStatus("syncing")

  try {
    // Get all localStorage data
    const data = {
      invoices: JSON.parse(localStorage.getItem("invoices") || "[]"),
      clients: JSON.parse(localStorage.getItem("clients") || "[]"),
      quotations: JSON.parse(localStorage.getItem("quotations") || "[]"),
      receipts: JSON.parse(localStorage.getItem("receipts") || "[]"),
      contracts: JSON.parse(localStorage.getItem("contracts") || "[]"),
      timeEntries: JSON.parse(localStorage.getItem("time_entries") || "[]"),
      resumes: JSON.parse(localStorage.getItem("resumes") || "[]"),
      settings: JSON.parse(localStorage.getItem("invoice_settings") || "null"),
    }

    // Count items for reporting
    const counts = {
      invoices: data.invoices.length,
      clients: data.clients.length,
      quotations: data.quotations.length,
      receipts: data.receipts.length,
      contracts: data.contracts.length,
      timeEntries: data.timeEntries.length,
      resumes: data.resumes.length,
    }

    // Sync to cloud API
    const response = await fetch("/api/sync/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error("Sync failed")
    }

    updateLastSyncTime()
    setSyncStatus("success")

    return counts
  } catch (error) {
    console.error("Sync to cloud failed:", error)
    setSyncStatus("error")
    throw error
  }
}

// Sync from cloud to local
export async function syncFromCloud() {
  if (typeof window === "undefined") return

  setSyncStatus("syncing")

  try {
    const response = await fetch("/api/sync/download")
    const data = await response.json()

    // Update localStorage with cloud data
    if (data.invoices)
      localStorage.setItem("invoices", JSON.stringify(data.invoices))
    if (data.clients)
      localStorage.setItem("clients", JSON.stringify(data.clients))
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

    updateLastSyncTime()
    setSyncStatus("success")
  } catch (error) {
    console.error("Sync from cloud failed:", error)
    setSyncStatus("error")
    throw error
  }
}

// Auto-sync on data change (debounced)
let syncTimeout: NodeJS.Timeout | null = null

export function triggerAutoSync() {
  if (!isSyncEnabled()) return

  // Debounce: wait 2 seconds after last change
  if (syncTimeout) clearTimeout(syncTimeout)

  syncTimeout = setTimeout(() => {
    syncToCloud().catch(console.error)
  }, 2000)
}
