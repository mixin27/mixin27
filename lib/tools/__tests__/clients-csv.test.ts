import { describe, expect, it } from "vitest"
import type { Client } from "@/types/invoice"
import { clientsFromCsv, clientsToCsv } from "../clients-csv"
import { parseCsv, toCsv } from "../csv"

describe("csv", () => {
  it("round-trips quotes, commas and newlines", () => {
    const csv = toCsv(["a", "b"], [["x, y", 'say "hi"'], ["line1\nline2", ""]])
    expect(parseCsv(csv)).toEqual([["a", "b"], ["x, y", 'say "hi"'], ["line1\nline2", ""]])
  })

  it("neutralises spreadsheet formulas", () => {
    expect(toCsv(["a"], [["=SUM(A1)"]])).toBe("a\r\n'=SUM(A1)")
  })
})

describe("clients csv", () => {
  const existing: Client[] = [{ id: "c1", name: "Alice", email: "alice@example.com", createdAt: "x" }]

  it("exports and re-imports clients", () => {
    const csv = clientsToCsv([{ ...existing[0], city: "Yangon, MM" }])
    const { added, skipped } = clientsFromCsv(csv, [])
    expect(skipped).toEqual([])
    expect(added[0]).toMatchObject({ name: "Alice", email: "alice@example.com", city: "Yangon, MM" })
  })

  it("accepts header aliases and skips duplicates and nameless rows", () => {
    const csv = [
      "Company,E-mail,Postal Code,VAT",
      "Bob Ltd,bob@example.com,11181,123",
      ",nobody@example.com,,",
      "Alice again,ALICE@example.com,,",
      "Bob dup,bob@example.com,,",
      "No email,,,",
    ].join("\n")
    const { added, skipped } = clientsFromCsv(csv, existing)
    expect(added.map((c) => c.name)).toEqual(["Bob Ltd", "No email"])
    expect(added[0]).toMatchObject({ zipCode: "11181", taxId: "123" })
    expect(skipped.map((s) => s.row)).toEqual([3, 4, 5])
  })
})
