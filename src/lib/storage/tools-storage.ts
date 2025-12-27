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
  triggerAutoSync,
} from "./hybrid-storage"
import { Resume, ResumeStats } from "@/types/resume"

// Storage keys
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

// Helper function for localStorage (for settings and running timer)
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
  await hybridSave(STORAGE_KEYS.INVOICES, invoice, "/invoices")
}

export const getInvoices = async (syncFromCloud = false): Promise<Invoice[]> => {
  return hybridGetAll<Invoice>(STORAGE_KEYS.INVOICES, "/invoices", syncFromCloud)
}

export const getInvoiceById = async (id: string): Promise<Invoice | null> => {
  return hybridGetById<Invoice>(STORAGE_KEYS.INVOICES, id, "/invoices")
}

export const deleteInvoice = async (id: string): Promise<void> => {
  await hybridDelete(STORAGE_KEYS.INVOICES, id, "/invoices")
}

export const getNextInvoiceNumber = (): string => {
  const settings = getSettings()
  const number = settings.nextInvoiceNumber
  return `${settings.invoicePrefix}${String(number).padStart(4, "0")}`
}

export const incrementInvoiceNumber = async (): Promise<void> => {
  const settings = getSettings()
  settings.nextInvoiceNumber += 1
  await saveSettings(settings)
}

// Client Operations
export const saveClient = async (client: Client): Promise<void> => {
  await hybridSave(STORAGE_KEYS.CLIENTS, client, "/clients")
}

export const getClients = async (syncFromCloud = false): Promise<Client[]> => {
  return hybridGetAll<Client>(STORAGE_KEYS.CLIENTS, "/clients", syncFromCloud)
}

export const getClientById = async (id: string): Promise<Client | null> => {
  return hybridGetById<Client>(STORAGE_KEYS.CLIENTS, id, "/clients")
}

export const deleteClient = async (id: string): Promise<void> => {
  await hybridDelete(STORAGE_KEYS.CLIENTS, id, "/clients")
}

// Settings Operations
const defaultSettings: InvoiceSettings = {
  businessName: "Your Business Name",
  businessEmail: "contact@yourbusiness.com",
  businessPhone: "",
  businessAddress: "",
  businessCity: "",
  businessState: "",
  businessZipCode: "",
  businessCountry: "",
  taxId: "",
  logo: "",
  defaultCurrency: "USD",
  defaultTaxRate: 0,
  defaultPaymentTerms: "Net 30",
  invoicePrefix: "INV-",
  nextInvoiceNumber: 1,
}

export const getSettings = (): InvoiceSettings => {
  if (typeof window === "undefined") return defaultSettings
  const data = localStorage.getItem(STORAGE_KEYS.SETTINGS)
  return data ? JSON.parse(data) : defaultSettings
}

export const saveSettings = async (settings: InvoiceSettings): Promise<void> => {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings))
  
  // Sync to cloud if enabled
  if (typeof window !== "undefined") {
    try {
      const response = await fetch("/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })
      if (response.ok) {
        triggerAutoSync()
      }
    } catch (error) {
      console.error("Failed to sync settings to cloud:", error)
    }
  }
}

// Quotation Operations
export const saveQuotation = async (quotation: Quotation): Promise<void> => {
  await hybridSave(STORAGE_KEYS.QUOTATIONS, quotation, "/quotations")
}

export const getQuotations = async (syncFromCloud = false): Promise<Quotation[]> => {
  return hybridGetAll<Quotation>(STORAGE_KEYS.QUOTATIONS, "/quotations", syncFromCloud)
}

export const getQuotationById = async (id: string): Promise<Quotation | null> => {
  return hybridGetById<Quotation>(STORAGE_KEYS.QUOTATIONS, id, "/quotations")
}

export const deleteQuotation = async (id: string): Promise<void> => {
  await hybridDelete(STORAGE_KEYS.QUOTATIONS, id, "/quotations")
}

// Receipt Operations
export const saveReceipt = async (receipt: Receipt): Promise<void> => {
  await hybridSave(STORAGE_KEYS.RECEIPTS, receipt, "/receipts")
}

export const getReceipts = async (syncFromCloud = false): Promise<Receipt[]> => {
  return hybridGetAll<Receipt>(STORAGE_KEYS.RECEIPTS, "/receipts", syncFromCloud)
}

export const getReceiptById = async (id: string): Promise<Receipt | null> => {
  return hybridGetById<Receipt>(STORAGE_KEYS.RECEIPTS, id, "/receipts")
}

export const deleteReceipt = async (id: string): Promise<void> => {
  await hybridDelete(STORAGE_KEYS.RECEIPTS, id, "/receipts")
}

export const getNextReceiptNumber = async (): Promise<string> => {
  const receipts = await getReceipts()
  const nextNumber = receipts.length + 1
  return `REC-${String(nextNumber).padStart(4, "0")}`
}

// Contract Operations
export const saveContract = async (contract: Contract): Promise<void> => {
  await hybridSave(STORAGE_KEYS.CONTRACTS, contract, "/contracts")
}

export const getContracts = async (syncFromCloud = false): Promise<Contract[]> => {
  return hybridGetAll<Contract>(STORAGE_KEYS.CONTRACTS, "/contracts", syncFromCloud)
}

export const getContractById = async (id: string): Promise<Contract | null> => {
  return hybridGetById<Contract>(STORAGE_KEYS.CONTRACTS, id, "/contracts")
}

export const deleteContract = async (id: string): Promise<void> => {
  await hybridDelete(STORAGE_KEYS.CONTRACTS, id, "/contracts")
}

export const getNextContractNumber = async (): Promise<string> => {
  const contracts = await getContracts()
  const nextNumber = contracts.length + 1
  return `CON-${String(nextNumber).padStart(4, "0")}`
}

