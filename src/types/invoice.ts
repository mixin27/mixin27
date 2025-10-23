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

export type DocumentType = 'invoice' | 'quotation' | 'receipt' | 'contract'

export type ContractTemplateType =
  | 'service_agreement'
  | 'project_contract'
  | 'freelance_agreement'
  | 'consulting_agreement'
  | 'maintenance_agreement'

export interface ContractTemplate {
  id: ContractTemplateType
  name: string
  description: string
  content: string // HTML template with {{variables}}
  requiredFields: string[]
}

export interface Contract {
  id: string
  contractNumber: string
  templateType: ContractTemplateType
  templateName: string
  client: Client

  // Project Details
  projectName: string
  projectScope: string
  deliverables: string

  // Dates
  startDate: string
  endDate: string
  signatureDate: string

  // Payment
  projectFee: number
  paymentTerms: string
  currency: string

  // Signatures
  clientSignature?: string // Text or data URL for image
  clientSignatureType: 'text' | 'drawn'
  businessSignature?: string
  businessSignatureType: 'text' | 'drawn'

  // Status
  status: 'draft' | 'sent' | 'signed' | 'active' | 'completed' | 'terminated'

  // Generated content
  generatedContent: string // Final HTML with variables replaced

  notes?: string
  createdAt: string
  updatedAt: string
}

export interface ContractFormData {
  templateType: ContractTemplateType
  clientId: string
  projectName: string
  projectScope: string
  deliverables: string
  startDate: string
  endDate: string
  signatureDate: string
  projectFee: number
  paymentTerms: string
  currency: string
  notes?: string
}
