// Google Drive backup for /tools, entirely in the browser.
//
// Uses Google Identity Services (token model) for a short-lived access token
// with the narrow `drive.appdata` scope: the app can only see files it puts in
// its own hidden folder in the visitor's Drive. The token lives in memory only.
import type { ToolsBackup } from "./backup"
import { summarizeBackup } from "./backup"

export const DRIVE_SCOPE = "https://www.googleapis.com/auth/drive.appdata"
export const MAX_DRIVE_BACKUPS = 10
const GIS_SRC = "https://accounts.google.com/gsi/client"
const API = "https://www.googleapis.com/drive/v3"
const UPLOAD_API = "https://www.googleapis.com/upload/drive/v3"
const FILE_FIELDS = "id,name,size,createdTime,appProperties"

export const googleClientId = (): string | undefined =>
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || undefined

export interface DriveBackupFile {
  id: string
  name: string
  size: number
  createdTime: string
  counts: Record<string, number>
  auto: boolean
}

export class DriveError extends Error {
  constructor(
    message: string,
    readonly kind: "not_configured" | "popup" | "denied" | "auth" | "network" | "api",
  ) {
    super(message)
  }
}

// ---------- Minimal Google Identity Services types ----------
interface TokenResponse {
  access_token?: string
  expires_in?: number | string
  scope?: string
  error?: string
  error_description?: string
}
interface TokenClient {
  requestAccessToken(options?: { prompt?: string }): void
}
interface GoogleOAuth2 {
  initTokenClient(config: {
    client_id: string
    scope: string
    callback: (response: TokenResponse) => void
    error_callback?: (error: { type: string; message?: string }) => void
  }): TokenClient
  hasGrantedAllScopes(response: TokenResponse, ...scopes: string[]): boolean
  revoke(token: string, done?: () => void): void
}
declare global {
  interface Window {
    google?: { accounts?: { oauth2?: GoogleOAuth2 } }
  }
}

// ---------- Pure helpers (unit tested) ----------

/** appProperties are limited to 124 bytes per pair, so keep them short. */
export function backupAppProperties(backup: ToolsBackup, auto: boolean): Record<string, string> {
  const { counts } = summarizeBackup(backup)
  const props: Record<string, string> = {
    app: backup.app,
    v: String(backup.schemaVersion),
    auto: auto ? "1" : "0",
  }
  for (const [key, n] of Object.entries(counts)) props[`n_${key}`.slice(0, 40)] = String(n)
  return props
}

export function parseDriveFile(raw: {
  id: string
  name: string
  size?: string | number
  createdTime: string
  appProperties?: Record<string, string>
}): DriveBackupFile {
  const counts: Record<string, number> = {}
  for (const [key, value] of Object.entries(raw.appProperties ?? {})) {
    if (key.startsWith("n_")) counts[key.slice(2)] = Number(value) || 0
  }
  return {
    id: raw.id,
    name: raw.name,
    size: Number(raw.size ?? 0),
    createdTime: raw.createdTime,
    counts,
    auto: raw.appProperties?.auto === "1",
  }
}

/** Files to delete so only the newest `keep` remain. */
export function filesToPrune(files: Pick<DriveBackupFile, "id" | "createdTime">[], keep = MAX_DRIVE_BACKUPS): string[] {
  return [...files]
    .sort((a, b) => b.createdTime.localeCompare(a.createdTime))
    .slice(keep)
    .map((f) => f.id)
}

export function multipartBody(metadata: object, json: string, boundary: string): string {
  return [
    `--${boundary}`,
    "Content-Type: application/json; charset=UTF-8",
    "",
    JSON.stringify(metadata),
    `--${boundary}`,
    "Content-Type: application/json",
    "",
    json,
    `--${boundary}--`,
    "",
  ].join("\r\n")
}

// ---------- Drive REST client ----------

type Fetch = typeof fetch