// Time Entry Operations
export const saveTimeEntry = async (entry: TimeEntry): Promise<void> => {
  await hybridSave(STORAGE_KEYS.TIME_ENTRIES, entry, "/time-entries")
}

export const getTimeEntries = async (syncFromCloud = false): Promise<TimeEntry[]> => {
  return hybridGetAll<TimeEntry>(STORAGE_KEYS.TIME_ENTRIES, "/time-entries", syncFromCloud)
}

export const getTimeEntryById = async (id: string): Promise<TimeEntry | null> => {
  return hybridGetById<TimeEntry>(STORAGE_KEYS.TIME_ENTRIES, id, "/time-entries")
}

export const deleteTimeEntry = async (id: string): Promise<void> => {
  await hybridDelete(STORAGE_KEYS.TIME_ENTRIES, id, "/time-entries")
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

  // Save all updated entries
  for (const entry of updates) {
    await saveTimeEntry(entry)
  }
}

// Running Timer Operations (localStorage only - not synced)
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

  // Get week start (Monday)
  const weekStart = new Date(now)
  weekStart.setDate(
    now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1),
  )
  const weekStartStr = weekStart.toISOString().split("T")[0]

  // Get month start
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
  const invoices = await getInvoices()

  return {
    total: invoices.length,
    draft: invoices.filter((i) => i.status === "draft").length,
    sent: invoices.filter((i) => i.status === "sent").length,
    paid: invoices.filter((i) => i.status === "paid").length,
    overdue: invoices.filter((i) => i.status === "overdue").length,
    totalRevenue: invoices
      .filter((i) => i.status === "paid")
      .reduce((sum, i) => sum + i.total, 0),
    pendingRevenue: invoices
      .filter((i) => i.status === "sent" || i.status === "overdue")
      .reduce((sum, i) => sum + i.total, 0),
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

/** Resume Operations */
export const saveResume = async (resume: Resume): Promise<void> => {
  await hybridSave(STORAGE_KEYS.RESUMES, resume, "/resumes")
}

export const getResumes = async (syncFromCloud = false): Promise<Resume[]> => {
  return hybridGetAll<Resume>(STORAGE_KEYS.RESUMES, "/resumes", syncFromCloud)
}

export const getResumeById = async (id: string): Promise<Resume | null> => {
  return hybridGetById<Resume>(STORAGE_KEYS.RESUMES, id, "/resumes")
}

export const deleteResume = async (id: string): Promise<void> => {
  await hybridDelete(STORAGE_KEYS.RESUMES, id, "/resumes")
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

// Statistics
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

// Export resume as JSON
export const exportResumeJSON = async (id: string): Promise<string> => {
  const resume = await getResumeById(id)
  if (!resume) throw new Error("Resume not found")
  return JSON.stringify(resume, null, 2)
}

// Import resume from JSON
export const importResumeJSON = async (jsonString: string): Promise<Resume> => {
  const resume = JSON.parse(jsonString) as Resume
  resume.id = uuidv7()
  resume.createdAt = new Date().toISOString()
  resume.updatedAt = new Date().toISOString()
  await saveResume(resume)
  return resume
}

// Export all resumes (backup)
export const exportAllResumes = async () => {
  const resumes = await getResumes()
  return {
    resumes,
    exportedAt: new Date().toISOString(),
  }
}

// Import all resumes (restore from backup)
export const importAllResumes = async (data: { resumes: Resume[] }): Promise<void> => {
  if (data.resumes) {
    for (const resume of data.resumes) {
      await saveResume(resume)
    }
  }
}

// Default resume template
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

// Helper: Calculate duration in minutes
export const calculateDuration = (
  startTime: string,
  endTime: string,
): number => {
  const start = new Date(startTime)
  const end = new Date(endTime)
  return Math.round((end.getTime() - start.getTime()) / 1000 / 60)
}

// Helper: Format duration (minutes to HH:MM)
export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}:${String(mins).padStart(2, "0")}`
}

// Helper: Format duration to decimal hours
export const formatDurationDecimal = (minutes: number): string => {
  return (minutes / 60).toFixed(2)
}

// Export all data (for backup)
export const exportAllData = async () => {
  const [
    invoices,
    clients,
    quotations,
    receipts,
    contracts,
    timeEntries,
    settings,
    resumes,
  ] = await Promise.all([
    getInvoices(),
    getClients(),
    getQuotations(),
    getReceipts(),
    getContracts(),
    getTimeEntries(),
    Promise.resolve(getSettings()),
    getResumes(),
  ])

  return {
    invoices,
    clients,
    quotations,
    receipts,
    contracts,
    timeEntries,
    settings,
    resumes,
    exportedAt: new Date().toISOString(),
  }
}

// Import data (from backup)
export const importAllData = async (data: any): Promise<void> => {
  // Import in order to respect foreign key constraints
  if (data.clients) {
    for (const client of data.clients) {
      await saveClient(client)
    }
  }
  if (data.invoices) {
    for (const invoice of data.invoices) {
      await saveInvoice(invoice)
    }
  }
  if (data.quotations) {
    for (const quotation of data.quotations) {
      await saveQuotation(quotation)
    }
  }
  if (data.receipts) {
    for (const receipt of data.receipts) {
      await saveReceipt(receipt)
    }
  }
  if (data.contracts) {
    for (const contract of data.contracts) {
      await saveContract(contract)
    }
  }
  if (data.timeEntries) {
    for (const entry of data.timeEntries) {
      await saveTimeEntry(entry)
    }
  }
  if (data.settings) {
    await saveSettings(data.settings)
  }
  if (data.resumes) {
    for (const resume of data.resumes) {
      await saveResume(resume)
    }
  }
}
