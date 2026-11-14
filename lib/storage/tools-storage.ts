import { v7 as uuidv7 } from "uuid"
import {
    Invoice,
    Client,
    InvoiceSettings,
    Quotation,
    Receipt,
    Contract,
    TimeTrackingStats,
    RunningTimer,
    TimeEntry,
} from "@/types/invoice"
import {
    hybridSave,
    hybridGetAll,
    hybridGetById,
    hybridDelete,
} from "./hybrid-storage"
import { Resume, ResumeStats } from "@/types/resume"
import { ensureMigrated, parseDocNumber } from "./migrations"
import { DEFAULT_SETTINGS } from "./settings-defaults"
import { deriveInvoiceStatus, invoicePaidAmount } from "@/lib/tools/payments"

const STORAGE_KEYS = {
    INVOICES: "invoices",
    CLIENTS: "clients",
    SETTINGS: "invoice_settings",
    QUOTATIONS: "quotations",
    RECEIPTS: "receipts",
    CONTRACTS: "contracts",
    TIME_ENTRIES: "time_entries",
    RUNNING_TIMER: "running_timer",
    RESUMES: "resumes",
} as const

const getFromStorage = <T>(key: string): T[] => {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : []
}

const saveToStorage = <T>(key: string, data: T[]): void => {
    if (typeof window === "undefined") return
    localStorage.setItem(key, JSON.stringify(data))
}

// Invoice Operations
export const saveInvoice = async (invoice: Invoice): Promise<void> => {
    await hybridSave(STORAGE_KEYS.INVOICES, invoice)
}

export const getInvoices = async (): Promise<Invoice[]> => {
    return hybridGetAll<Invoice>(STORAGE_KEYS.INVOICES)
}

export const getInvoiceById = async (id: string): Promise<Invoice | null> => {
    return hybridGetById<Invoice>(STORAGE_KEYS.INVOICES, id)
}

export const deleteInvoice = async (id: string): Promise<void> => {
    await hybridDelete(STORAGE_KEYS.INVOICES, id)
}

// Document numbering. Each type has its own prefix and counter in settings.
type CounterKind = "invoice" | "quotation" | "receipt" | "contract"

const COUNTER_FIELDS = {
    invoice: { prefix: "invoicePrefix", next: "nextInvoiceNumber" },
    quotation: { prefix: "quotationPrefix", next: "nextQuotationNumber" },
    receipt: { prefix: "receiptPrefix", next: "nextReceiptNumber" },
    contract: { prefix: "contractPrefix", next: "nextContractNumber" },
} as const satisfies Record<CounterKind, { prefix: keyof InvoiceSettings; next: keyof InvoiceSettings }>

export const formatDocNumber = (prefix: string, number: number): string =>
    `${prefix}${String(number).padStart(4, "0")}`

export const peekDocNumber = (kind: CounterKind): string => {
    const settings = getSettings()
    const { prefix, next } = COUNTER_FIELDS[kind]
    return formatDocNumber(
        (settings[prefix] as string | undefined) ?? (DEFAULT_SETTINGS[prefix] as string),
        (settings[next] as number | undefined) || 1,
    )
}

/**
 * Advance a counter after a document is saved. If the saved number was typed
 * by hand and is higher than the counter, jump past it so it is never reused.
 */
export const advanceDocNumber = async (kind: CounterKind, usedNumber?: string): Promise<void> => {
    const settings = getSettings()
    const { next } = COUNTER_FIELDS[kind]
    const current = (settings[next] as number | undefined) || 1
    const used = parseDocNumber(usedNumber)
    await saveSettings({ ...settings, [next]: Math.max(current, used) + 1 })
}

export const getNextInvoiceNumber = (): string => peekDocNumber("invoice")

export const incrementInvoiceNumber = async (usedNumber?: string): Promise<void> =>
    advanceDocNumber("invoice", usedNumber)

export const getNextQuotationNumber = (): string => peekDocNumber("quotation")

export const incrementQuotationNumber = async (usedNumber?: string): Promise<void> =>
    advanceDocNumber("quotation", usedNumber)

