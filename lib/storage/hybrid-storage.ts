// localStorage-only storage operations (cloud sync removed)

function getFromStorage<T>(key: string): T[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : []
}

function saveToStorage<T>(key: string, data: T[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(key, JSON.stringify(data))
}

export async function hybridSave<T extends { id: string }>(
  storageKey: string,
  item: T,
  _apiEndpoint?: string,
): Promise<void> {
  const items = getFromStorage<T>(storageKey)
  const existingIndex = items.findIndex((i) => i.id === item.id)
  if (existingIndex >= 0) {
    items[existingIndex] = { ...item, updatedAt: new Date().toISOString() }
  } else {
    items.push(item)
  }
  saveToStorage(storageKey, items)
}

export async function hybridGetAll<T>(
  storageKey: string,
  _apiEndpoint?: string,
  _syncFromCloud?: boolean,
): Promise<T[]> {
  return getFromStorage<T>(storageKey)
}

export async function hybridGetById<T extends { id: string }>(
  storageKey: string,
  id: string,
  _apiEndpoint?: string,
): Promise<T | null> {
  const items = getFromStorage<T>(storageKey)
  return items.find((i) => i.id === id) ?? null
}

export async function hybridDelete<T extends { id: string }>(
  storageKey: string,
  id: string,
  _apiEndpoint?: string,
): Promise<void> {
  const items = getFromStorage<T>(storageKey).filter((i) => i.id !== id)
  saveToStorage(storageKey, items)
}

export function isSyncEnabled(): boolean {
  return false
}

export function setSyncEnabled(_enabled: boolean): void {}

export function getLastSyncTime(): Date | null {
  return null
}

export function updateLastSyncTime(): void {}

export type SyncStatus = "idle" | "syncing" | "success" | "error"

export function getSyncStatus(): SyncStatus {
  return "idle"
}

export function setSyncStatus(_status: SyncStatus): void {}

export async function syncToCloud(): Promise<void> {}

export async function syncFromCloud(): Promise<void> {}

export function triggerAutoSync(): void {}
