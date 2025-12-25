"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Download, Printer, Edit, Share2 } from "lucide-react"
import { getResumeById } from "@/lib/resume-storage"
import { Resume } from "@/types/resume"
import { ModernTemplate } from "@/components/resume-templates/modern-template"
import html2canvas from "html2canvas-pro"
import jsPDF from "jspdf"

export default function PreviewResumePage() {
  const params = useParams()
  const router = useRouter()
  const [resume, setResume] = useState<Resume | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const resumeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const id = params.id as string
    const loadedResume = getResumeById(id)
    if (!loadedResume) {
      router.push("/tools/resumes")
      return
    }
    setResume(loadedResume)
  }, [params.id, router])

  const handlePrint = () => {
    window.print()
  }

  const handleDownloadPDF = async () => {
    if (!resumeRef.current || !resume) return

    setIsGenerating(true)
    try {
      // Capture the resume as canvas
      const canvas = await html2canvas(resumeRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      })

      // Calculate dimensions
      const imgWidth = 210 // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      // Create PDF
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      const imgData = canvas.toDataURL("image/png")
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight)

      // Download
      pdf.save(`${resume.name.replace(/\s+/g, "-").toLowerCase()}.pdf`)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Failed to generate PDF. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleShare = async () => {
    if (!resume) return

    if (navigator.share) {
      try {
        await navigator.share({
          title: resume.name,
          text: `Check out my resume: ${resume.personal.fullName}`,
          url: window.location.href,
        })
      } catch (error) {
        console.error("Error sharing:", error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
  }

  if (!resume) {
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
      <div className="border-b bg-card print:hidden sticky top-0 z-10">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/tools/resumes"
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <ArrowLeft className="size-5" />
              </Link>
              <div>
                <h1 className="text-xl font-bold">{resume.name}</h1>
                <p className="text-sm text-muted-foreground">
                  {resume.personal.fullName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-muted transition-colors"
              >
                <Share2 className="size-4" />
                Share
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-muted transition-colors"
              >
                <Printer className="size-4" />
                Print
              </button>
              <button
                onClick={handleDownloadPDF}
                disabled={isGenerating}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                <Download className="size-4" />
                {isGenerating ? "Generating..." : "Download PDF"}
              </button>
              <Link
                href={`/tools/resumes/${resume.id}/edit`}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors"
              >
                <Edit className="size-4" />
                Edit
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="container py-8 print:p-0">
        <div className="max-w-4xl mx-auto">
          <div
            ref={resumeRef}
            className="bg-white rounded-lg shadow-2xl overflow-hidden print:shadow-none print:rounded-none"
            style={{ minHeight: "1056px" }}
          >
            <ModernTemplate resume={resume} />
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          @page {
            size: A4;
            margin: 0;
          }
        }
      `}</style>
    </div>
  )
}
