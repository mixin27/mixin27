"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, FileText } from "lucide-react"
import {
  saveContract,
  getClients,
  getSettings,
  getNextContractNumber,
  getClientById,
} from "@/lib/storage/tools-storage"
import { Client, Contract, ContractTemplateType } from "@/types/invoice"
import { contractTemplates } from "@/lib/contract-templates"

export default function NewContractForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preSelectedClientId = searchParams.get("clientId")

  const [clients, setClients] = useState<Client[]>([])
  const [selectedClientId, setSelectedClientId] = useState<string>("")
  const [contractNumber, setContractNumber] = useState<string>("")
  const [templateType, setTemplateType] =
    useState<ContractTemplateType>("service_agreement")

  // Project Details
  const [projectName, setProjectName] = useState<string>("")
  const [projectScope, setProjectScope] = useState<string>("")
  const [deliverables, setDeliverables] = useState<string>("")

  // Dates
  const [startDate, setStartDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  )
  const [endDate, setEndDate] = useState<string>(() => {
    const date = new Date()
    date.setMonth(date.getMonth() + 3)
    return date.toISOString().split("T")[0]
  })
  const [signatureDate, setSignatureDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  )

  // Payment
  const [projectFee, setProjectFee] = useState<number>(0)
  const [paymentTerms, setPaymentTerms] = useState<string>(
    "50% upfront, 50% upon completion",
  )
  const [currency, setCurrency] = useState<string>("USD")

  const [status, setStatus] = useState<Contract["status"]>("draft")
  const [notes, setNotes] = useState<string>("")

  useEffect(() => {
    const loadedClients = getClients()
    const settings = getSettings()

    setClients(loadedClients)
    setContractNumber(getNextContractNumber())
    setCurrency(settings.defaultCurrency)
    setPaymentTerms(settings.defaultPaymentTerms)

    if (preSelectedClientId) {
      const client = getClientById(preSelectedClientId)
      if (client) {
        setSelectedClientId(preSelectedClientId)
      }
    }
  }, [preSelectedClientId])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedClientId) {
      alert("Please select a client")
      return
    }

    const client = clients.find((c) => c.id === selectedClientId)
    if (!client) {
      alert("Invalid client selected")
      return
    }

    const template = contractTemplates.find((t) => t.id === templateType)
    if (!template) {
      alert("Invalid template selected")
      return
    }

    const contract: Contract = {
      id: crypto.randomUUID(),
      contractNumber,
      templateType,
      templateName: template.name,
      client,
      projectName,
      projectScope,
      deliverables,
      startDate,
      endDate,
      signatureDate,
      projectFee,
      paymentTerms,
      currency,
      clientSignature: undefined,
      clientSignatureType: "text",
      businessSignature: undefined,
      businessSignatureType: "text",
      status,
      generatedContent: "", // Will be generated when viewing
      notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    saveContract(contract)
    router.push("/tools/contracts")
  }

  const selectedTemplate = contractTemplates.find((t) => t.id === templateType)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container py-6">
          <div className="flex items-center gap-4">
            <Link
              href="/tools/contracts"
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <ArrowLeft className="size-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold">New Contract</h1>
              <p className="text-muted-foreground">
                Create a new contract from template
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-8">
          {/* Template Selection */}
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-xl font-semibold mb-6">Contract Template</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contractTemplates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => setTemplateType(template.id)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedTemplate?.id === template.id
                      ? "border-primary/50 bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <FileText
                      className={`size-5 mt-1 ${
                        templateType === template.id
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    />
                    <div>
                      <h3 className="font-semibold mb-1">{template.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {template.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Basic Info */}
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-xl font-semibold mb-6">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Contract Number <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={contractNumber}
                  onChange={(e) => setContractNumber(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value as Contract["status"])
                  }
                  className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="draft">Draft</option>
                  <option value="sent">Sent</option>
                  <option value="signed">Signed</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="terminated">Terminated</option>
                </select>
              </div>
            </div>
          </div>

          {/* Client Selection */}
          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Client</h2>
              <Link
                href="/tools/invoices/clients/new"
                className="text-sm text-primary hover:underline"
              >
                + Add New Client
              </Link>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Select Client <span className="text-destructive">*</span>
              </label>
              <select
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="">Choose a client...</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name} ({client.email})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Project Details */}
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-xl font-semibold mb-6">Project Details</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Project Name <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g., Website Redesign Project"
                  className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Scope of Work <span className="text-destructive">*</span>
                </label>
                <textarea
                  value={projectScope}
                  onChange={(e) => setProjectScope(e.target.value)}
                  rows={6}
                  placeholder="Describe the scope of work, responsibilities, and expectations..."
                  className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Deliverables <span className="text-destructive">*</span>
                </label>
                <textarea
                  value={deliverables}
                  onChange={(e) => setDeliverables(e.target.value)}
                  rows={6}
                  placeholder="List all deliverables, milestones, and what will be provided..."
                  className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-xl font-semibold mb-6">Timeline</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Start Date <span className="text-destructive">*</span>
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Signature Date <span className="text-destructive">*</span>
                </label>
                <input
                  type="date"
                  value={signatureDate}
                  onChange={(e) => setSignatureDate(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
            </div>
          </div>

          {/* Payment Terms */}
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-xl font-semibold mb-6">Payment Terms</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Project Fee <span className="text-destructive">*</span>
                </label>
                <input
                  type="number"
                  value={projectFee}
                  onChange={(e) => setProjectFee(Number(e.target.value))}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="MMK">MMK - Myanmar Kyat</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="CAD">CAD - Canadian Dollar</option>
                  <option value="AUD">AUD - Australian Dollar</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">
                  Payment Terms <span className="text-destructive">*</span>
                </label>
                <textarea
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  rows={3}
                  placeholder="e.g., 50% upfront, 50% upon completion"
                  className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-xl font-semibold mb-6">Additional Notes</h2>
            <div>
              <label className="block text-sm font-medium mb-2">
                Internal Notes (optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder="Add any internal notes or reminders..."
                className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
              <p className="text-xs text-muted-foreground mt-2">
                These notes are for internal use only and won't appear in the
                contract.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 justify-end">
            <Link
              href="/tools/contracts"
              className="rounded-lg border bg-background px-6 py-3 text-sm font-medium hover:bg-accent transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Save className="size-4" />
              Create Contract
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