/**
 * Thin Drive v3 client. `getToken(forceRefresh)` supplies an access token; on
 * a 401 the request is retried once with a fresh token.
 */
export class DriveClient {
  constructor(
    private readonly getToken: (forceRefresh: boolean) => Promise<string>,
    private readonly fetchImpl: Fetch = (...args) => fetch(...args),
  ) {}

  private async request(url: string, init: RequestInit = {}, retried = false): Promise<Response> {
    const token = await this.getToken(retried)
    let res: Response
    try {
      res = await this.fetchImpl(url, {
        ...init,
        headers: { ...(init.headers as Record<string, string>), Authorization: `Bearer ${token}` },
      })
    } catch {
      throw new DriveError("Couldn't reach Google Drive. Check your connection and try again.", "network")
    }
    if (res.status === 401 && !retried) return this.request(url, init, true)
    if (res.status === 401) throw new DriveError("Google sign-in expired. Connect again.", "auth")
    if (!res.ok) {
      let detail = ""
      try {
        detail = (await res.json())?.error?.message ?? ""
      } catch {
        /* ignore */
      }
      throw new DriveError(`Google Drive error ${res.status}${detail ? `: ${detail}` : ""}`, "api")
    }
    return res
  }

  async accountEmail(): Promise<string | null> {
    const res = await this.request(`${API}/about?fields=user(emailAddress)`)
    return (await res.json())?.user?.emailAddress ?? null
  }

  async list(): Promise<DriveBackupFile[]> {
    const params = new URLSearchParams({
      spaces: "appDataFolder",
      fields: `files(${FILE_FIELDS})`,
      orderBy: "createdTime desc",
      pageSize: "100",
      q: "trashed = false and appProperties has { key='app' and value='mixin27-tools' }",
    })
    const res = await this.request(`${API}/files?${params}`)
    const body = (await res.json()) as { files?: Parameters<typeof parseDriveFile>[0][] }
    return (body.files ?? []).map(parseDriveFile)
  }

  async upload(backup: ToolsBackup, options: { auto?: boolean } = {}): Promise<DriveBackupFile> {
    const boundary = `tools-${Math.random().toString(36).slice(2)}`
    const name = `tools-backup-${backup.exportedAt.replace(/[:.]/g, "-")}.json`
    const metadata = {
      name,
      parents: ["appDataFolder"],
      mimeType: "application/json",
      appProperties: backupAppProperties(backup, !!options.auto),
    }
    const res = await this.request(
      `${UPLOAD_API}/files?uploadType=multipart&fields=${encodeURIComponent(FILE_FIELDS)}`,
      {
        method: "POST",
        headers: { "Content-Type": `multipart/related; boundary=${boundary}` },
        body: multipartBody(metadata, JSON.stringify(backup), boundary),
      },
    )
    const file = parseDriveFile(await res.json())
    await this.prune()
    return file
  }

  async download(id: string): Promise<unknown> {
    const res = await this.request(`${API}/files/${encodeURIComponent(id)}?alt=media`)
    return res.json()
  }

  async remove(id: string): Promise<void> {
    await this.request(`${API}/files/${encodeURIComponent(id)}`, { method: "DELETE" })
  }

  /** Keep only the newest backups. Failures here never fail the upload. */
  async prune(keep = MAX_DRIVE_BACKUPS): Promise<void> {
    try {
      const ids = filesToPrune(await this.list(), keep)
      for (const id of ids) await this.remove(id)
    } catch {
      /* best effort */
    }
  }
}

// ---------- Browser session (token in memory) ----------

const CONNECTED_HINT_KEY = "tools_drive_connected"

let gisPromise: Promise<GoogleOAuth2> | null = null
let token: { value: string; expiresAt: number } | null = null

