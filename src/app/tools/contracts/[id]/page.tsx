"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
    ArrowLeft,
    Download,
    Printer,
    Edit,
    Trash2,
    PenTool,
    Link as LinkIcon,
    Copy,
    Check,
} from "lucide-react"
import {
    getContractById,
    deleteContract,
    saveContract,
    getSettings,
} from "@/lib/storage/tools-storage"
import { Contract, InvoiceSettings } from "@/types/invoice"
import { formatDate } from "@/lib/utils"
import { getTemplateById, replaceVariables } from "@/lib/contract-templates"
import jsPDF from "jspdf"
import html2canvas from "html2canvas-pro"
import { ContractPreview } from "@/components/tools/ContractPreview"

export default function ContractViewPage() {
    const params = useParams()
    const router = useRouter()
    const [contract, setContract] = useState<Contract | null>(null)
    const [settings, setSettings] = useState<InvoiceSettings | null>(null)
    const [isGenerating, setIsGenerating] = useState(false)
    const [showSignatureModal, setShowSignatureModal] = useState(false)
    const [signatureType, setSignatureType] = useState<"business" | "client">(
        "business",
    )
    const [copied, setCopied] = useState(false)
    const contractRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const loadData = async () => {
            const id = params.id as string
            const [loadedContract, loadedSettings] = await Promise.all([
                getContractById(id),
                Promise.resolve(getSettings()),
            ])

            if (loadedContract) {
                setContract(loadedContract)
                setSettings(loadedSettings)
            } else {
                router.push("/tools/contracts")
            }
        }

        loadData()
    }, [params.id, router])

    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this contract?")) {
            await deleteContract(contract!.id)
            router.push("/tools/contracts")
        }
    }

    const copyPublicLink = () => {
        if (!contract?.token) return
        const url = `${window.location.origin}/p/contracts/${contract.token}`
        navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handlePrint = () => {
        window.print()
    }

    const handleDownloadPDF = async () => {
        if (!contractRef.current) return

        setIsGenerating(true)

        try {
            await new Promise((resolve) => setTimeout(resolve, 100))

            const canvas = await html2canvas(contractRef.current, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: "#ffffff",
                windowWidth: contractRef.current.scrollWidth,
                windowHeight: contractRef.current.scrollHeight,
            })

            const imgData = canvas.toDataURL("image/png")
            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "a4",
            })

            const pdfWidth = pdf.internal.pageSize.getWidth()
            const pdfHeight = pdf.internal.pageSize.getHeight()
            const imgWidth = canvas.width
            const imgHeight = canvas.height
            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
            const imgX = (pdfWidth - imgWidth * ratio) / 2
            const imgY = 0

            pdf.addImage(
                imgData,
                "PNG",
                imgX,
                imgY,
                imgWidth * ratio,
                imgHeight * ratio,
            )
            pdf.save(`${contract?.contractNumber}.pdf`)
        } catch (error) {
            console.error("Error generating PDF:", error)
            alert("Failed to generate PDF. Please try again.")
        } finally {
            setIsGenerating(false)
        }
    }

    const openSignatureModal = (type: "business" | "client") => {
        setSignatureType(type)
        setShowSignatureModal(true)
    }

    const generateContractHTML = () => {
        if (!contract || !settings) return ""

        const template = getTemplateById(contract.templateType)
        if (!template) return ""

        const variables: Record<string, string> = {
            // Business info
            businessName: settings.businessName,
            businessAddress: settings.businessAddress || "",
            businessCity: settings.businessCity || "",
            businessState: settings.businessState || "",
            businessZipCode: settings.businessZipCode || "",
            businessEmail: settings.businessEmail,
            businessPhone: settings.businessPhone || "",

            // Client info
            clientName: contract.client.name,
            clientAddress: contract.client.address || "",
            clientCity: contract.client.city || "",
            clientState: contract.client.state || "",
            clientZipCode: contract.client.zipCode || "",
            clientEmail: contract.client.email,
            clientPhone: contract.client.phone || "",

            // Project details
            projectName: contract.projectName,
            projectScope: contract.projectScope,
            deliverables: contract.deliverables,

            // Dates
            startDate: formatDate(contract.startDate),
            endDate: contract.endDate ? formatDate(contract.endDate) : "Ongoing",
            signatureDate: formatDate(contract.signatureDate),

            // Payment
            currency: contract.currency,
            projectFee: contract.projectFee.toLocaleString(),
            paymentTerms: contract.paymentTerms,

            // Signatures
            businessSignature: contract.businessSignature
                ? contract.businessSignatureType === "drawn"
                    ? `<img src="${contract.businessSignature}" style="max-width: 200px; height: auto;" />`
                    : contract.businessSignature
                : "",
            clientSignature: contract.clientSignature
                ? contract.clientSignatureType === "drawn"
                    ? `<img src="${contract.clientSignature}" style="max-width: 200px; height: auto;" />`
                    : contract.clientSignature
                : "",
        }

        return replaceVariables(template.content, variables)
    }

    if (!contract || !settings) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        )
    }

    const getStatusColor = (status: Contract["status"]) => {
        switch (status) {
            case "signed":
            case "active":
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
            case "sent":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
            case "completed":
                return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
            case "terminated":
                return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
            case "draft":
                return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
        }
    }

    const contractHTML = generateContractHTML()

    return (
        <div className="min-h-screen bg-background">
            {/* Header - Hidden when printing */}
            <div className="border-b bg-card print:hidden">
                <div className="container py-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <Link
                                href="/tools/contracts"
                                className="p-2 hover:bg-muted rounded-lg transition-colors"
                            >
                                <ArrowLeft className="size-5" />
                            </Link>
                            <div>
                                <h1 className="text-3xl font-bold">
                                    {contract.contractNumber}
                                </h1>
                                <p className="text-muted-foreground">{contract.templateName}</p>
                            </div>
                        </div>
                        <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(
                                contract.status,
                            )}`}
                        >
                            {contract.status.charAt(0).toUpperCase() +
                                contract.status.slice(1)}
                        </span>

                    </div>

                    {contract.token && (
                        <div className="mb-6 flex items-center gap-3 bg-muted/50 p-2 rounded-lg border border-border max-w-xl">
                            <div className="bg-primary/10 p-2 rounded-md">
                                <LinkIcon className="size-4 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                                    Public Link
                                </p>
                                <p className="text-sm truncate select-all">
                                    {`${typeof window !== "undefined" ? window.location.origin : ""}/p/contracts/${contract.token}`}
                                </p>
                            </div>
                            <button
                                onClick={copyPublicLink}
                                className="p-2 hover:bg-background rounded-md border border-transparent hover:border-border transition-colors text-muted-foreground hover:text-foreground"
                                title="Copy Link"
                            >
                                {copied ? (
                                    <Check className="size-4 text-green-500" />
                                ) : (
                                    <Copy className="size-4" />
                                )}
                            </button>
                        </div>
                    )}

                    <div className="flex gap-3 flex-wrap">
                        <button
                            onClick={handleDownloadPDF}
                            disabled={isGenerating}
                            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                        >
                            <Download className="size-4" />
                            {isGenerating ? "Generating..." : "Download PDF"}
                        </button>
                        <button
                            onClick={handlePrint}
                            className="inline-flex items-center gap-2 rounded-lg border bg-background px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
                        >
                            <Printer className="size-4" />
                            Print
                        </button>
                        <button
                            onClick={() => openSignatureModal("business")}
                            className="inline-flex items-center gap-2 rounded-lg border bg-background px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
                        >
                            <PenTool className="size-4" />
                            Sign (Business)
                        </button>
                        <button
                            onClick={() => openSignatureModal("client")}
                            className="inline-flex items-center gap-2 rounded-lg border bg-background px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
                        >
                            <PenTool className="size-4" />
                            Sign (Client)
                        </button>
                        <Link
                            href={`/tools/contracts/${contract.id}/edit`}
                            className="inline-flex items-center gap-2 rounded-lg border bg-background px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
                        >
                            <Edit className="size-4" />
                            Edit
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="inline-flex items-center gap-2 rounded-lg border border-destructive text-destructive px-4 py-2 text-sm font-medium hover:bg-destructive/10 transition-colors"
                        >
                            <Trash2 className="size-4" />
                            Delete
                        </button>
                    </div>
                </div>
            </div>

            {/* Contract Preview */}
            <div className="container py-8">
                <div className="max-w-4xl mx-auto">
                    <div ref={contractRef}>
                        <ContractPreview contract={{ ...contract, generatedContent: contractHTML || contract.generatedContent }} />
                    </div>
                </div>
            </div>

            {/* Signature Modal */}
            {
                showSignatureModal && (
                    <SignatureModal
                        contract={contract}
                        signatureType={signatureType}
                        onClose={() => setShowSignatureModal(false)}
                        onSave={async (updatedContract) => {
                            await saveContract(updatedContract)
                            setContract(updatedContract)
                            setShowSignatureModal(false)
                        }}
                    />
                )
            }
        </div >
    )
}

// Signature Modal Component
interface SignatureModalProps {
    contract: Contract
    signatureType: "business" | "client"
    onClose: () => void
    onSave: (contract: Contract) => void
}

function SignatureModal({
    contract,
    signatureType,
    onClose,
    onSave,
}: SignatureModalProps) {
    const [mode, setMode] = useState<"text" | "draw">("text")
    const [textSignature, setTextSignature] = useState("")
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [isDrawing, setIsDrawing] = useState(false)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        ctx.strokeStyle = "#000"
        ctx.lineWidth = 2
        ctx.lineCap = "round"
        ctx.lineJoin = "round"
    }, [])

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        setIsDrawing(true)
        const canvas = canvasRef.current
        if (!canvas) return

        const rect = canvas.getBoundingClientRect()
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        ctx.beginPath()
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top)
    }

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return

        const canvas = canvasRef.current
        if (!canvas) return

        const rect = canvas.getBoundingClientRect()
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top)
        ctx.stroke()
    }

    const stopDrawing = () => {
        setIsDrawing(false)
    }

    const clearCanvas = () => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        ctx.clearRect(0, 0, canvas.width, canvas.height)
    }

    const handleSave = () => {
        const updatedContract = { ...contract }

        if (mode === "text") {
            if (!textSignature.trim()) {
                alert("Please enter your signature")
                return
            }

            if (signatureType === "business") {
                updatedContract.businessSignature = textSignature
                updatedContract.businessSignatureType = "text"
            } else {
                updatedContract.clientSignature = textSignature
                updatedContract.clientSignatureType = "text"
            }
        } else {
            const canvas = canvasRef.current
            if (!canvas) return

            const dataURL = canvas.toDataURL("image/png")

            if (signatureType === "business") {
                updatedContract.businessSignature = dataURL
                updatedContract.businessSignatureType = "drawn"
            } else {
                updatedContract.clientSignature = dataURL
                updatedContract.clientSignatureType = "drawn"
            }
        }

        updatedContract.updatedAt = new Date().toISOString()
        onSave(updatedContract)
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-lg max-w-2xl w-full p-6">
                <h2 className="text-2xl font-bold mb-4">
                    Add {signatureType === "business" ? "Business" : "Client"} Signature
                </h2>

                {/* Mode Selection */}
                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => setMode("text")}
                        className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${mode === "text"
                            ? "bg-primary text-primary-foreground"
                            : "bg-background hover:bg-accent"
                            }`}
                    >
                        Type Signature
                    </button>
                    <button
                        onClick={() => setMode("draw")}
                        className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${mode === "draw"
                            ? "bg-primary text-primary-foreground"
                            : "bg-background hover:bg-accent"
                            }`}
                    >
                        Draw Signature
                    </button>
                </div>

                {/* Signature Input */}
                {mode === "text" ? (
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">
                            Type your full name
                        </label>
                        <input
                            type="text"
                            value={textSignature}
                            onChange={(e) => setTextSignature(e.target.value)}
                            placeholder="John Doe"
                            className="w-full px-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-2xl font-serif"
                            style={{ fontFamily: "Brush Script MT, cursive" }}
                        />
                    </div>
                ) : (
                    <div className="mb-6">
                        <p className="text-sm text-muted-foreground mb-2">
                            Draw your signature below
                        </p>
                        <canvas
                            ref={canvasRef}
                            width={600}
                            height={200}
                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={stopDrawing}
                            onMouseLeave={stopDrawing}
                            className="w-full border-2 border-dashed rounded-lg cursor-crosshair bg-white"
                        />
                        <button
                            onClick={clearCanvas}
                            className="mt-2 text-sm text-destructive hover:underline"
                        >
                            Clear Signature
                        </button>
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg border bg-background hover:bg-accent transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                        Save Signature
                    </button>
                </div>
            </div>
        </div>
    )
}
