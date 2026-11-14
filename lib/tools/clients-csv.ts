import { v7 as uuidv7 } from "uuid"
import type { Client } from "@/types/invoice"
import { parseCsvObjects, toCsv } from "./csv"

const COLUMNS: { key: keyof Client; header: string; aliases: string[] }[] = [
  { key: "name", header: "Name", aliases: ["name", "client", "clientname", "company"] },
  { key: "email", header: "Email", aliases: ["email", "emailaddress", "mail"] },
  { key: "phone", header: "Phone", aliases: ["phone", "phonenumber", "mobile", "tel"] },
  { key: "address", header: "Address", aliases: ["address", "street", "streetaddress"] },
  { key: "city", header: "City", aliases: ["city", "town"] },
  { key: "state", header: "State", aliases: ["state", "province", "region"] },
  { key: "zipCode", header: "Zip Code", aliases: ["zipcode", "zip", "postalcode", "postcode"] },
  { key: "country", header: "Country", aliases: ["country"] },
  { key: "taxId", header: "Tax ID", aliases: ["taxid", "vat", "vatnumber", "tin"] },
]

export function clientsToCsv(clients: Client[]): string {
  return toCsv(
    COLUMNS.map((c) => c.header),
    clients.map((client) => COLUMNS.map((c) => client[c.key] ?? "")),
  )
}

export interface ClientImportResult {
  added: Client[]
  skipped: { row: number; reason: string }[]
}

/**
 * Turn CSV text into new clients. Rows without a name are skipped, and so are
 * rows whose email already exists (in `existing` or earlier in the file).
 */
export function clientsFromCsv(
  text: string,
  existing: Client[],
  now: Date = new Date(),
): ClientImportResult {
  const rows = parseCsvObjects(text)
  const seenEmails = new Set(
    existing.map((c) => c.email?.trim().toLowerCase()).filter(Boolean),
  )
  const added: Client[] = []
  const skipped: ClientImportResult["skipped"] = []

  rows.forEach((row, index) => {
    const value = (key: keyof Client) => {
      const column = COLUMNS.find((c) => c.key === key)!
      const alias = column.aliases.find((a) => row[a])
      return alias ? row[alias].replace(/^'(?=[=+\-@])/, "") : ""
    }
    const name = value("name")
    const email = value("email")
    const rowNumber = index + 2 // header is row 1
    if (!name) {
      skipped.push({ row: rowNumber, reason: "missing name" })
      return
    }
    const emailKey = email.toLowerCase()
    if (emailKey && seenEmails.has(emailKey)) {
      skipped.push({ row: rowNumber, reason: `${email} already exists` })
      return
    }
    if (emailKey) seenEmails.add(emailKey)

    const client: Client = { id: uuidv7(), name, email, createdAt: now.toISOString() }
    for (const column of COLUMNS) {
      if (column.key === "name" || column.key === "email") continue
      const v = value(column.key)
      if (v) (client as unknown as Record<string, string>)[column.key] = v
    }
    added.push(client)
  })

  return { added, skipped }
}
