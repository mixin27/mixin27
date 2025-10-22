export interface Client {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  country?: string
  taxId?: string
  createdAt: string
}

export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  rate: number
  amount: number
}

export interface Invoice {
  id: string
  invoiceNumber: string
  client: Client
  issueDate: string
  dueDate: string
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  items: InvoiceItem[]
  subtotal: number
  taxRate: number
  taxAmount: number
  discount: number
  discountType: 'percentage' | 'fixed'
  total: number
  notes?: string
  terms?: string
  currency: string
  createdAt: string
  updatedAt: string
}

export interface InvoiceSettings {
  businessName: string
  businessEmail: string
  businessPhone?: string
  businessAddress?: string
  businessCity?: string
  businessState?: string
  businessZipCode?: string
  businessCountry?: string
  taxId?: string
  logo?: string
  defaultCurrency: string
  defaultTaxRate: number
  defaultPaymentTerms: string
  invoicePrefix: string
  nextInvoiceNumber: number
}

export interface Quotation extends Omit<Invoice, 'status'> {
  validUntil: string
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired'
}

export type DocumentType = 'invoice' | 'quotation' | 'receipt'