// Client Operations
export const saveClient = async (client: Client): Promise<void> => {
    await hybridSave(STORAGE_KEYS.CLIENTS, client)
}

export const getClients = async (): Promise<Client[]> => {
    return hybridGetAll<Client>(STORAGE_KEYS.CLIENTS)
}

/** Clients for a picker: archived ones are hidden unless already selected. */
export const getSelectableClients = async (keepId?: string | null): Promise<Client[]> => {
    const clients = await getClients()
    return clients
        .filter((c) => !c.archived || c.id === keepId)
        .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }))
}

export const getClientById = async (id: string): Promise<Client | null> => {
    return hybridGetById<Client>(STORAGE_KEYS.CLIENTS, id)
}

export const deleteClient = async (id: string): Promise<void> => {
    await hybridDelete(STORAGE_KEYS.CLIENTS, id)
}

/** Every document type that can belong to a client, loaded in one go. */
export const loadClientDocuments = async () => {
    const [quotations, invoices, receipts, contracts, timeEntries] = await Promise.all([
        getQuotations(),
        getInvoices(),
        getReceipts(),
        getContracts(),
        getTimeEntries(),
    ])
    return { quotations, invoices, receipts, contracts, timeEntries }
}

/**
 * Copy an edited client onto documents that are still drafts. Sent, paid and
 * signed documents keep the client details they were issued with.
 */
export const updateClientOnDrafts = async (client: Client): Promise<number> => {
    const docs = await loadClientDocuments()
    const isMine = (d: { clientId?: string; client: Client }) =>
        (d.clientId ?? d.client.id) === client.id
    const now = new Date().toISOString()
    let count = 0
    for (const q of docs.quotations.filter((d) => isMine(d) && d.status === "draft")) {
        await saveQuotation({ ...q, clientId: client.id, client, updatedAt: now })
        count++
    }
    for (const i of docs.invoices.filter((d) => isMine(d) && d.status === "draft")) {
        await saveInvoice({ ...i, clientId: client.id, client, updatedAt: now })
        count++
    }
    for (const c of docs.contracts.filter((d) => isMine(d) && d.status === "draft")) {
        await saveContract({ ...c, clientId: client.id, client, updatedAt: now })
        count++
    }
    return count
}

export const countClientDrafts = async (clientId: string): Promise<number> => {
    const docs = await loadClientDocuments()
    const isMine = (d: { clientId?: string; client: Client }) => (d.clientId ?? d.client.id) === clientId
    return (
        docs.quotations.filter((d) => isMine(d) && d.status === "draft").length +
        docs.invoices.filter((d) => isMine(d) && d.status === "draft").length +
        docs.contracts.filter((d) => isMine(d) && d.status === "draft").length
    )
}

// Settings Operations
export const getSettings = (): InvoiceSettings => {
    if (typeof window === "undefined") return { ...DEFAULT_SETTINGS }
    ensureMigrated()
    try {
        const data = localStorage.getItem(STORAGE_KEYS.SETTINGS)
        return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : { ...DEFAULT_SETTINGS }
    } catch {
        return { ...DEFAULT_SETTINGS }
    }
}

export const saveSettings = async (settings: InvoiceSettings): Promise<void> => {
    if (typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings))
}

// Quotation Operations
export const saveQuotation = async (quotation: Quotation): Promise<void> => {
    await hybridSave(STORAGE_KEYS.QUOTATIONS, quotation)
}

export const getQuotations = async (): Promise<Quotation[]> => {
    return hybridGetAll<Quotation>(STORAGE_KEYS.QUOTATIONS)
}

export const getQuotationById = async (id: string): Promise<Quotation | null> => {
    return hybridGetById<Quotation>(STORAGE_KEYS.QUOTATIONS, id)
}

export const deleteQuotation = async (id: string): Promise<void> => {
    await hybridDelete(STORAGE_KEYS.QUOTATIONS, id)
}

// Receipt Operations
export const saveReceipt = async (receipt: Receipt): Promise<void> => {
    await hybridSave(STORAGE_KEYS.RECEIPTS, receipt)
}

