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
import { triggerAutoSync } from "./hybrid-storage"
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

// Helper functions
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
export const saveInvoice = (invoice: Invoice): void => {
  const invoices = getFromStorage<Invoice>(STORAGE_KEYS.INVOICES)
  const existingIndex = invoices.findIndex((i) => i.id === invoice.id)

  if (existingIndex >= 0) {
    invoices[existingIndex] = {
      ...invoice,
      updatedAt: new Date().toISOString(),
    }
  } else {
    invoices.push(invoice)
  }

  saveToStorage(STORAGE_KEYS.INVOICES, invoices)
  triggerAutoSync()
}

export const getInvoices = (): Invoice[] => {
  return getFromStorage<Invoice>(STORAGE_KEYS.INVOICES)
}

export const getInvoiceById = (id: string): Invoice | null => {
  const invoices = getInvoices()
  return invoices.find((i) => i.id === id) || null
}

export const deleteInvoice = (id: string): void => {
  const invoices = getInvoices().filter((i) => i.id !== id)
  saveToStorage(STORAGE_KEYS.INVOICES, invoices)
  triggerAutoSync()
}

export const getNextInvoiceNumber = (): string => {
  const settings = getSettings()
  const number = settings.nextInvoiceNumber
  return `${settings.invoicePrefix}${String(number).padStart(4, "0")}`
}

export const incrementInvoiceNumber = (): void => {
  const settings = getSettings()
  settings.nextInvoiceNumber += 1
  saveSettings(settings)
}

// Client Operations
export const saveClient = (client: Client): void => {
  const clients = getFromStorage<Client>(STORAGE_KEYS.CLIENTS)
  const existingIndex = clients.findIndex((c) => c.id === client.id)

  if (existingIndex >= 0) {
    clients[existingIndex] = client
  } else {
    clients.push(client)
  }

  saveToStorage(STORAGE_KEYS.CLIENTS, clients)
  triggerAutoSync()
}

export const getClients = (): Client[] => {
  const clients = getFromStorage<Client>(STORAGE_KEYS.CLIENTS)
  return clients
}

export const getClientById = (id: string): Client | null => {
  const clients = getClients()
  return clients.find((c) => c.id === id) || null
}

export const deleteClient = (id: string): void => {
  const clients = getClients().filter((c) => c.id !== id)
  saveToStorage(STORAGE_KEYS.CLIENTS, clients)
  triggerAutoSync()
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

export const saveSettings = (settings: InvoiceSettings): void => {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings))
}

// Quotation Operations
export const saveQuotation = (quotation: Quotation): void => {
  const quotations = getFromStorage<Quotation>(STORAGE_KEYS.QUOTATIONS)
  const existingIndex = quotations.findIndex((q) => q.id === quotation.id)

  if (existingIndex >= 0) {
    quotations[existingIndex] = {
      ...quotation,
      updatedAt: new Date().toISOString(),
    }
  } else {
    quotations.push(quotation)
  }

  saveToStorage(STORAGE_KEYS.QUOTATIONS, quotations)
  triggerAutoSync()
}

export const getQuotations = (): Quotation[] => {
  return getFromStorage<Quotation>(STORAGE_KEYS.QUOTATIONS)
}

export const getQuotationById = (id: string): Quotation | null => {
  const quotations = getQuotations()
  return quotations.find((q) => q.id === id) || null
}

export const deleteQuotation = (id: string): void => {
  const quotations = getQuotations().filter((q) => q.id !== id)
  saveToStorage(STORAGE_KEYS.QUOTATIONS, quotations)
  triggerAutoSync()
}

// Receipt Operations
export const saveReceipt = (receipt: Receipt): void => {
  const receipts = getFromStorage<Receipt>(STORAGE_KEYS.RECEIPTS)
  const existingIndex = receipts.findIndex((r) => r.id === receipt.id)

  if (existingIndex >= 0) {
    receipts[existingIndex] = {
      ...receipt,
      updatedAt: new Date().toISOString(),
    }
  } else {
    receipts.push(receipt)
  }

  saveToStorage(STORAGE_KEYS.RECEIPTS, receipts)
  triggerAutoSync()
}

export const getReceipts = (): Receipt[] => {
  return getFromStorage<Receipt>(STORAGE_KEYS.RECEIPTS)
}

export const getReceiptById = (id: string): Receipt | null => {
  const receipts = getReceipts()
  return receipts.find((r) => r.id === id) || null
}

export const deleteReceipt = (id: string): void => {
  const receipts = getReceipts().filter((r) => r.id !== id)
  saveToStorage(STORAGE_KEYS.RECEIPTS, receipts)
  triggerAutoSync()
}

