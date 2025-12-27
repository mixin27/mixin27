"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save } from "lucide-react"
import {
  saveContract,
  getContractById,
  getClients,
} from "@/lib/storage/tools-storage"
import { Client, Contract } from "@/types/invoice"

export default function EditContractPage() {
  const params = useParams()
  const router = useRouter()

  const [clients, setClients] = useState<Client[]>([])
  const [selectedClientId, setSelectedClientId] = useState<string>("")
  const [contractNumber, setContractNumber] = useState<string>("")

  // Project Details
  const [projectName, setProjectName] = useState<string>("")
  const [projectScope, setProjectScope] = useState<string>("")
  const [deliverables, setDeliverables] = useState<string>("")

  // Dates
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")
  const [signatureDate, setSignatureDate] = useState<string>("")

  // Payment
  const [projectFee, setProjectFee] = useState<number>(0)
  const [paymentTerms, setPaymentTerms] = useState<string>("")
  const [currency, setCurrency] = useState<string>("USD")

  const [status, setStatus] = useState<Contract["status"]>("draft")
  const [notes, setNotes] = useState<string>("")
  const [originalContract, setOriginalContract] = useState<Contract | null>(
    null,
  )

  useEffect(() => {
    const id = params.id as string
    const loadedContract = getContractById(id)
    const loadedClients = getClients()

    if (!loadedContract) {
      router.push("/tools/contracts")
      return
    }

    setOriginalContract(loadedContract)
    setClients(loadedClients)
    setSelectedClientId(loadedContract.client.id)
    setContractNumber(loadedContract.contractNumber)
    setProjectName(loadedContract.projectName)
    setProjectScope(loadedContract.projectScope)
    setDeliverables(loadedContract.deliverables)
    setStartDate(loadedContract.startDate.split("T")[0])
    setEndDate(
      loadedContract.endDate ? loadedContract.endDate.split("T")[0] : "",
    )
    setSignatureDate(loadedContract.signatureDate.split("T")[0])
    setProjectFee(loadedContract.projectFee)
    setPaymentTerms(loadedContract.paymentTerms)
    setCurrency(loadedContract.currency)
    setStatus(loadedContract.status)
    setNotes(loadedContract.notes || "")
  }, [params.id, router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedClientId) {
      alert("Please select a client")
      return
    }

    if (!originalContract) {
      return
    }

    const client = clients.find((c) => c.id === selectedClientId)
    if (!client) {
      alert("Invalid client selected")
      return
    }

    const updatedContract: Contract = {
      ...originalContract,
      contractNumber,
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
      status,
      notes,
      updatedAt: new Date().toISOString(),
    }

    saveContract(updatedContract)
    router.push(`/tools/contracts/${originalContract.id}`)
  }

  if (!originalContract) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container py-6">
          <div className="flex items-center gap-4">
            <Link
              href={`/tools/contracts/${originalContract.id}`}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <ArrowLeft className="size-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Edit Contract</h1>
              <p className="text-muted-foreground">Update contract details</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-8">
          {/* Template Info (Read-only) */}
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-xl font-semibold mb-4">Contract Template</h2>
            <div className="p-4 rounded-lg bg-muted">
              <p className="font-medium">{originalContract.templateName}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Template cannot be changed after creation
              </p>
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
            <h2 className="text-xl font-semibold mb-6">Client</h2>
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

          {/* Signature Notice */}
          {(originalContract.businessSignature ||
            originalContract.clientSignature) && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 dark:bg-blue-950 p-6">
              <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
                Signatures Preserved
              </h3>
              <p className="text-sm text-blue-800 dark:text-blue-300">
                Existing signatures will be preserved. To modify signatures,
                please use the "Sign" buttons on the view page.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4 justify-end">
            <Link
              href={`/tools/contracts/${originalContract.id}`}
              className="rounded-lg border bg-background px-6 py-3 text-sm font-medium hover:bg-accent transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Save className="size-4" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