export const getReceipts = async (): Promise<Receipt[]> => {
    return hybridGetAll<Receipt>(STORAGE_KEYS.RECEIPTS)
}

export const getReceiptById = async (id: string): Promise<Receipt | null> => {
    return hybridGetById<Receipt>(STORAGE_KEYS.RECEIPTS, id)
}

export const deleteReceipt = async (id: string): Promise<void> => {
    await hybridDelete(STORAGE_KEYS.RECEIPTS, id)
}

export const getNextReceiptNumber = async (): Promise<string> => peekDocNumber("receipt")

export const incrementReceiptNumber = async (usedNumber?: string): Promise<void> =>
    advanceDocNumber("receipt", usedNumber)

// Contract Operations
export const saveContract = async (contract: Contract): Promise<void> => {
    await hybridSave(STORAGE_KEYS.CONTRACTS, contract)
}

export const getContracts = async (): Promise<Contract[]> => {
    return hybridGetAll<Contract>(STORAGE_KEYS.CONTRACTS)
}

export const getContractById = async (id: string): Promise<Contract | null> => {
    return hybridGetById<Contract>(STORAGE_KEYS.CONTRACTS, id)
}

export const deleteContract = async (id: string): Promise<void> => {
    await hybridDelete(STORAGE_KEYS.CONTRACTS, id)
}

export const getNextContractNumber = async (): Promise<string> => peekDocNumber("contract")

export const incrementContractNumber = async (usedNumber?: string): Promise<void> =>
    advanceDocNumber("contract", usedNumber)

// Time Entry Operations
export const saveTimeEntry = async (entry: TimeEntry): Promise<void> => {
    await hybridSave(STORAGE_KEYS.TIME_ENTRIES, entry)
}

export const getTimeEntries = async (): Promise<TimeEntry[]> => {
    return hybridGetAll<TimeEntry>(STORAGE_KEYS.TIME_ENTRIES)
}

export const getTimeEntryById = async (id: string): Promise<TimeEntry | null> => {
    return hybridGetById<TimeEntry>(STORAGE_KEYS.TIME_ENTRIES, id)
}

export const deleteTimeEntry = async (id: string): Promise<void> => {
    await hybridDelete(STORAGE_KEYS.TIME_ENTRIES, id)
}

export const getTimeEntriesByClient = async (clientId: string): Promise<TimeEntry[]> => {
    const entries = await getTimeEntries()
    return entries.filter((e) => e.clientId === clientId)
}

export const getTimeEntriesByDateRange = async (
    startDate: string,
    endDate: string,
): Promise<TimeEntry[]> => {
    const entries = await getTimeEntries()
    return entries.filter((e) => {
        const entryDate = new Date(e.date)
        const start = new Date(startDate)
        const end = new Date(endDate)
        return entryDate >= start && entryDate <= end
    })
}

export const getUninvoicedTimeEntries = async (): Promise<TimeEntry[]> => {
    const entries = await getTimeEntries()
    return entries.filter((e) => e.billable && !e.invoiced)
}

export const markTimeEntriesAsInvoiced = async (
    entryIds: string[],
    invoiceId: string,
): Promise<void> => {
    const entries = await getTimeEntries()
    const updates = entries
        .filter((entry) => entryIds.includes(entry.id))
        .map((entry) => ({
            ...entry,
            invoiced: true,
            invoiceId,
            updatedAt: new Date().toISOString(),
        }))

    for (const entry of updates) {
        await saveTimeEntry(entry)
    }
}

// Running Timer Operations
export const saveRunningTimer = (timer: RunningTimer | null): void => {
    if (typeof window === "undefined") return
    if (timer) {
        localStorage.setItem(STORAGE_KEYS.RUNNING_TIMER, JSON.stringify(timer))
    } else {
        localStorage.removeItem(STORAGE_KEYS.RUNNING_TIMER)
    }
}

export const getRunningTimer = (): RunningTimer | null => {
    if (typeof window === "undefined") return null
    const data = localStorage.getItem(STORAGE_KEYS.RUNNING_TIMER)
    return data ? JSON.parse(data) : null
}

