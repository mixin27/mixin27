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
      <>
        <div className="text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </>
    )
  }

  return (
    <>
      {/* Header */}
      <div className="relative border-b border-border/70 pt-32 pb-20">
        <div className="pointer-events-none absolute -top-10 right-0 size-[500px] rounded-full bg-purple-500/8 blur-[120px]" aria-hidden="true" />
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-start justify-between">
            <div>
              <Link href="/tools/resumes" className="mb-8 flex items-center gap-2 font-mono text-[11px] tracking-widest text-purple-400 uppercase transition-colors hover:text-purple-300">
                <ArrowLeft className="size-3" />
                Back to Resumes
              </Link>
              <h1 className="mb-4 text-5xl font-bold tracking-tight">Resume Name</h1>
              <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">Preview and manage your resume</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 rounded-xl border border-border bg-card/60 px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-card"
              >
                <Share2 className="size-4" />
                Share
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 rounded-xl border border-border bg-card/60 px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-card"
              >
                <Printer className="size-4" />
                Print
              </button>
              <button
                onClick={handleDownloadPDF}
                disabled={isGenerating}
                className="flex items-center gap-2 rounded-xl bg-purple-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-purple-400 disabled:opacity-50"
              >
                <Download className="size-4" />
                {isGenerating ? "Generating..." : "Download PDF"}
              </button>
              <Link
                href={`/tools/resumes/${resume.id}/edit`}
                className="flex items-center gap-2 rounded-xl border border-border bg-card/60 px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-card"
              >
                <Edit className="size-4" />
                Edit
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="mx-auto max-w-7xl px-6 py-16 print:p-0">
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
    </>
  )
}
