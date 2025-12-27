import {
  Invoice,
  Client,
  InvoiceSettings,
  Quotation,
  Receipt,
  Contract,
  TimeEntry,
} from "@/types/invoice"

// API base URL
const API_BASE = "/api"

// Helper function for API calls
async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.error || "API call failed")
  }

  return response.json()
}

// Client Operations
export const saveClient = async (client: Client): Promise<void> => {
  await apiCall("/clients", {
    method: "POST",
    body: JSON.stringify(client),
  })
}

export const getClients = async (): Promise<Client[]> => {
  return apiCall<Client[]>("/clients")
}

export const getClientById = async (id: string): Promise<Client | null> => {
  try {
    return await apiCall<Client>(`/clients?id=${id}`)
  } catch {
    return null
  }
}

export const deleteClient = async (id: string): Promise<void> => {
  await apiCall(`/clients?id=${id}`, { method: "DELETE" })
}

// Invoice Operations
export const saveInvoice = async (invoice: Invoice): Promise<void> => {
  await apiCall("/invoices", {
    method: "POST",
    body: JSON.stringify(invoice),
  })
}

export const getInvoices = async (): Promise<Invoice[]> => {
  return apiCall<Invoice[]>("/invoices")
}

export const getInvoiceById = async (id: string): Promise<Invoice | null> => {
  try {
    return await apiCall<Invoice>(`/invoices?id=${id}`)
  } catch {
    return null
  }
}

export const deleteInvoice = async (id: string): Promise<void> => {
  await apiCall(`/invoices?id=${id}`, { method: "DELETE" })
}

export const getNextInvoiceNumber = async (): Promise<string> => {
  const settings = await getSettings()
  const number = settings.nextInvoiceNumber
  return `${settings.invoicePrefix}${String(number).padStart(4, "0")}`
}

export const incrementInvoiceNumber = async (): Promise<void> => {
  await apiCall("/settings/increment-invoice", { method: "POST" })
}

// Settings Operations
export const getSettings = async (): Promise<InvoiceSettings> => {
  return apiCall<InvoiceSettings>("/settings")
}

export const saveSettings = async (
  settings: InvoiceSettings,
): Promise<void> => {
  await apiCall("/settings", {
    method: "POST",
    body: JSON.stringify(settings),
  })
}

// Quotation Operations
export const saveQuotation = async (quotation: Quotation): Promise<void> => {
  await apiCall("/quotations", {
    method: "POST",
    body: JSON.stringify(quotation),
  })
}

export const getQuotations = async (): Promise<Quotation[]> => {
  return apiCall<Quotation[]>("/quotations")
}

export const getQuotationById = async (
  id: string,
): Promise<Quotation | null> => {
  try {
    return await apiCall<Quotation>(`/quotations?id=${id}`)
  } catch {
    return null
  }
}

export const deleteQuotation = async (id: string): Promise<void> => {
  await apiCall(`/quotations?id=${id}`, { method: "DELETE" })
}

// Receipt Operations
export const saveReceipt = async (receipt: Receipt): Promise<void> => {
  await apiCall("/receipts", {
    method: "POST",
    body: JSON.stringify(receipt),
  })
}

export const getReceipts = async (): Promise<Receipt[]> => {
  return apiCall<Receipt[]>("/receipts")
}

export const getReceiptById = async (id: string): Promise<Receipt | null> => {
  try {
    return await apiCall<Receipt>(`/receipts?id=${id}`)
  } catch {
    return null
  }
}

export const deleteReceipt = async (id: string): Promise<void> => {
  await apiCall(`/receipts?id=${id}`, { method: "DELETE" })
}

export const getNextReceiptNumber = async (): Promise<string> => {
  const receipts = await getReceipts()
  const nextNumber = receipts.length + 1
  return `REC-${String(nextNumber).padStart(4, "0")}`
}

// Contract Operations
export const saveContract = async (contract: Contract): Promise<void> => {
  await apiCall("/contracts", {
    method: "POST",
    body: JSON.stringify(contract),
  })
}

export const getContracts = async (): Promise<Contract[]> => {
  return apiCall<Contract[]>("/contracts")
}

export const getContractById = async (id: string): Promise<Contract | null> => {
  try {
    return await apiCall<Contract>(`/contracts?id=${id}`)
  } catch {
    return null
  }
}

export const deleteContract = async (id: string): Promise<void> => {
  await apiCall(`/contracts?id=${id}`, { method: "DELETE" })
}

export const getNextContractNumber = async (): Promise<string> => {
  const contracts = await getContracts()
  const nextNumber = contracts.length + 1
  return `CON-${String(nextNumber).padStart(4, "0")}`
}

// Time Entry Operations
export const saveTimeEntry = async (entry: TimeEntry): Promise<void> => {
  await apiCall("/time-entries", {
    method: "POST",
    body: JSON.stringify(entry),
  })
}

export const getTimeEntries = async (): Promise<TimeEntry[]> => {
  return apiCall<TimeEntry[]>("/time-entries")
}

export const getTimeEntryById = async (
  id: string,
): Promise<TimeEntry | null> => {
  try {
    return await apiCall<TimeEntry>(`/time-entries?id=${id}`)
  } catch {
    return null
  }
}

export const deleteTimeEntry = async (id: string): Promise<void> => {
  await apiCall(`/time-entries?id=${id}`, { method: "DELETE" })
}

// Statistics (client-side calculations for now)
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

// Export/Import for migration
export const exportAllData = async () => {
  const [
    invoices,
    clients,
    quotations,
    receipts,
    contracts,
    timeEntries,
    settings,
  ] = await Promise.all([
    getInvoices(),
    getClients(),
    getQuotations(),
    getReceipts(),
    getContracts(),
    getTimeEntries(),
    getSettings(),
  ])

  return {
    invoices,
    clients,
    quotations,
    receipts,
    contracts,
    timeEntries,
    settings,
    exportedAt: new Date().toISOString(),
  }
}

export const importAllData = async (data: any) => {
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
}
