"use client"

import { useEffect, useState, useRef } from "react"
import { useParams } from "next/navigation"
import { Contract } from "@/types/invoice"
import { ContractPreview } from "@/components/tools/ContractPreview"
import { Download, Printer } from "lucide-react"
import jsPDF from "jspdf"
import html2canvas from "html2canvas-pro"

export default function PublicContractPage() {
    const params = useParams()
    const [contract, setContract] = useState<Contract | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [isGenerating, setIsGenerating] = useState(false)
    const contractRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const fetchContract = async () => {
            try {
                const response = await fetch(`/api/public/contracts/${params.token}`)
                if (!response.ok) {
                    throw new Error("Contract not found")
                }
                const data = await response.json()
                setContract(data.contract)
            } catch (err) {
                setError("Contract not found or expired")
            } finally {
                setLoading(false)
            }
        }

        if (params.token) {
            fetchContract()
        }
    }, [params.token])

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

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <p className="text-muted-foreground">Loading contract...</p>
                </div>
            </div>
        )
    }

    if (error || !contract) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-destructive mb-2">Error</h1>
                    <p className="text-muted-foreground">{error || "Failed to load contract"}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
            {/* Header - Hidden when printing */}
            <div className="bg-white dark:bg-neutral-800 border-b p-4 print:hidden sticky top-0 z-10 shadow-sm">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="font-semibold text-lg">
                        Contract #{contract.contractNumber}
                    </div>
                    <div className="flex gap-3">
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
                            className="inline-flex items-center gap-2 rounded-lg border bg-background px-4 py-2 text-sm font-medium hover:bg-accent transition-colors text-foreground"
                        >
                            <Printer className="size-4" />
                            Print
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto py-8 px-4">
                <div className="max-w-4xl mx-auto">
                    <div ref={contractRef}>
                        <ContractPreview contract={contract} />
                    </div>
                </div>
            </div>
        </div>
    )
}
