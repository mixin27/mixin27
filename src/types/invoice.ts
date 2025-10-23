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

export interface Receipt {
  id: string
  receiptNumber: string
  client: Client
  paymentDate: string
  paymentMethod:
    | 'cash'
    | 'check'
    | 'bank_transfer'
    | 'credit_card'
    | 'paypal'
    | 'kbz_pay'
    | 'aya_pay'
    | 'wave_pay'
    | 'uab_pay'
    | 'cb_pay'
    | 'other'
  relatedInvoiceNumber?: string
  items: InvoiceItem[]
  subtotal: number
  taxRate: number
  taxAmount: number
  discount: number
  discountType: 'percentage' | 'fixed'
  total: number
  amountPaid: number
  notes?: string
  currency: string
  createdAt: string
  updatedAt: string
}

export type DocumentType = 'invoice' | 'quotation' | 'receipt'
