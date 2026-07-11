"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Check } from "lucide-react"
import { createDefaultResume, saveResume } from "@/lib/storage/tools-storage"
import { ResumeTemplate } from "@/types/resume"

const templates: Array<{
  id: ResumeTemplate
  name: string
  description: string
  preview: string
}> = [
  {
    id: "modern",
    name: "Modern",
    description: "Clean and contemporary design with bold accents",
    preview: "🎨",
  },
  {
    id: "classic",
    name: "Classic",
    description: "Traditional professional layout",
    preview: "📄",
  },
  {
    id: "creative",
    name: "Creative",
    description: "Unique design for creative professionals",
    preview: "✨",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Simple and elegant with focus on content",
    preview: "▪️",
  },
  {
    id: "professional",
    name: "Professional",
    description: "Corporate-friendly design",
    preview: "💼",
  },
]

export default function NewResumeForm() {
  const router = useRouter()
  const [selectedTemplate, setSelectedTemplate] =
    useState<ResumeTemplate>("modern")
  const [resumeName, setResumeName] = useState("My Resume")

  const handleCreate = async () => {
    const resume = createDefaultResume()
    resume.name = resumeName
    resume.template = selectedTemplate
    resume.style.template = selectedTemplate
    await saveResume(resume)
    router.push(`/tools/resumes/${resume.id}/edit`)
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
              <h1 className="mb-4 text-5xl font-bold tracking-tight">New Resume</h1>
              <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">Create a new professional resume</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* Resume Name */}
        <div className="mb-8">
          <label className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase mb-2">Resume Name</label>
          <input
            type="text"
            value={resumeName}
            onChange={(e) => setResumeName(e.target.value)}
            placeholder="e.g., Software Engineer Resume"
            className="w-full rounded-xl border border-border bg-background/80 px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20"
          />
        </div>

        {/* Template Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Choose a Template</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                className={`relative p-6 rounded-2xl border-2 border-border bg-card/60 shadow-sm transition-all text-left ${
                  selectedTemplate === template.id
                    ? "border-purple-500 bg-purple-500/5"
                    : "hover:border-purple-500/50"
                }`}
              >
                {selectedTemplate === template.id && (
                  <div className="absolute top-4 right-4 size-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                    <Check className="size-4" />
                  </div>
                )}
                <div className="text-4xl mb-3">{template.preview}</div>
                <h3 className="font-semibold mb-1">{template.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {template.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Link
            href="/tools/resumes"
            className="rounded-xl border border-border bg-card/60 px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-card"
          >
            Cancel
          </Link>
          <button
            onClick={handleCreate}
            disabled={!resumeName.trim()}
            className="rounded-xl bg-purple-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-purple-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Resume
          </button>
        </div>
      </div>
    </>
  )
}