export const clearRunningTimer = (): void => {
    if (typeof window === "undefined") return
    localStorage.removeItem(STORAGE_KEYS.RUNNING_TIMER)
}

// Time Tracking Statistics
export const getTimeTrackingStats = async (): Promise<TimeTrackingStats> => {
    const entries = await getTimeEntries()
    const now = new Date()
    const today = now.toISOString().split("T")[0]

    const weekStart = new Date(now)
    weekStart.setDate(
        now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1),
    )
    const weekStartStr = weekStart.toISOString().split("T")[0]

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const monthStartStr = monthStart.toISOString().split("T")[0]

    const totalHours = entries.reduce((sum, e) => sum + e.duration / 60, 0)
    const billableHours = entries
        .filter((e) => e.billable)
        .reduce((sum, e) => sum + e.duration / 60, 0)
    const nonBillableHours = entries
        .filter((e) => !e.billable)
        .reduce((sum, e) => sum + e.duration / 60, 0)
    const totalEarnings = entries
        .filter((e) => e.billable)
        .reduce((sum, e) => sum + e.amount, 0)
    const uninvoicedEarnings = entries
        .filter((e) => e.billable && !e.invoiced)
        .reduce((sum, e) => sum + e.amount, 0)

    const todayEntries = entries.filter((e) => e.date === today)
    const todayHours = todayEntries.reduce((sum, e) => sum + e.duration / 60, 0)

    const weekEntries = entries.filter((e) => e.date >= weekStartStr)
    const thisWeekHours = weekEntries.reduce((sum, e) => sum + e.duration / 60, 0)

    const monthEntries = entries.filter((e) => e.date >= monthStartStr)
    const thisMonthHours = monthEntries.reduce(
        (sum, e) => sum + e.duration / 60,
        0,
    )

    return {
        totalEntries: entries.length,
        totalHours,
        billableHours,
        nonBillableHours,
        totalEarnings,
        uninvoicedEarnings,
        todayHours,
        thisWeekHours,
        thisMonthHours,
    }
}

// Statistics
export const getInvoiceStats = async () => {
    const [invoices, receipts] = await Promise.all([getInvoices(), getReceipts()])
    const withStatus = invoices.map((invoice) => ({
        invoice,
        status: deriveInvoiceStatus(invoice, receipts),
        paid: invoicePaidAmount(invoice, receipts),
    }))
    const billed = withStatus.filter((i) => i.status !== "draft" && i.status !== "cancelled")

    return {
        total: invoices.length,
        draft: withStatus.filter((i) => i.status === "draft").length,
        sent: withStatus.filter((i) => i.status === "sent").length,
        partiallyPaid: withStatus.filter((i) => i.status === "partially_paid").length,
        paid: withStatus.filter((i) => i.status === "paid").length,
        overdue: withStatus.filter((i) => i.status === "overdue").length,
        totalRevenue: billed.reduce((sum, i) => sum + i.paid, 0),
        pendingRevenue: billed.reduce((sum, i) => sum + (i.invoice.total - i.paid), 0),
    }
}

export const getReceiptStats = async () => {
    const receipts = await getReceipts()

    return {
        total: receipts.length,
        totalAmount: receipts.reduce((sum, r) => sum + r.amountPaid, 0),
    }
}

export const getContractStats = async () => {
    const contracts = await getContracts()

    return {
        total: contracts.length,
        draft: contracts.filter((c) => c.status === "draft").length,
        sent: contracts.filter((c) => c.status === "sent").length,
        signed: contracts.filter((c) => c.status === "signed").length,
        active: contracts.filter((c) => c.status === "active").length,
        completed: contracts.filter((c) => c.status === "completed").length,
    }
}

// Resume Operations
export const saveResume = async (resume: Resume): Promise<void> => {
    await hybridSave(STORAGE_KEYS.RESUMES, resume)
}

export const getResumes = async (): Promise<Resume[]> => {
    return hybridGetAll<Resume>(STORAGE_KEYS.RESUMES)
}

