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

// API base URL
const API_BASE = "/api"

// Helper function for API calls
async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.error || "API call failed")
  }

  return response.json()
}

/**
 * Hybrid storage operation for saving data
 * Saves to localStorage first, then syncs to cloud in background
 */
export async function hybridSave<T extends { id: string }>(
  storageKey: string,
  item: T,
  apiEndpoint: string,
): Promise<void> {
  // Save to localStorage first (fast, offline-first)
  const items = getFromStorage<T>(storageKey)
  const existingIndex = items.findIndex((i) => i.id === item.id)

  if (existingIndex >= 0) {
    items[existingIndex] = {
      ...item,
      updatedAt: new Date().toISOString(),
    }
  } else {
    items.push(item)
  }

  saveToStorage(storageKey, items)

  // Sync to cloud in background if enabled
  if (isSyncEnabled()) {
    // Perform cloud sync in background
    apiCall(apiEndpoint, {
      method: "POST",
      body: JSON.stringify(item),
    })
      .then(() => {
        triggerAutoSync()
      })
      .catch((error) => {
        console.error(`Failed to sync ${storageKey} to cloud:`, error)
        // Don't throw - local save succeeded
      })
  }
}

/**
 * Hybrid storage operation for getting all items
 * Reads from localStorage first, can optionally sync from cloud
 */
export async function hybridGetAll<T>(
  storageKey: string,
  apiEndpoint: string,
  syncFromCloud = false,
): Promise<T[]> {
  // Always return from localStorage (fast, works offline)
  const localData = getFromStorage<T>(storageKey)

  // If sync is enabled and we want to sync, initiate cloud fetch in background
  if (isSyncEnabled() && syncFromCloud) {
    apiCall<T[]>(apiEndpoint)
      .then((cloudData) => {
        saveToStorage(storageKey, cloudData)
        // Optionally, trigger a UI update here if needed, e.g., via a custom event
      })
      .catch((error) => {
        console.error(`Failed to sync ${storageKey} from cloud:`, error)
      })
  }

  return localData
}

/**
 * Hybrid storage operation for getting a single item
 */
export async function hybridGetById<T extends { id: string }>(
  storageKey: string,
  id: string,
  apiEndpoint: string,
): Promise<T | null> {
  // Try localStorage first
  const items = getFromStorage<T>(storageKey)
  const item = items.find((i) => i.id === id)

  // Always return from localStorage if found (fast, works offline)
  if (item) {
    return item
  }

  // If not found locally and sync is enabled, initiate cloud fetch in background
  if (isSyncEnabled()) {
    apiCall<T>(`${apiEndpoint}?id=${id}`)
      .then((cloudItem) => {
        // Save to localStorage for next time
        const items = getFromStorage<T>(storageKey)
        const existingIndex = items.findIndex((i) => i.id === cloudItem.id)
        if (existingIndex >= 0) {
          items[existingIndex] = cloudItem
        } else {
          items.push(cloudItem)
        }
        saveToStorage(storageKey, items)
        // Optionally, trigger a UI update here if needed
      })
      .catch((error) => {
        console.error(`Failed to get ${storageKey} from cloud:`, error)
      })
  }

  return null
}

/**
 * Hybrid storage operation for deleting an item
 */
export async function hybridDelete<T extends { id: string }>(
  storageKey: string,
  id: string,
  apiEndpoint: string,
): Promise<void> {
  // Delete from localStorage first
  const items = getFromStorage<T>(storageKey).filter((i) => i.id !== id)
  saveToStorage(storageKey, items)

  // Delete from cloud in background if enabled
  if (isSyncEnabled()) {
    // Perform cloud delete in background
    apiCall(`${apiEndpoint}?id=${id}`, { method: "DELETE" })
      .then(() => {
        triggerAutoSync()
      })
      .catch((error) => {
        console.error(`Failed to delete ${storageKey} from cloud:`, error)
        // Don't throw - local delete succeeded
      })
  }
}

// Helper functions for localStorage operations
function getFromStorage<T>(key: string): T[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : []
}

function saveToStorage<T>(key: string, data: T[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(key, JSON.stringify(data))
}
