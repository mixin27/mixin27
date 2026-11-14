// Lets other parts of /tools (e.g. Drive auto-backup) know local data changed.
export const TOOLS_DATA_CHANGED = "tools-data-changed"

export function notifyToolsDataChanged(key: string): void {
  if (typeof window === "undefined") return
  window.dispatchEvent(new CustomEvent(TOOLS_DATA_CHANGED, { detail: { key } }))
}
