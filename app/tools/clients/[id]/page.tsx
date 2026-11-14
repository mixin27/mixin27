"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import {
  Archive,
  ArchiveRestore,
  Clock,
  Edit,
  FileCheck,
  FileSignature,
  FileText,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Plus,
  Receipt as ReceiptIcon,
  Trash2,
} from "lucide-react"
import { ToolsPageHeader } from "@/components/tools/ClientForm"
import { MoneyMap } from "@/components/tools/money"
import {
  deleteClient,
  getClientById,
  loadClientDocuments,
  saveClient,
} from "@/lib/storage/tools-storage"
import {
  filterDocumentsForClient,
  hasDocuments,
  invoicePaidAmount,
  isBilled,
  summarizeClient,
  type ClientDocuments,
} from "@/lib/tools/client-stats"
import { formatMoney, roundMoney } from "@/lib/tools/totals"
import { deriveInvoiceStatus } from "@/lib/tools/payments"
import type { Client } from "@/types/invoice"

type Tab = "quotations" | "invoices" | "receipts" | "contracts" | "time"

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  sent: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  accepted: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  paid: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  signed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  partially_paid: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  overdue: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  terminated: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  expired: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  cancelled: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_STYLES[status] ?? STATUS_STYLES.draft}`}>
      {status.replace(/_/g, " ")}
    </span>
  )
}

function formatDate(value?: string): string {
  if (!value) return "—"
  const d = new Date(value)
  return Number.isNaN(d.getTime())
    ? value
    : d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
}

const money = (amount: number, currency: string) => `${currency} ${formatMoney(amount, currency)}`

interface Row {
  id: string
  href: string
  number: string
  date?: string
  status?: string
  amount: string
  detail?: string
}

function DocumentTable({ rows, empty, newHref, newLabel }: { rows: Row[]; empty: string; newHref: string; newLabel: string }) {
  if (!rows.length) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-10 text-center">
        <p className="text-muted-foreground mb-4">{empty}</p>
        <Link href={newHref} className="inline-flex items-center gap-2 text-sm font-semibold text-purple-400 hover:underline">
          <Plus className="size-4" />
          {newLabel}
        </Link>
      </div>
    )
  }
  return (
    <ul className="divide-y divide-border/60 overflow-hidden rounded-2xl border border-border bg-card/60 shadow-sm">
      {rows.map((row) => (
        <li key={row.id}>
          <Link href={row.href} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 sm:px-5 py-4 hover:bg-muted/40">
            <span className="font-semibold min-w-[7rem]">{row.number}</span>
            <span className="text-sm text-muted-foreground min-w-[7rem]">{formatDate(row.date)}</span>
            {row.status && <StatusBadge status={row.status} />}
            {row.detail && <span className="text-xs text-muted-foreground">{row.detail}</span>}
            <span className="ml-auto font-medium tabular-nums">{row.amount}</span>
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default function ClientDetailPage() {
  const router = useRouter()
  const clientId = useParams().id as string
  const [client, setClient] = useState<Client | null | undefined>(undefined)
  const [docs, setDocs] = useState<ClientDocuments | null>(null)
  const [tab, setTab] = useState<Tab>("invoices")

  const load = async () => {
    const [c, all] = await Promise.all([getClientById(clientId), loadClientDocuments()])
    setClient(c)
    setDocs(all)
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId])

  const own = useMemo(() => (client && docs ? filterDocumentsForClient(client.id, docs) : null), [client, docs])
  const summary = useMemo(() => (client && docs ? summarizeClient(client, docs) : null), [client, docs])

  if (client === undefined || !docs) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-purple-400" aria-label="Loading client" />
      </div>
    )
  }

  if (client === null || !own || !summary) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-lg font-semibold">Client not found</p>
        <Link href="/tools/clients" className="text-purple-400 hover:underline">
          Back to Clients
        </Link>
      </div>
    )
  }

  const toggleArchive = async () => {
    const updated = { ...client, archived: !client.archived }
    await saveClient(updated)
    setClient(updated)
  }

  const handleDelete = async () => {
    if (hasDocuments(client.id, docs)) {
      if (
        !client.archived &&
        confirm(
          `${client.name} has documents, so they can't be deleted without breaking those links.\n\nArchive them instead? Archived clients are hidden from lists and pickers but keep their history.`,
        )
      ) {
        await toggleArchive()
      }
      return
    }
    if (confirm(`Delete ${client.name}? This can't be undone.`)) {
      await deleteClient(client.id)
      router.push("/tools/clients")
    }
  }

  const q = `clientId=${client.id}`
  const today = new Date().toISOString().slice(0, 10)
  const byNewest = <T extends { createdAt: string }>(list: T[]) =>
    [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  const tabs: { key: Tab; label: string; icon: typeof FileText; count: number; rows: Row[]; newHref: string; newLabel: string }[] = [
    {
      key: "quotations",
      label: "Quotations",
      icon: FileCheck,
      count: own.quotations.length,
      newHref: `/tools/quotations/new?${q}`,
      newLabel: "New quotation",
      rows: byNewest(own.quotations).map((d) => ({
        id: d.id,
        href: `/tools/quotations/${d.id}`,
        number: d.invoiceNumber,
        date: d.issueDate,
        status: d.status,
        amount: money(d.total, d.currency),
        detail: d.invoiceIds?.length ? `${d.invoiceIds.length} invoice${d.invoiceIds.length === 1 ? "" : "s"}` : undefined,
      })),
    },
    {
      key: "invoices",
      label: "Invoices",
      icon: FileText,
      count: own.invoices.length,
      newHref: `/tools/invoices/new?${q}`,
      newLabel: "New invoice",
      rows: byNewest(own.invoices).map((d) => {
        const balance = roundMoney(d.total - invoicePaidAmount(d, own.receipts), d.currency)
        return {
          id: d.id,
          href: `/tools/invoices/${d.id}`,
          number: d.invoiceNumber,
          date: d.issueDate,
          status: deriveInvoiceStatus(d, own.receipts, today),
          amount: money(d.total, d.currency),
          detail:
            isBilled(d) && balance > 0 && balance < d.total
              ? `${money(balance, d.currency)} due`
              : d.installment
                ? `Part ${d.installment.index} of ${d.installment.count}`
                : undefined,
        }
      }),
    },
    {
      key: "receipts",
      label: "Receipts",
      icon: ReceiptIcon,
      count: own.receipts.length,
      newHref: `/tools/receipts/new?${q}`,
      newLabel: "New receipt",
      rows: byNewest(own.receipts).map((d) => ({
        id: d.id,
        href: `/tools/receipts/${d.id}`,
        number: d.receiptNumber,
        date: d.paymentDate,
        amount: money(d.amountPaid, d.currency),
        detail: d.relatedInvoiceNumber ? `for ${d.relatedInvoiceNumber}` : undefined,
      })),
    },
    {
      key: "contracts",
      label: "Contracts",
      icon: FileSignature,
      count: own.contracts.length,
      newHref: `/tools/contracts/new?${q}`,
      newLabel: "New contract",
      rows: byNewest(own.contracts).map((d) => ({
        id: d.id,
        href: `/tools/contracts/${d.id}`,
        number: d.contractNumber,
        date: d.startDate,
        status: d.status,
        amount: money(d.projectFee, d.currency),
        detail: d.projectName,
      })),
    },
    {
      key: "time",
      label: "Time",
      icon: Clock,
      count: own.timeEntries.length,
      newHref: `/tools/timesheet/new?${q}`,
      newLabel: "Log time",
      rows: [...own.timeEntries]
        .sort((a, b) => b.date.localeCompare(a.date))
        .map((d) => ({
          id: d.id,
          href: `/tools/timesheet/${d.id}`,
          number: d.projectName || "Time entry",
          date: d.date,
          amount: `${(d.duration / 60).toFixed(2)} h`,
          detail: d.invoiced ? "Invoiced" : d.billable ? "Billable" : "Non-billable",
        })),
    },
  ]
  const current = tabs.find((t) => t.key === tab)!

  const address = [client.address, client.city, client.state, client.zipCode, client.country]
    .filter(Boolean)
    .join(", ")
  const ghostButton =
    "inline-flex items-center gap-2 rounded-xl border border-border bg-card/60 px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-card"

  return (
    <>
      <ToolsPageHeader
        backHref="/tools/clients"
        backLabel="Back to Clients"
        title={
          <>
            {client.name}
            {client.archived && (
              <span className="ml-3 align-middle rounded-full bg-muted px-3 py-1 text-sm font-medium text-muted-foreground">
                Archived
              </span>
            )}
          </>
        }
        subtitle={
          <div className="space-y-1 text-base">
            {client.email && (
              <a href={`mailto:${client.email}`} className="flex items-center gap-2 hover:text-foreground">
                <Mail className="size-4 shrink-0" />
                <span className="break-all">{client.email}</span>
              </a>
            )}
            {client.phone && (
              <a href={`tel:${client.phone}`} className="flex items-center gap-2 hover:text-foreground">
                <Phone className="size-4 shrink-0" />
                {client.phone}
              </a>
            )}
            {address && (
              <p className="flex items-start gap-2">
                <MapPin className="size-4 shrink-0 mt-1" />
                {address}
              </p>
            )}
            {client.taxId && <p className="text-sm">Tax ID: {client.taxId}</p>}
          </div>
        }
        actions={
          <>
            <Link href={`/tools/clients/${client.id}/edit`} className={ghostButton}>
              <Edit className="size-4" />
              Edit
            </Link>
            <button type="button" onClick={toggleArchive} className={ghostButton}>
              {client.archived ? <ArchiveRestore className="size-4" /> : <Archive className="size-4" />}
              {client.archived ? "Unarchive" : "Archive"}
            </button>
            <button type="button" onClick={handleDelete} className={`${ghostButton} text-destructive hover:bg-destructive/10`}>
              <Trash2 className="size-4" />
              Delete
            </button>
          </>
        }
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 md:py-16 space-y-10">
        <section aria-label="Balances" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Invoiced", value: summary.invoiced },
            { label: "Paid", value: summary.paid },
            { label: "Outstanding", value: summary.outstanding },
            { label: summary.overdueCount ? `Overdue (${summary.overdueCount})` : "Overdue", value: summary.overdue, danger: summary.overdueCount > 0 },
          ].map((card) => (
            <div key={card.label} className="rounded-2xl border border-border bg-card/60 p-4 sm:p-5 shadow-sm">
              <p className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase mb-2">{card.label}</p>
              <MoneyMap value={card.value} className={`text-lg sm:text-xl font-bold ${card.danger ? "text-red-500" : ""}`} />
            </div>
          ))}
        </section>

        <section aria-label="Create for this client" className="flex flex-wrap gap-2">
          {[
            { href: `/tools/quotations/new?${q}`, label: "New quotation", icon: FileCheck },
            { href: `/tools/invoices/new?${q}`, label: "New invoice", icon: FileText },
            { href: `/tools/receipts/new?${q}`, label: "New receipt", icon: ReceiptIcon },
            { href: `/tools/contracts/new?${q}`, label: "New contract", icon: FileSignature },
          ].map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="inline-flex items-center gap-2 rounded-xl bg-purple-500/10 px-4 py-2.5 text-sm font-semibold text-purple-500 dark:text-purple-300 transition-colors hover:bg-purple-500/20"
            >
              <Icon className="size-4" />
              {label}
            </Link>
          ))}
        </section>

        <section aria-label="Documents">
          <div role="tablist" aria-label="Document types" className="mb-4 flex gap-1 overflow-x-auto border-b border-border">
            {tabs.map((t) => (
              <button
                key={t.key}
                role="tab"
                type="button"
                aria-selected={tab === t.key}
                onClick={() => setTab(t.key)}
                className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                  tab === t.key
                    ? "border-purple-500 text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <t.icon className="size-4" />
                {t.label}
                <span className="rounded-full bg-muted px-2 text-xs tabular-nums">{t.count}</span>
              </button>
            ))}
          </div>
          <div role="tabpanel">
            <DocumentTable
              rows={current.rows}
              empty={`No ${current.label.toLowerCase()} for ${client.name} yet.`}
              newHref={current.newHref}
              newLabel={current.newLabel}
            />
          </div>
        </section>
      </div>
    </>
  )
}
