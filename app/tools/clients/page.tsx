"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AlertTriangle, Download, Plus, Search, Upload, Users, Wallet } from "lucide-react"
import { ToolsPageHeader } from "@/components/tools/ClientForm"
import { MoneyMap } from "@/components/tools/money"
import { getClients, loadClientDocuments, saveClient } from "@/lib/storage/tools-storage"
import {
  isMoneyEmpty,
  primaryAmount,
  summarizeClient,
  type ClientSummary,
} from "@/lib/tools/client-stats"
import { clientsFromCsv, clientsToCsv } from "@/lib/tools/clients-csv"
import { downloadCsv } from "@/lib/tools/csv"

type SortKey = "name" | "recent" | "outstanding" | "invoiced"

const SORTS: { key: SortKey; label: string }[] = [
  { key: "name", label: "Name (A–Z)" },
  { key: "recent", label: "Recent activity" },
  { key: "outstanding", label: "Outstanding (high–low)" },
  { key: "invoiced", label: "Invoiced (high–low)" },
]

function formatDate(iso: string | null): string {
  if (!iso) return "—"
  const d = new Date(iso)
  return Number.isNaN(d.getTime())
    ? "—"
    : d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
}

export default function ClientsPage() {
  const router = useRouter()
  const fileInput = useRef<HTMLInputElement>(null)
  const [summaries, setSummaries] = useState<ClientSummary[] | null>(null)
  const [query, setQuery] = useState("")
  const [sort, setSort] = useState<SortKey>("name")
  const [showArchived, setShowArchived] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)

  const load = async () => {
    const [clients, docs] = await Promise.all([getClients(), loadClientDocuments()])
    const today = new Date().toISOString().slice(0, 10)
    setSummaries(clients.map((c) => summarizeClient(c, docs, today)))
  }

  useEffect(() => {
    load()
  }, [])

  const archivedCount = summaries?.filter((s) => s.client.archived).length ?? 0

  const visible = useMemo(() => {
    if (!summaries) return []
    const q = query.trim().toLowerCase()
    const list = summaries.filter((s) => {
      if (!showArchived && s.client.archived) return false
      if (!q) return true
      const c = s.client
      return [c.name, c.email, c.phone, c.city, c.country, c.taxId]
        .filter(Boolean)
        .some((v) => v!.toLowerCase().includes(q))
    })
    const byName = (a: ClientSummary, b: ClientSummary) =>
      a.client.name.localeCompare(b.client.name, undefined, { sensitivity: "base" })
    return list.sort((a, b) => {
      switch (sort) {
        case "recent":
          return (b.lastActivity ?? "").localeCompare(a.lastActivity ?? "") || byName(a, b)
        case "outstanding":
          return primaryAmount(b.outstanding) - primaryAmount(a.outstanding) || byName(a, b)
        case "invoiced":
          return primaryAmount(b.invoiced) - primaryAmount(a.invoiced) || byName(a, b)
        default:
          return byName(a, b)
      }
    })
  }, [summaries, query, sort, showArchived])

  const active = summaries?.filter((s) => !s.client.archived) ?? []
  const withBalance = active.filter((s) => !isMoneyEmpty(s.outstanding)).length
  const withOverdue = active.filter((s) => s.overdueCount > 0).length

  const handleExport = () => {
    const clients = (summaries ?? []).map((s) => s.client)
    downloadCsv(`clients-${new Date().toISOString().slice(0, 10)}.csv`, clientsToCsv(clients))
  }

  const handleImport = async (file: File) => {
    const existing = (summaries ?? []).map((s) => s.client)
    const { added, skipped } = clientsFromCsv(await file.text(), existing)
    for (const client of added) await saveClient(client)
    await load()
    const skippedText = skipped.length
      ? ` Skipped ${skipped.length}: ${skipped
          .slice(0, 3)
          .map((s) => `row ${s.row} (${s.reason})`)
          .join(", ")}${skipped.length > 3 ? "…" : ""}`
      : ""
    setNotice(`Imported ${added.length} client${added.length === 1 ? "" : "s"}.${skippedText}`)
  }

  const buttonClass =
    "inline-flex items-center gap-2 rounded-xl border border-border bg-card/60 px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-card"

  return (
    <>
      <ToolsPageHeader
        backHref="/tools"
        backLabel="Back to Tools"
        title="Clients"
        subtitle="Everyone you quote, invoice and get paid by, with what they owe you."
        actions={
          <>
            <button type="button" onClick={() => fileInput.current?.click()} className={buttonClass}>
              <Upload className="size-4" />
              Import CSV
            </button>
            <button
              type="button"
              onClick={handleExport}
              disabled={!summaries?.length}
              className={`${buttonClass} disabled:opacity-50`}
            >
              <Download className="size-4" />
              Export CSV
            </button>
            <Link
              href="/tools/clients/new"
              className="inline-flex items-center gap-2 rounded-xl bg-purple-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-purple-400"
            >
              <Plus className="size-4" />
              New Client
            </Link>
            <input
              ref={fileInput}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                e.target.value = ""
                if (file) handleImport(file)
              }}
            />
          </>
        }
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { icon: Users, value: active.length, label: "Active clients" },
            { icon: Wallet, value: withBalance, label: "With a balance" },
            { icon: AlertTriangle, value: withOverdue, label: "With overdue invoices" },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="rounded-2xl border border-border bg-card/60 p-5 shadow-sm flex items-center gap-4">
              <div className="size-11 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
                <Icon className="size-5 text-purple-400" />
              </div>
              <div>
                <p className="text-3xl font-bold tabular-nums">{summaries ? value : "–"}</p>
                <p className="mt-1 font-mono text-[11px] tracking-widest text-muted-foreground/80 uppercase">
                  {label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {notice && (
          <div role="status" className="mb-6 flex items-start justify-between gap-4 rounded-xl border border-purple-500/30 bg-purple-500/10 px-4 py-3 text-sm">
            <span>{notice}</span>
            <button type="button" onClick={() => setNotice(null)} className="text-muted-foreground hover:text-foreground" aria-label="Dismiss">
              ×
            </button>
          </div>
        )}

        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search name, email, phone, city…"
              aria-label="Search clients"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background/80 text-sm outline-none placeholder:text-muted-foreground focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <select
              aria-label="Sort clients"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="rounded-xl border border-border bg-background/80 px-4 py-3 text-sm outline-none focus:border-purple-500/50"
            >
              {SORTS.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
            {archivedCount > 0 && (
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  checked={showArchived}
                  onChange={(e) => setShowArchived(e.target.checked)}
                  className="accent-purple-500"
                />
                Show archived ({archivedCount})
              </label>
            )}
          </div>
        </div>

        {summaries === null ? (
          <p className="py-16 text-center text-muted-foreground">Loading clients…</p>
        ) : visible.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-2xl border border-border bg-card/60 shadow-sm">
            <Users className="size-10 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">
              {query ? "No clients match your search" : "No clients yet"}
            </h3>
            <p className="text-muted-foreground mb-6">
              {query ? "Try a different name or email." : "Add your first client, or import a CSV file."}
            </p>
            {!query && (
              <Link
                href="/tools/clients/new"
                className="inline-flex items-center gap-2 rounded-xl bg-purple-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-purple-400"
              >
                <Plus className="size-4" />
                Add Client
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* Table on wider screens */}
            <div className="hidden md:block overflow-hidden rounded-2xl border border-border bg-card/60 shadow-sm">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-muted/40 text-left font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
                  <tr>
                    <th className="px-5 py-3 font-medium">Client</th>
                    <th className="px-5 py-3 font-medium text-right">Docs</th>
                    <th className="px-5 py-3 font-medium text-right">Invoiced</th>
                    <th className="px-5 py-3 font-medium text-right">Outstanding</th>
                    <th className="px-5 py-3 font-medium">Last activity</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((s) => (
                    <tr
                      key={s.client.id}
                      onClick={() => router.push(`/tools/clients/${s.client.id}`)}
                      className="cursor-pointer border-b border-border/60 last:border-0 hover:bg-muted/40"
                    >
                      <td className="px-5 py-4">
                        <Link
                          href={`/tools/clients/${s.client.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="font-semibold hover:text-purple-400"
                        >
                          {s.client.name}
                        </Link>
                        {s.client.archived && (
                          <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">Archived</span>
                        )}
                        <p className="text-muted-foreground">{s.client.email}</p>
                      </td>
                      <td className="px-5 py-4 text-right tabular-nums">{s.documentCount}</td>
                      <td className="px-5 py-4 text-right">
                        <MoneyMap value={s.invoiced} />
                      </td>
                      <td className="px-5 py-4 text-right">
                        <MoneyMap value={s.outstanding} className={s.overdueCount ? "text-red-500" : undefined} />
                        {s.overdueCount > 0 && (
                          <span className="text-xs text-red-500">{s.overdueCount} overdue</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">{formatDate(s.lastActivity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Cards on phones */}
            <ul className="md:hidden space-y-3">
              {visible.map((s) => (
                <li key={s.client.id}>
                  <Link
                    href={`/tools/clients/${s.client.id}`}
                    className="block rounded-2xl border border-border bg-card/60 p-4 shadow-sm active:bg-muted/40"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold truncate">{s.client.name}</p>
                        <p className="text-sm text-muted-foreground truncate">{s.client.email}</p>
                      </div>
                      <span className="shrink-0 text-xs text-muted-foreground">{s.documentCount} docs</span>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Invoiced</p>
                        <MoneyMap value={s.invoiced} />
                      </div>
                      <div>
                        <p className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Outstanding</p>
                        <MoneyMap value={s.outstanding} className={s.overdueCount ? "text-red-500" : undefined} />
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  )
}
