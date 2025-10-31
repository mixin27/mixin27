import { sql } from "@vercel/postgres"
import {
  Client,
  Invoice,
  //   Quotation,
  //   Receipt,
  //   Contract,
  //   TimeEntry,
  InvoiceSettings,
} from "@/types/invoice"

// Helper to convert snake_case to camelCase for database rows
function toCamelCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(toCamelCase)
  }
  if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase())
      result[camelKey] = toCamelCase(obj[key])
      return result
    }, {} as any)
  }
  return obj
}

// Helper to convert camelCase to snake_case for database inserts
function toSnakeCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(toSnakeCase)
  }
  if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      const snakeKey = key.replace(
        /[A-Z]/g,
        (letter) => `_${letter.toLowerCase()}`,
      )
      result[snakeKey] = toSnakeCase(obj[key])
      return result
    }, {} as any)
  }
  return obj
}

// Client Operations
export async function dbSaveClient(client: Client) {
  const snakeClient = toSnakeCase(client)
  await sql`
    INSERT INTO clients (id, name, email, phone, address, city, state, zip_code, country, tax_id, created_at)
    VALUES (
      ${snakeClient.id},
      ${snakeClient.name},
      ${snakeClient.email},
      ${snakeClient.phone || null},
      ${snakeClient.address || null},
      ${snakeClient.city || null},
      ${snakeClient.state || null},
      ${snakeClient.zip_code || null},
      ${snakeClient.country || null},
      ${snakeClient.tax_id || null},
      ${snakeClient.created_at}
    )
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      email = EXCLUDED.email,
      phone = EXCLUDED.phone,
      address = EXCLUDED.address,
      city = EXCLUDED.city,
      state = EXCLUDED.state,
      zip_code = EXCLUDED.zip_code,
      country = EXCLUDED.country,
      tax_id = EXCLUDED.tax_id
  `
}

export async function dbGetClients(): Promise<Client[]> {
  const { rows } = await sql`SELECT * FROM clients ORDER BY created_at DESC`
  return toCamelCase(rows)
}

export async function dbGetClientById(id: string): Promise<Client | null> {
  const { rows } = await sql`SELECT * FROM clients WHERE id = ${id}`
  return rows.length > 0 ? toCamelCase(rows[0]) : null
}

export async function dbDeleteClient(id: string) {
  await sql`DELETE FROM clients WHERE id = ${id}`
}

// Invoice Operations
export async function dbSaveInvoice(invoice: Invoice) {
  const snakeInvoice = toSnakeCase(invoice)
  await sql`
    INSERT INTO invoices (
      id, invoice_number, client_id, issue_date, due_date, status,
      items, subtotal, tax_rate, tax_amount, discount, discount_type,
      total, notes, terms, currency, created_at, updated_at
    )
    VALUES (
      ${snakeInvoice.id},
      ${snakeInvoice.invoice_number},
      ${snakeInvoice.client.id},
      ${snakeInvoice.issue_date},
      ${snakeInvoice.due_date},
      ${snakeInvoice.status},
      ${JSON.stringify(snakeInvoice.items)},
      ${snakeInvoice.subtotal},
      ${snakeInvoice.tax_rate},
      ${snakeInvoice.tax_amount},
      ${snakeInvoice.discount},
      ${snakeInvoice.discount_type},
      ${snakeInvoice.total},
      ${snakeInvoice.notes || null},
      ${snakeInvoice.terms || null},
      ${snakeInvoice.currency},
      ${snakeInvoice.created_at},
      ${snakeInvoice.updated_at}
    )
    ON CONFLICT (id) DO UPDATE SET
      status = EXCLUDED.status,
      items = EXCLUDED.items,
      subtotal = EXCLUDED.subtotal,
      tax_rate = EXCLUDED.tax_rate,
      tax_amount = EXCLUDED.tax_amount,
      discount = EXCLUDED.discount,
      discount_type = EXCLUDED.discount_type,
      total = EXCLUDED.total,
      notes = EXCLUDED.notes,
      terms = EXCLUDED.terms,
      updated_at = EXCLUDED.updated_at
  `
}

export async function dbGetInvoices(): Promise<Invoice[]> {
  const { rows } = await sql`
    SELECT i.*,
           json_build_object(
             'id', c.id,
             'name', c.name,
             'email', c.email,
             'phone', c.phone,
             'address', c.address,
             'city', c.city,
             'state', c.state,
             'zipCode', c.zip_code,
             'country', c.country,
             'taxId', c.tax_id,
             'createdAt', c.created_at
           ) as client
    FROM invoices i
    JOIN clients c ON i.client_id = c.id
    ORDER BY i.created_at DESC
  `
  return toCamelCase(rows)
}

export async function dbGetInvoiceById(id: string): Promise<Invoice | null> {
  const { rows } = await sql`
    SELECT i.*,
           json_build_object(
             'id', c.id,
             'name', c.name,
             'email', c.email,
             'phone', c.phone,
             'address', c.address,
             'city', c.city,
             'state', c.state,
             'zipCode', c.zip_code,
             'country', c.country,
             'taxId', c.tax_id,
             'createdAt', c.created_at
           ) as client
    FROM invoices i
    JOIN clients c ON i.client_id = c.id
    WHERE i.id = ${id}
  `
  return rows.length > 0 ? toCamelCase(rows[0]) : null
}

export async function dbDeleteInvoice(id: string) {
  await sql`DELETE FROM invoices WHERE id = ${id}`
}

// Settings Operations
export async function dbGetSettings(): Promise<InvoiceSettings> {
  const { rows } = await sql`SELECT * FROM settings WHERE id = 1`
  if (rows.length === 0) {
    // Return defaults if no settings found
    return {
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
  }
  return toCamelCase(rows[0])
}

export async function dbSaveSettings(settings: InvoiceSettings) {
  const s = toSnakeCase(settings)
  await sql`
    UPDATE settings SET
      business_name = ${s.business_name},
      business_email = ${s.business_email},
      business_phone = ${s.business_phone || null},
      business_address = ${s.business_address || null},
      business_city = ${s.business_city || null},
      business_state = ${s.business_state || null},
      business_zip_code = ${s.business_zip_code || null},
      business_country = ${s.business_country || null},
      tax_id = ${s.tax_id || null},
      logo = ${s.logo || null},
      default_currency = ${s.default_currency},
      default_tax_rate = ${s.default_tax_rate},
      default_payment_terms = ${s.default_payment_terms},
      invoice_prefix = ${s.invoice_prefix},
      next_invoice_number = ${s.next_invoice_number}
    WHERE id = 1
  `
}

export async function dbIncrementInvoiceNumber() {
  await sql`UPDATE settings SET next_invoice_number = next_invoice_number + 1 WHERE id = 1`
}

// Add similar functions for quotations, receipts, contracts, and time_entries
// Following the same pattern as above
