"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Download, Printer, Edit, Share2 } from "lucide-react"
import { getResumeById } from "@/lib/storage/tools-storage"
import { Resume } from "@/types/resume"
import { ResumeTemplateRenderer } from "@/components/resume-templates/resume-template-renderer"
import { exportElementToPdf } from "@/lib/pdf-export"

export default function PreviewResumePage() {
  const params = useParams()
  const router = useRouter()
  const [resume, setResume] = useState<Resume | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const resumeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadData = async () => {
      const id = params.id as string
      const loadedResume = await getResumeById(id)
      if (!loadedResume) {
        router.push("/tools/resumes")
        return
      }
      setResume(loadedResume)
    }

    loadData()
  }, [params.id, router])

  const handlePrint = () => {
    window.print()
  }

  const handleDownloadPDF = async () => {
    if (!resumeRef.current || !resume) return

    setIsGenerating(true)
    const element = resumeRef.current
    const originalHeight = element.style.height

    try {
      // Set height to auto to capture full content
      element.style.height = "auto"

      // Wait for layout to settle
      await new Promise((resolve) => setTimeout(resolve, 200))

      await exportElementToPdf(
        element,
        `${resume.name.replace(/\s+/g, "-").toLowerCase()}.pdf`,
        {
          marginMm: 0,
          scale: 3,
        },
      )
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Failed to generate PDF. Please try again.")
    } finally {
      element.style.height = originalHeight
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
            className="bg-white rounded-lg shadow-2xl overflow-visible print:shadow-none print:rounded-none"
          >
            <ResumeTemplateRenderer resume={resume} />
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
