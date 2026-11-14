import { describe, expect, it, vi } from "vitest"
import { BACKUP_APP_ID, type ToolsBackup } from "../backup"
import {
  DriveClient,
  DriveError,
  backupAppProperties,
  filesToPrune,
  multipartBody,
  parseDriveFile,
} from "../google-drive"

const backup: ToolsBackup = {
  app: BACKUP_APP_ID,
  schemaVersion: 1,
  exportedAt: "2026-11-14T10:00:00.000Z",
  data: { clients: [{ id: "c1" }, { id: "c2" }], invoices: [{ id: "i1" }], invoice_settings: { businessName: "x" } },
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } })

describe("drive helpers", () => {
  it("stores counts in short appProperties and reads them back", () => {
    const props = backupAppProperties(backup, true)
    expect(props).toEqual({ app: BACKUP_APP_ID, v: "1", auto: "1", n_clients: "2", n_invoices: "1" })
    for (const [k, v] of Object.entries(props)) expect(new TextEncoder().encode(k + v).length).toBeLessThanOrEqual(124)
    const file = parseDriveFile({ id: "f", name: "n", size: "42", createdTime: "t", appProperties: props })
    expect(file).toEqual({ id: "f", name: "n", size: 42, createdTime: "t", counts: { clients: 2, invoices: 1 }, auto: true })
  })

  it("prunes all but the newest backups", () => {
    const files = Array.from({ length: 12 }, (_, i) => ({ id: `f${i}`, createdTime: `2026-11-${String(i + 1).padStart(2, "0")}` }))
    expect(filesToPrune(files, 10)).toEqual(["f1", "f0"])
    expect(filesToPrune(files.slice(0, 3), 10)).toEqual([])
  })

  it("builds a multipart body with metadata then content", () => {
    const body = multipartBody({ name: "a" }, '{"x":1}', "B")
    expect(body).toBe('--B\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n{"name":"a"}\r\n--B\r\nContent-Type: application/json\r\n\r\n{"x":1}\r\n--B--\r\n')
  })
})

describe("DriveClient", () => {
  it("retries once with a fresh token after a 401", async () => {
    const getToken = vi.fn(async (refresh: boolean) => (refresh ? "new" : "old"))
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(new Response("", { status: 401 }))
      .mockResolvedValueOnce(json({ user: { emailAddress: "me@example.com" } }))
    const client = new DriveClient(getToken, fetchImpl as unknown as typeof fetch)
    await expect(client.accountEmail()).resolves.toBe("me@example.com")
    expect(getToken.mock.calls).toEqual([[false], [true]])
    expect(fetchImpl.mock.calls[1][1].headers.Authorization).toBe("Bearer new")
  })

  it("gives up after a second 401 and reports API errors", async () => {
    const unauthorised = new DriveClient(async () => "t", (async () => new Response("", { status: 401 })) as typeof fetch)
    await expect(unauthorised.list()).rejects.toMatchObject({ kind: "auth" })
    const failing = new DriveClient(async () => "t", (async () => json({ error: { message: "quota" } }, 403)) as typeof fetch)
    await expect(failing.list()).rejects.toThrow("Google Drive error 403: quota")
    const offline = new DriveClient(async () => "t", (async () => { throw new TypeError("offline") }) as typeof fetch)
    await expect(offline.list()).rejects.toBeInstanceOf(DriveError)
  })

  it("uploads into appDataFolder and prunes old backups", async () => {
    const calls: { url: string; init?: RequestInit }[] = []
    const old = Array.from({ length: 11 }, (_, i) => ({ id: `f${i}`, name: "n", createdTime: `2026-10-${String(i + 1).padStart(2, "0")}`, appProperties: { app: BACKUP_APP_ID } }))
    const fetchImpl = (async (url: string, init?: RequestInit) => {
      calls.push({ url, init })
      if (url.includes("/upload/")) return json({ id: "new", name: "n", size: "10", createdTime: "2026-11-14", appProperties: { app: BACKUP_APP_ID, auto: "0" } })
      if (init?.method === "DELETE") return new Response(null, { status: 204 })
      return json({ files: old })
    }) as typeof fetch
    const client = new DriveClient(async () => "t", fetchImpl)
    const file = await client.upload(backup)
    expect(file.id).toBe("new")
    const body = String(calls[0].init?.body)
    expect(body).toContain('"parents":["appDataFolder"]')
    expect(body).toContain('"exportedAt":"2026-11-14T10:00:00.000Z"')
    expect(calls[1].url).toContain("spaces=appDataFolder")
    expect(calls.filter((c) => c.init?.method === "DELETE").map((c) => c.url.split("/").pop())).toEqual(["f0"])
  })
})