export const getResumeById = async (id: string): Promise<Resume | null> => {
    return hybridGetById<Resume>(STORAGE_KEYS.RESUMES, id)
}

export const deleteResume = async (id: string): Promise<void> => {
    await hybridDelete(STORAGE_KEYS.RESUMES, id)
}

export const duplicateResume = async (id: string): Promise<Resume | null> => {
    const original = await getResumeById(id)
    if (!original) return null

    const duplicate: Resume = {
        ...original,
        id: uuidv7(),
        name: `${original.name} (Copy)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }

    await saveResume(duplicate)
    return duplicate
}

export const getResumeStats = async (): Promise<ResumeStats> => {
    const resumes = await getResumes()

    const templates = {
        modern: resumes.filter((r) => r.template === "modern").length,
        classic: resumes.filter((r) => r.template === "classic").length,
        creative: resumes.filter((r) => r.template === "creative").length,
        minimal: resumes.filter((r) => r.template === "minimal").length,
        professional: resumes.filter((r) => r.template === "professional").length,
    }

    const recentlyUpdated = resumes
        .sort(
            (a, b) =>
                new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        )
        .slice(0, 5)

    return {
        total: resumes.length,
        templates,
        recentlyUpdated,
    }
}

export const exportResumeJSON = async (id: string): Promise<string> => {
    const resume = await getResumeById(id)
    if (!resume) throw new Error("Resume not found")
    return JSON.stringify(resume, null, 2)
}

export const importResumeJSON = async (jsonString: string): Promise<Resume> => {
    const resume = JSON.parse(jsonString) as Resume
    resume.id = uuidv7()
    resume.createdAt = new Date().toISOString()
    resume.updatedAt = new Date().toISOString()
    await saveResume(resume)
    return resume
}

export const exportAllResumes = async () => {
    const resumes = await getResumes()
    return {
        resumes,
        exportedAt: new Date().toISOString(),
    }
}

export const importAllResumes = async (data: { resumes: Resume[] }): Promise<void> => {
    if (data.resumes) {
        for (const resume of data.resumes) {
            await saveResume(resume)
        }
    }
}

export const createDefaultResume = (): Resume => {
    return {
        id: uuidv7(),
        name: "My Resume",
        template: "modern",
        personal: {
            fullName: "",
            title: "",
            email: "",
            phone: "",
            location: "",
        },
        summary: "",
        experience: [],
        education: [],
        skills: [],
        projects: [],
        certifications: [],
        languages: [],
        customSections: [],
        sections: [
            {
                id: uuidv7(),
                type: "personal",
                title: "Personal Information",
                visible: true,
                order: 0,
            },
            {
                id: uuidv7(),
                type: "summary",
                title: "Professional Summary",
                visible: true,
                order: 1,
            },
            {
                id: uuidv7(),
                type: "experience",
                title: "Work Experience",
                visible: true,
                order: 2,
            },
            {
                id: uuidv7(),
                type: "education",
                title: "Education",
                visible: true,
                order: 3,
            },
            {
                id: uuidv7(),
                type: "skills",
                title: "Skills",
                visible: true,
                order: 4,
            },
            {
                id: uuidv7(),
                type: "projects",
                title: "Projects",
                visible: false,
                order: 5,
            },
            {
                id: uuidv7(),
                type: "certifications",
                title: "Certifications",
                visible: false,
                order: 6,
            },
            {
                id: uuidv7(),
                type: "languages",
                title: "Languages",
                visible: false,
                order: 7,
            },
        ],
        style: {
            template: "modern",
            primaryColor: "#2563eb",
            fontFamily: "Inter",
            fontSize: "medium",
            spacing: "normal",
            showPhoto: true,
            showIcons: true,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }
}

export const calculateDuration = (
    startTime: string,
    endTime: string,
): number => {
    const start = new Date(startTime)
    const end = new Date(endTime)
    return Math.round((end.getTime() - start.getTime()) / 1000 / 60)
}

export const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}:${String(mins).padStart(2, "0")}`
}

export const formatDurationDecimal = (minutes: number): string => {
    return (minutes / 60).toFixed(2)
}