function loadGis(): Promise<GoogleOAuth2> {
  if (window.google?.accounts?.oauth2) return Promise.resolve(window.google.accounts.oauth2)
  if (!gisPromise) {
    gisPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script")
      script.src = GIS_SRC
      script.async = true
      script.onload = () =>
        window.google?.accounts?.oauth2
          ? resolve(window.google.accounts.oauth2)
          : reject(new DriveError("Google sign-in didn't load.", "network"))
      script.onerror = () => {
        gisPromise = null
        reject(new DriveError("Couldn't load Google sign-in. Check your connection or ad blocker.", "network"))
      }
      document.head.appendChild(script)
    })
  }
  return gisPromise
}

/**
 * Load Google's sign-in script ahead of time, so the popup opens straight
 * from the click (browsers block popups that open too long after one).
 */
export function preloadGoogleSignIn(): void {
  if (typeof window === "undefined" || !googleClientId()) return
  loadGis().catch(() => {
    /* reported when the user clicks Connect */
  })
}

/** True while we hold an access token that is valid for at least a minute. */
export function hasValidToken(): boolean {
  return !!token && token.expiresAt - Date.now() > 60_000
}

/** Whether this browser connected to Drive before (a hint only, no token). */
export function wasConnected(): boolean {
  try {
    return localStorage.getItem(CONNECTED_HINT_KEY) === "1"
  } catch {
    return false
  }
}

function setConnectedHint(on: boolean) {
  try {
    if (on) localStorage.setItem(CONNECTED_HINT_KEY, "1")
    else localStorage.removeItem(CONNECTED_HINT_KEY)
  } catch {
    /* ignore */
  }
}

/**
 * Get an access token. Must be called from a user action (click) the first
 * time, because Google opens a popup. Later calls reuse the token in memory.
 */
export async function getAccessToken(options: { forceRefresh?: boolean; interactive?: boolean } = {}): Promise<string> {
  if (!options.forceRefresh && token && hasValidToken()) return token.value
  if (options.interactive === false) {
    throw new DriveError("Connect Google Drive to continue.", "auth")
  }
  const clientId = googleClientId()
  if (!clientId) throw new DriveError("Google Drive backup isn't set up on this site.", "not_configured")
  const oauth2 = await loadGis()

  return new Promise<string>((resolve, reject) => {
    const client = oauth2.initTokenClient({
      client_id: clientId,
      scope: DRIVE_SCOPE,
      callback: (response) => {
        if (response.error || !response.access_token) {
          reject(new DriveError(response.error_description || "Google didn't grant access.", "denied"))
          return
        }
        if (!oauth2.hasGrantedAllScopes(response, DRIVE_SCOPE)) {
          reject(new DriveError("Drive access wasn't granted, so backups can't be saved.", "denied"))
          return
        }
        token = {
          value: response.access_token,
          expiresAt: Date.now() + Number(response.expires_in ?? 3600) * 1000,
        }
        setConnectedHint(true)
        resolve(token.value)
      },
      error_callback: (error) => {
        reject(
          new DriveError(
            error.type === "popup_failed_to_open"
              ? "Your browser blocked the Google sign-in popup. Allow popups for this site and try again."
              : "Google sign-in was closed before it finished.",
            "popup",
          ),
        )
      },
    })
    // Skip the consent screen if this browser already granted access before.
    client.requestAccessToken({ prompt: wasConnected() ? "" : "consent" })
  })
}

/** A Drive client that asks for a token only when needed. */
export function driveClient(options: { interactive?: boolean } = {}): DriveClient {
  return new DriveClient((forceRefresh) =>
    getAccessToken({ forceRefresh, interactive: options.interactive }),
  )
}

/** Revoke access and forget the token. Backups already in Drive stay there. */
export async function disconnectDrive(): Promise<void> {
  const current = token?.value
  token = null
  setConnectedHint(false)
  if (current && window.google?.accounts?.oauth2) {
    await new Promise<void>((resolve) => window.google!.accounts!.oauth2!.revoke(current, resolve))
  }
}
