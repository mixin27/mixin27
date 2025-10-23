import {
  Invoice,
  Client,
  InvoiceSettings,
  Quotation,
  Receipt,
  Contract,
} from '@/types/invoice'

// Storage keys
const STORAGE_KEYS = {
  INVOICES: 'invoices',
  CLIENTS: 'clients',
  SETTINGS: 'invoice_settings',
  QUOTATIONS: 'quotations',
  RECEIPTS: 'receipts',
  CONTRACTS: 'contracts',
} as const

// Helper functions
const getFromStorage = <T>(key: string): T[] => {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : []
}

const saveToStorage = <T>(key: string, data: T[]): void => {
  if (typeof window === 'undefined') return
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
}

export const getNextInvoiceNumber = (): string => {
  const settings = getSettings()
  const number = settings.nextInvoiceNumber
  return `${settings.invoicePrefix}${String(number).padStart(4, '0')}`
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
}

// Settings Operations
const defaultSettings: InvoiceSettings = {
  businessName: 'Your Business Name',
  businessEmail: 'contact@yourbusiness.com',
  businessPhone: '',
  businessAddress: '',
  businessCity: '',
  businessState: '',
  businessZipCode: '',
  businessCountry: '',
  taxId: '',
  logo: '',
  defaultCurrency: 'USD',
  defaultTaxRate: 0,
  defaultPaymentTerms: 'Net 30',
  invoicePrefix: 'INV-',
  nextInvoiceNumber: 1,
}

export const getSettings = (): InvoiceSettings => {
  if (typeof window === 'undefined') return defaultSettings
  const data = localStorage.getItem(STORAGE_KEYS.SETTINGS)
  return data ? JSON.parse(data) : defaultSettings
}

export const saveSettings = (settings: InvoiceSettings): void => {
  if (typeof window === 'undefined') return
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
}

export const getNextReceiptNumber = (): string => {
  const receipts = getReceipts()
  const nextNumber = receipts.length + 1
  return `REC-${String(nextNumber).padStart(4, '0')}`
}

// Statistics
export const getInvoiceStats = () => {
  const invoices = getInvoices()

  return {
    total: invoices.length,
    draft: invoices.filter((i) => i.status === 'draft').length,
    sent: invoices.filter((i) => i.status === 'sent').length,
    paid: invoices.filter((i) => i.status === 'paid').length,
    overdue: invoices.filter((i) => i.status === 'overdue').length,
    totalRevenue: invoices
      .filter((i) => i.status === 'paid')
      .reduce((sum, i) => sum + i.total, 0),
    pendingRevenue: invoices
      .filter((i) => i.status === 'sent' || i.status === 'overdue')
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
}

export const getNextContractNumber = (): string => {
  const contracts = getContracts()
  const nextNumber = contracts.length + 1
  return `CON-${String(nextNumber).padStart(4, '0')}`
}

export const getContractStats = () => {
  const contracts = getContracts()

  return {
    total: contracts.length,
    draft: contracts.filter((c) => c.status === 'draft').length,
    sent: contracts.filter((c) => c.status === 'sent').length,
    signed: contracts.filter((c) => c.status === 'signed').length,
    active: contracts.filter((c) => c.status === 'active').length,
    completed: contracts.filter((c) => c.status === 'completed').length,
  }
}

// Export all data (for backup)
export const exportAllData = () => {
  return {
    invoices: getInvoices(),
    clients: getClients(),
    quotations: getQuotations(),
    receipts: getReceipts(),
    contracts: getContracts(),
    settings: getSettings(),
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
  if (data.settings) saveSettings(data.settings)
}
