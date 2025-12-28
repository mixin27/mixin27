"use client"

import { useEffect, useState, useRef } from "react"
import { useParams } from "next/navigation"
import { Quotation, InvoiceSettings } from "@/types/invoice"
import { QuotationPreview } from "@/components/tools/QuotationPreview"
import { Download, Printer } from "lucide-react"
import jsPDF from "jspdf"
import html2canvas from "html2canvas-pro"

export default function PublicQuotationPage() {
    const params = useParams()
    const [quotation, setQuotation] = useState<Quotation | null>(null)
    const [settings, setSettings] = useState<InvoiceSettings | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [isGenerating, setIsGenerating] = useState(false)
    const quotationRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const fetchQuotation = async () => {
            try {
                const response = await fetch(`/api/public/quotations/${params.token}`)
                if (!response.ok) {
                    throw new Error("Quotation not found")
                }
                const data = await response.json()
                setQuotation(data.quotation)
                setSettings(data.settings)
            } catch (err) {
                setError("Quotation not found or expired")
            } finally {
                setLoading(false)
            }
        }

        if (params.token) {
            fetchQuotation()
        }
    }, [params.token])

    const handlePrint = () => {
        window.print()
    }

    const handleDownloadPDF = async () => {
        if (!quotationRef.current) return

        setIsGenerating(true)

        try {
            const canvas = await html2canvas(quotationRef.current, {
                scale: 2,
                useCORS: true,
                logging: false,
            })

            const imgData = canvas.toDataURL("image/png")
            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "a4",
            })

            const imgWidth = 210
            const imgHeight = (canvas.height * imgWidth) / canvas.width

            pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight)
            pdf.save(`${quotation?.invoiceNumber}.pdf`)
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
                    <p className="text-muted-foreground">Loading quotation...</p>
                </div>
            </div>
        )
    }

    if (error || !quotation || !settings) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-destructive mb-2">Error</h1>
                    <p className="text-muted-foreground">{error || "Failed to load quotation"}</p>
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
                        Quotation #{quotation.invoiceNumber}
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
                    <div ref={quotationRef}>
                        <QuotationPreview quotation={quotation} settings={settings} />
                    </div>
                </div>
            </div>
        </div>
    )
}