export const getNextReceiptNumber = (): string => {
  const receipts = getReceipts()
  const nextNumber = receipts.length + 1
  return `REC-${String(nextNumber).padStart(4, "0")}`
}

// Statistics
export const getInvoiceStats = () => {
  const invoices = getInvoices()

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

export const getReceiptStats = () => {
  const receipts = getReceipts()

  return {
    total: receipts.length,
    totalAmount: receipts.reduce((sum, r) => sum + r.amountPaid, 0),
  }
}

// Contract Operations
export const saveContract = (contract: Contract): void => {
  const contracts = getFromStorage<Contract>(STORAGE_KEYS.CONTRACTS)
  const existingIndex = contracts.findIndex((c) => c.id === contract.id)

  if (existingIndex >= 0) {
    contracts[existingIndex] = {
      ...contract,
      updatedAt: new Date().toISOString(),
    }
  } else {
    contracts.push(contract)
  }

  saveToStorage(STORAGE_KEYS.CONTRACTS, contracts)
  triggerAutoSync()
}

export const getContracts = (): Contract[] => {
  return getFromStorage<Contract>(STORAGE_KEYS.CONTRACTS)
}

export const getContractById = (id: string): Contract | null => {
  const contracts = getContracts()
  return contracts.find((c) => c.id === id) || null
}

export const deleteContract = (id: string): void => {
  const contracts = getContracts().filter((c) => c.id !== id)
  saveToStorage(STORAGE_KEYS.CONTRACTS, contracts)
  triggerAutoSync()
}

export const getNextContractNumber = (): string => {
  const contracts = getContracts()
  const nextNumber = contracts.length + 1
  return `CON-${String(nextNumber).padStart(4, "0")}`
}

export const getContractStats = () => {
  const contracts = getContracts()

  return {
    total: contracts.length,
    draft: contracts.filter((c) => c.status === "draft").length,
    sent: contracts.filter((c) => c.status === "sent").length,
    signed: contracts.filter((c) => c.status === "signed").length,
    active: contracts.filter((c) => c.status === "active").length,
    completed: contracts.filter((c) => c.status === "completed").length,
  }
}

// Time Entry Operations
export const saveTimeEntry = (entry: TimeEntry): void => {
  const entries = getFromStorage<TimeEntry>(STORAGE_KEYS.TIME_ENTRIES)
  const existingIndex = entries.findIndex((e) => e.id === entry.id)

  if (existingIndex >= 0) {
    entries[existingIndex] = {
      ...entry,
      updatedAt: new Date().toISOString(),
    }
  } else {
    entries.push(entry)
  }

  saveToStorage(STORAGE_KEYS.TIME_ENTRIES, entries)
  triggerAutoSync()
}

export const getTimeEntries = (): TimeEntry[] => {
  return getFromStorage<TimeEntry>(STORAGE_KEYS.TIME_ENTRIES)
}

export const getTimeEntryById = (id: string): TimeEntry | null => {
  const entries = getTimeEntries()
  return entries.find((e) => e.id === id) || null
}

export const deleteTimeEntry = (id: string): void => {
  const entries = getTimeEntries().filter((e) => e.id !== id)
  saveToStorage(STORAGE_KEYS.TIME_ENTRIES, entries)
  triggerAutoSync()
}

export const getTimeEntriesByClient = (clientId: string): TimeEntry[] => {
  return getTimeEntries().filter((e) => e.clientId === clientId)
}

export const getTimeEntriesByDateRange = (
  startDate: string,
  endDate: string,
): TimeEntry[] => {
  const entries = getTimeEntries()
  return entries.filter((e) => {
    const entryDate = new Date(e.date)
    const start = new Date(startDate)
    const end = new Date(endDate)
    return entryDate >= start && entryDate <= end
  })
}

export const getUninvoicedTimeEntries = (): TimeEntry[] => {
  return getTimeEntries().filter((e) => e.billable && !e.invoiced)
}

export const markTimeEntriesAsInvoiced = (
  entryIds: string[],
  invoiceId: string,
): void => {
  const entries = getTimeEntries()
  entries.forEach((entry) => {
    if (entryIds.includes(entry.id)) {
      entry.invoiced = true
      entry.invoiceId = invoiceId
    }
  })
  saveToStorage(STORAGE_KEYS.TIME_ENTRIES, entries)
  triggerAutoSync()
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
export const getTimeTrackingStats = (): TimeTrackingStats => {
  const entries = getTimeEntries()
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

/** Resume */
export const saveResume = (resume: Resume): void => {
  const resumes = getFromStorage<Resume>(STORAGE_KEYS.RESUMES)
  const existingIndex = resumes.findIndex((r) => r.id === resume.id)

  if (existingIndex >= 0) {
    resumes[existingIndex] = {
      ...resume,
      updatedAt: new Date().toISOString(),
    }
  } else {
    resumes.push(resume)
  }

  saveToStorage<Resume>(STORAGE_KEYS.RESUMES, resumes)

  triggerAutoSync()
}

export const getResumes = (): Resume[] => {
  return getFromStorage<Resume>(STORAGE_KEYS.RESUMES)
}

export const getResumeById = (id: string): Resume | null => {
  const resumes = getResumes()
  return resumes.find((r) => r.id === id) || null
}

export const deleteResume = (id: string): void => {
  const resumes = getResumes().filter((r) => r.id !== id)
  saveToStorage<Resume>(STORAGE_KEYS.RESUMES, resumes)
  triggerAutoSync()
}

export const duplicateResume = (id: string): Resume | null => {
  const original = getResumeById(id)
  if (!original) return null

  const duplicate: Resume = {
    ...original,
    id: uuidv7(),
    name: `${original.name} (Copy)`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  saveResume(duplicate)
  return duplicate
}

// Statistics
export const getResumeStats = (): ResumeStats => {
  const resumes = getResumes()

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
export const exportResumeJSON = (id: string): string => {
  const resume = getResumeById(id)
  if (!resume) throw new Error("Resume not found")
  return JSON.stringify(resume, null, 2)
}

// Import resume from JSON
export const importResumeJSON = (jsonString: string): Resume => {
  const resume = JSON.parse(jsonString) as Resume
  resume.id = uuidv7()
  resume.createdAt = new Date().toISOString()
  resume.updatedAt = new Date().toISOString()
  saveResume(resume)
  triggerAutoSync()
  return resume
}

// Export all resumes (backup)
export const exportAllResumes = () => {
  return {
    resumes: getResumes(),
    exportedAt: new Date().toISOString(),
  }
}

// Import all resumes (restore from backup)
export const importAllResumes = (data: { resumes: Resume[] }): void => {
  if (data.resumes) {
    saveToStorage<Resume>(STORAGE_KEYS.RESUMES, data.resumes)
  }
}

// Default resume template
export const createDefaultResume = (): Resume => {
  return {
    // id: `resume_${Date.now()}`,
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
        id: "personal",
        type: "personal",
        title: "Personal Information",
        visible: true,
        order: 0,
      },
      {
        id: "summary",
        type: "summary",
        title: "Professional Summary",
        visible: true,
        order: 1,
      },
      {
        id: "experience",
        type: "experience",
        title: "Work Experience",
        visible: true,
        order: 2,
      },
      {
        id: "education",
        type: "education",
        title: "Education",
        visible: true,
        order: 3,
      },
      {
        id: "skills",
        type: "skills",
        title: "Skills",
        visible: true,
        order: 4,
      },
      {
        id: "projects",
        type: "projects",
        title: "Projects",
        visible: false,
        order: 5,
      },
      {
        id: "certifications",
        type: "certifications",
        title: "Certifications",
        visible: false,
        order: 6,
      },
      {
        id: "languages",
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
export const exportAllData = () => {
  return {
    invoices: getInvoices(),
    clients: getClients(),
    quotations: getQuotations(),
    receipts: getReceipts(),
    contracts: getContracts(),
    timeEntries: getTimeEntries(),
    settings: getSettings(),
    resumes: getResumes(),
    exportedAt: new Date().toISOString(),
  }
}

// Import data (from backup)
export const importAllData = (data: any) => {
  if (data.invoices) saveToStorage(STORAGE_KEYS.INVOICES, data.invoices)
  if (data.clients) saveToStorage(STORAGE_KEYS.CLIENTS, data.clients)
  if (data.quotations) saveToStorage(STORAGE_KEYS.QUOTATIONS, data.quotations)
  if (data.receipts) saveToStorage(STORAGE_KEYS.RECEIPTS, data.receipts)
  if (data.contracts) saveToStorage(STORAGE_KEYS.CONTRACTS, data.contracts)
  if (data.timeEntries)
    saveToStorage(STORAGE_KEYS.TIME_ENTRIES, data.timeEntries)
  if (data.resumes) saveToStorage(STORAGE_KEYS.RESUMES, data.resumes)
  if (data.settings) saveSettings(data.settings)
}
