"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Check } from "lucide-react"
import { createDefaultResume, saveResume } from "@/lib/resume-storage"
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

  const handleCreate = () => {
    const resume = createDefaultResume()
    resume.name = resumeName
    resume.template = selectedTemplate
    resume.style.template = selectedTemplate
    saveResume(resume)
    router.push(`/tools/resumes/${resume.id}/edit`)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container py-6">
          <div className="flex items-center gap-4">
            <Link
              href="/tools/resumes"
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <ArrowLeft className="size-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold mb-2">Create New Resume</h1>
              <p className="text-muted-foreground">
                Choose a template and get started
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8 max-w-4xl">
        {/* Resume Name */}
        <div className="mb-8">
          <label className="block text-sm font-medium mb-2">Resume Name</label>
          <input
            type="text"
            value={resumeName}
            onChange={(e) => setResumeName(e.target.value)}
            placeholder="e.g., Software Engineer Resume"
            className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
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
                className={`relative p-6 rounded-lg border-2 transition-all text-left ${
                  selectedTemplate === template.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
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
            className="px-6 py-2 rounded-lg border hover:bg-muted transition-colors"
          >
            Cancel
          </Link>
          <button
            onClick={handleCreate}
            disabled={!resumeName.trim()}
            className="px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Resume
          </button>
        </div>
      </div>
    </div>
  )
}
