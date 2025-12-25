"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Save,
  Eye,
  Plus,
  Trash2,
  GripVertical,
  Settings,
  Upload,
  Download,
} from "lucide-react"
import {
  getResumeById,
  saveResume,
  exportResumeJSON,
} from "@/lib/resume-storage"
import {
  Resume,
  Experience,
  Education,
  Skill,
  Project,
  Certification,
  Language,
} from "@/types/resume"
import { ResumeTemplateRenderer } from '@/components/resume-templates/resume-template-renderer'

type EditSection =
  | "personal"
  | "summary"
  | "experience"
  | "education"
  | "skills"
  | "projects"
  | "certifications"
  | "languages"
  | "style"

export default function EditResumePage() {
  const params = useParams()
  const router = useRouter()
  const [resume, setResume] = useState<Resume | null>(null)
  const [activeSection, setActiveSection] = useState<EditSection>("personal")
  const [showPreview, setShowPreview] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const id = params.id as string
    const loadedResume = getResumeById(id)
    if (!loadedResume) {
      router.push("/tools/resumes")
      return
    }
    setResume(loadedResume)
  }, [params.id, router])

  const handleSave = () => {
    if (!resume) return
    setIsSaving(true)
    saveResume(resume)
    setTimeout(() => setIsSaving(false), 500)
  }

  const handleExport = () => {
    if (!resume) return
    const json = exportResumeJSON(resume.id)
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${resume.name.replace(/\s+/g, "-").toLowerCase()}.json`
    a.click()
    URL.revokeObjectURL(url)
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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b bg-card sticky top-0 z-10">
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
                <input
                  type="text"
                  value={resume.name}
                  onChange={(e) =>
                    setResume({ ...resume, name: e.target.value })
                  }
                  className="text-xl font-bold bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-primary rounded px-2"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-muted transition-colors"
              >
                <Eye className="size-4" />
                {showPreview ? "Hide" : "Show"} Preview
              </button>
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-muted transition-colors"
              >
                <Download className="size-4" />
                Export
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                <Save className="size-4" />
                {isSaving ? "Saving..." : "Save"}
              </button>
              <Link
                href={`/tools/resumes/${resume.id}`}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors"
              >
                <Eye className="size-4" />
                Preview
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor Panel */}
        <div
          className={`${showPreview ? "w-1/2" : "w-full"} border-r overflow-y-auto`}
        >
          <div className="container py-6 max-w-3xl">
            {/* Section Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {[
                { id: "personal", label: "Personal" },
                { id: "summary", label: "Summary" },
                { id: "experience", label: "Experience" },
                { id: "education", label: "Education" },
                { id: "skills", label: "Skills" },
                { id: "projects", label: "Projects" },
                { id: "certifications", label: "Certifications" },
                { id: "languages", label: "Languages" },
                { id: "style", label: "Style" },
              ].map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id as EditSection)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                    activeSection === section.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  {section.label}
                </button>
              ))}
            </div>

            {/* Personal Information */}
            {activeSection === "personal" && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold mb-4">
                  Personal Information
                </h2>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={resume.personal.fullName}
                    onChange={(e) =>
                      setResume({
                        ...resume,
                        personal: {
                          ...resume.personal,
                          fullName: e.target.value,
                        },
                      })
                    }
                    className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Professional Title *
                  </label>
                  <input
                    type="text"
                    value={resume.personal.title}
                    onChange={(e) =>
                      setResume({
                        ...resume,
                        personal: { ...resume.personal, title: e.target.value },
                      })
                    }
                    placeholder="e.g., Senior Software Engineer"
                    className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={resume.personal.email}
                      onChange={(e) =>
                        setResume({
                          ...resume,
                          personal: {
                            ...resume.personal,
                            email: e.target.value,
                          },
                        })
                      }
                      className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      value={resume.personal.phone}
                      onChange={(e) =>
                        setResume({
                          ...resume,
                          personal: {
                            ...resume.personal,
                            phone: e.target.value,
                          },
                        })
                      }
                      className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={resume.personal.location}
                    onChange={(e) =>
                      setResume({
                        ...resume,
                        personal: {
                          ...resume.personal,
                          location: e.target.value,
                        },
                      })
                    }
                    placeholder="City, Country"
                    className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    value={resume.personal.website || ""}
                    onChange={(e) =>
                      setResume({
                        ...resume,
                        personal: {
                          ...resume.personal,
                          website: e.target.value,
                        },
                      })
                    }
                    placeholder="https://yourwebsite.com"
                    className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      LinkedIn
                    </label>
                    <input
                      type="text"
                      value={resume.personal.linkedin || ""}
                      onChange={(e) =>
                        setResume({
                          ...resume,
                          personal: {
                            ...resume.personal,
                            linkedin: e.target.value,
                          },
                        })
                      }
                      placeholder="linkedin.com/in/username"
                      className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      GitHub
                    </label>
                    <input
                      type="text"
                      value={resume.personal.github || ""}
                      onChange={(e) =>
                        setResume({
                          ...resume,
                          personal: {
                            ...resume.personal,
                            github: e.target.value,
                          },
                        })
                      }
                      placeholder="github.com/username"
                      className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Summary */}
            {activeSection === "summary" && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold mb-4">
                  Professional Summary
                </h2>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Summary
                  </label>
                  <textarea
                    value={resume.summary || ""}
                    onChange={(e) =>
                      setResume({ ...resume, summary: e.target.value })
                    }
                    rows={6}
                    placeholder="Write a brief professional summary highlighting your experience, skills, and career goals..."
                    className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            )}

            {/* Experience */}
            {activeSection === "experience" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">Work Experience</h2>
                  <button
                    onClick={() => {
                      const newExp: Experience = {
                        id: `exp_${Date.now()}`,
                        company: "",
                        position: "",
                        location: "",
                        startDate: "",
                        current: false,
                        description: "",
                        highlights: [],
                      }
                      setResume({
                        ...resume,
                        experience: [...resume.experience, newExp],
                      })
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Plus className="size-4" />
                    Add Experience
                  </button>
                </div>

                {resume.experience.map((exp, index) => (
                  <div
                    key={exp.id}
                    className="p-4 rounded-lg border bg-card space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <GripVertical className="size-5 text-muted-foreground cursor-move" />
                        <span className="font-medium">
                          Experience #{index + 1}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setResume({
                            ...resume,
                            experience: resume.experience.filter(
                              (e) => e.id !== exp.id,
                            ),
                          })
                        }}
                        className="p-2 hover:bg-destructive/10 text-destructive rounded-lg"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Position
                        </label>
                        <input
                          type="text"
                          value={exp.position}
                          onChange={(e) => {
                            const updated = resume.experience.map((item) =>
                              item.id === exp.id
                                ? { ...item, position: e.target.value }
                                : item,
                            )
                            setResume({ ...resume, experience: updated })
                          }}
                          className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Company
                        </label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => {
                            const updated = resume.experience.map((item) =>
                              item.id === exp.id
                                ? { ...item, company: e.target.value }
                                : item,
                            )
                            setResume({ ...resume, experience: updated })
                          }}
                          className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        value={exp.location}
                        onChange={(e) => {
                          const updated = resume.experience.map((item) =>
                            item.id === exp.id
                              ? { ...item, location: e.target.value }
                              : item,
                          )
                          setResume({ ...resume, experience: updated })
                        }}
                        className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Start Date
                        </label>
                        <input
                          type="month"
                          value={exp.startDate}
                          onChange={(e) => {
                            const updated = resume.experience.map((item) =>
                              item.id === exp.id
                                ? { ...item, startDate: e.target.value }
                                : item,
                            )
                            setResume({ ...resume, experience: updated })
                          }}
                          className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          End Date
                        </label>
                        <input
                          type="month"
                          value={exp.endDate || ""}
                          disabled={exp.current}
                          onChange={(e) => {
                            const updated = resume.experience.map((item) =>
                              item.id === exp.id
                                ? { ...item, endDate: e.target.value }
                                : item,
                            )
                            setResume({ ...resume, experience: updated })
                          }}
                          className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`current-${exp.id}`}
                        checked={exp.current}
                        onChange={(e) => {
                          const updated = resume.experience.map((item) =>
                            item.id === exp.id
                              ? { ...item, current: e.target.checked }
                              : item,
                          )
                          setResume({ ...resume, experience: updated })
                        }}
                        className="rounded"
                      />
                      <label htmlFor={`current-${exp.id}`} className="text-sm">
                        I currently work here
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Description
                      </label>
                      <textarea
                        value={exp.description}
                        onChange={(e) => {
                          const updated = resume.experience.map((item) =>
                            item.id === exp.id
                              ? { ...item, description: e.target.value }
                              : item,
                          )
                          setResume({ ...resume, experience: updated })
                        }}
                        rows={3}
                        className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Key Highlights
                      </label>
                      {exp.highlights.map((highlight, hIndex) => (
                        <div key={hIndex} className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={highlight}
                            onChange={(e) => {
                              const updated = resume.experience.map((item) => {
                                if (item.id === exp.id) {
                                  const newHighlights = [...item.highlights]
                                  newHighlights[hIndex] = e.target.value
                                  return { ...item, highlights: newHighlights }
                                }
                                return item
                              })
                              setResume({ ...resume, experience: updated })
                            }}
                            className="flex-1 px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                          <button
                            onClick={() => {
                              const updated = resume.experience.map((item) => {
                                if (item.id === exp.id) {
                                  return {
                                    ...item,
                                    highlights: item.highlights.filter(
                                      (_, i) => i !== hIndex,
                                    ),
                                  }
                                }
                                return item
                              })
                              setResume({ ...resume, experience: updated })
                            }}
                            className="p-2 hover:bg-destructive/10 text-destructive rounded-lg"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => {
                          const updated = resume.experience.map((item) => {
                            if (item.id === exp.id) {
                              return {
                                ...item,
                                highlights: [...item.highlights, ""],
                              }
                            }
                            return item
                          })
                          setResume({ ...resume, experience: updated })
                        }}
                        className="text-sm text-primary hover:underline"
                      >
                        + Add Highlight
                      </button>
                    </div>
                  </div>
                ))}

                {resume.experience.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    No experience added yet. Click "Add Experience" to get
                    started.
                  </div>
                )}
              </div>
            )}

            {/* Education - Similar structure to Experience */}
            {activeSection === "education" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">Education</h2>
                  <button
                    onClick={() => {
                      const newEdu: Education = {
                        id: `edu_${Date.now()}`,
                        institution: "",
                        degree: "",
                        field: "",
                        location: "",
                        startDate: "",
                        current: false,
                      }
                      setResume({
                        ...resume,
                        education: [...resume.education, newEdu],
                      })
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Plus className="size-4" />
                    Add Education
                  </button>
                </div>

                {resume.education.map((edu, index) => (
                  <div
                    key={edu.id}
                    className="p-4 rounded-lg border bg-card space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <GripVertical className="size-5 text-muted-foreground cursor-move" />
                        <span className="font-medium">
                          Education #{index + 1}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setResume({
                            ...resume,
                            education: resume.education.filter(
                              (e) => e.id !== edu.id,
                            ),
                          })
                        }}
                        className="p-2 hover:bg-destructive/10 text-destructive rounded-lg"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Degree
                        </label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => {
                            const updated = resume.education.map((item) =>
                              item.id === edu.id
                                ? { ...item, degree: e.target.value }
                                : item,
                            )
                            setResume({ ...resume, education: updated })
                          }}
                          placeholder="e.g., Bachelor of Science"
                          className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Field of Study
                        </label>
                        <input
                          type="text"
                          value={edu.field}
                          onChange={(e) => {
                            const updated = resume.education.map((item) =>
                              item.id === edu.id
                                ? { ...item, field: e.target.value }
                                : item,
                            )
                            setResume({ ...resume, education: updated })
                          }}
                          placeholder="e.g., Computer Science"
                          className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Institution
                      </label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => {
                          const updated = resume.education.map((item) =>
                            item.id === edu.id
                              ? { ...item, institution: e.target.value }
                              : item,
                          )
                          setResume({ ...resume, education: updated })
                        }}
                        className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        value={edu.location}
                        onChange={(e) => {
                          const updated = resume.education.map((item) =>
                            item.id === edu.id
                              ? { ...item, location: e.target.value }
                              : item,
                          )
                          setResume({ ...resume, education: updated })
                        }}
                        className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Start Date
                        </label>
                        <input
                          type="month"
                          value={edu.startDate}
                          onChange={(e) => {
                            const updated = resume.education.map((item) =>
                              item.id === edu.id
                                ? { ...item, startDate: e.target.value }
                                : item,
                            )
                            setResume({ ...resume, education: updated })
                          }}
                          className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          End Date
                        </label>
                        <input
                          type="month"
                          value={edu.endDate || ""}
                          disabled={edu.current}
                          onChange={(e) => {
                            const updated = resume.education.map((item) =>
                              item.id === edu.id
                                ? { ...item, endDate: e.target.value }
                                : item,
                            )
                            setResume({ ...resume, education: updated })
                          }}
                          className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          GPA (Optional)
                        </label>
                        <input
                          type="text"
                          value={edu.gpa || ""}
                          onChange={(e) => {
                            const updated = resume.education.map((item) =>
                              item.id === edu.id
                                ? { ...item, gpa: e.target.value }
                                : item,
                            )
                            setResume({ ...resume, education: updated })
                          }}
                          placeholder="3.8/4.0"
                          className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`current-edu-${edu.id}`}
                        checked={edu.current}
                        onChange={(e) => {
                          const updated = resume.education.map((item) =>
                            item.id === edu.id
                              ? { ...item, current: e.target.checked }
                              : item,
                          )
                          setResume({ ...resume, education: updated })
                        }}
                        className="rounded"
                      />
                      <label
                        htmlFor={`current-edu-${edu.id}`}
                        className="text-sm"
                      >
                        Currently studying here
                      </label>
                    </div>
                  </div>
                ))}

                {resume.education.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    No education added yet. Click "Add Education" to get
                    started.
                  </div>
                )}
              </div>
            )}

            {/* Skills */}
            {activeSection === "skills" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">Skills</h2>
                  <button
                    onClick={() => {
                      const newSkill: Skill = {
                        id: `skill_${Date.now()}`,
                        name: "",
                        category: "Technical",
                        level: "intermediate",
                      }
                      setResume({
                        ...resume,
                        skills: [...resume.skills, newSkill],
                      })
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Plus className="size-4" />
                    Add Skill
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {resume.skills.map((skill) => (
                    <div
                      key={skill.id}
                      className="p-4 rounded-lg border bg-card space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <input
                          type="text"
                          value={skill.name}
                          onChange={(e) => {
                            const updated = resume.skills.map((item) =>
                              item.id === skill.id
                                ? { ...item, name: e.target.value }
                                : item,
                            )
                            setResume({ ...resume, skills: updated })
                          }}
                          placeholder="Skill name"
                          className="flex-1 px-3 py-1 rounded border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <button
                          onClick={() => {
                            setResume({
                              ...resume,
                              skills: resume.skills.filter(
                                (s) => s.id !== skill.id,
                              ),
                            })
                          }}
                          className="p-1 hover:bg-destructive/10 text-destructive rounded"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <select
                          value={skill.category}
                          onChange={(e) => {
                            const updated = resume.skills.map((item) =>
                              item.id === skill.id
                                ? { ...item, category: e.target.value }
                                : item,
                            )
                            setResume({ ...resume, skills: updated })
                          }}
                          className="px-3 py-1 rounded border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                        >
                          <option>Technical</option>
                          <option>Languages</option>
                          <option>Tools</option>
                          <option>Frameworks</option>
                          <option>Soft Skills</option>
                          <option>Other</option>
                        </select>

                        <select
                          value={skill.level}
                          onChange={(e) => {
                            const updated = resume.skills.map((item) =>
                              item.id === skill.id
                                ? { ...item, level: e.target.value as any }
                                : item,
                            )
                            setResume({ ...resume, skills: updated })
                          }}
                          className="px-3 py-1 rounded border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                        >
                          <option value="beginner">Beginner</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="advanced">Advanced</option>
                          <option value="expert">Expert</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>

                {resume.skills.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    No skills added yet. Click "Add Skill" to get started.
                  </div>
                )}
              </div>
            )}

            {/* Projects - Similar to Experience */}
            {activeSection === "projects" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">Projects</h2>
                  <button
                    onClick={() => {
                      const newProject: Project = {
                        id: `project_${Date.now()}`,
                        name: "",
                        description: "",
                        technologies: [],
                        startDate: "",
                        current: false,
                        highlights: [],
                      }
                      setResume({
                        ...resume,
                        projects: [...resume.projects, newProject],
                      })
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Plus className="size-4" />
                    Add Project
                  </button>
                </div>

                {resume.projects.map((project, index) => (
                  <div
                    key={project.id}
                    className="p-4 rounded-lg border bg-card space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Project #{index + 1}</span>
                      <button
                        onClick={() => {
                          setResume({
                            ...resume,
                            projects: resume.projects.filter(
                              (p) => p.id !== project.id,
                            ),
                          })
                        }}
                        className="p-2 hover:bg-destructive/10 text-destructive rounded-lg"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Project Name
                      </label>
                      <input
                        type="text"
                        value={project.name}
                        onChange={(e) => {
                          const updated = resume.projects.map((item) =>
                            item.id === project.id
                              ? { ...item, name: e.target.value }
                              : item,
                          )
                          setResume({ ...resume, projects: updated })
                        }}
                        className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Description
                      </label>
                      <textarea
                        value={project.description}
                        onChange={(e) => {
                          const updated = resume.projects.map((item) =>
                            item.id === project.id
                              ? { ...item, description: e.target.value }
                              : item,
                          )
                          setResume({ ...resume, projects: updated })
                        }}
                        rows={3}
                        className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Technologies (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={project.technologies.join(", ")}
                        onChange={(e) => {
                          const updated = resume.projects.map((item) =>
                            item.id === project.id
                              ? {
                                  ...item,
                                  technologies: e.target.value
                                    .split(",")
                                    .map((t) => t.trim())
                                    .filter(Boolean),
                                }
                              : item,
                          )
                          setResume({ ...resume, projects: updated })
                        }}
                        placeholder="React, Node.js, MongoDB"
                        className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Project URL (Optional)
                      </label>
                      <input
                        type="url"
                        value={project.url || ""}
                        onChange={(e) => {
                          const updated = resume.projects.map((item) =>
                            item.id === project.id
                              ? { ...item, url: e.target.value }
                              : item,
                          )
                          setResume({ ...resume, projects: updated })
                        }}
                        placeholder="https://project-url.com"
                        className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                ))}

                {resume.projects.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    No projects added yet. Click "Add Project" to get started.
                  </div>
                )}
              </div>
            )}

            {/* Certifications */}
            {activeSection === "certifications" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">Certifications</h2>
                  <button
                    onClick={() => {
                      const newCert: Certification = {
                        id: `cert_${Date.now()}`,
                        name: "",
                        issuer: "",
                        issueDate: "",
                      }
                      setResume({
                        ...resume,
                        certifications: [...resume.certifications, newCert],
                      })
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Plus className="size-4" />
                    Add Certification
                  </button>
                </div>

                {resume.certifications.map((cert, index) => (
                  <div
                    key={cert.id}
                    className="p-4 rounded-lg border bg-card space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        Certification #{index + 1}
                      </span>
                      <button
                        onClick={() => {
                          setResume({
                            ...resume,
                            certifications: resume.certifications.filter(
                              (c) => c.id !== cert.id,
                            ),
                          })
                        }}
                        className="p-2 hover:bg-destructive/10 text-destructive rounded-lg"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Certification Name
                        </label>
                        <input
                          type="text"
                          value={cert.name}
                          onChange={(e) => {
                            const updated = resume.certifications.map((item) =>
                              item.id === cert.id
                                ? { ...item, name: e.target.value }
                                : item,
                            )
                            setResume({ ...resume, certifications: updated })
                          }}
                          className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Issuing Organization
                        </label>
                        <input
                          type="text"
                          value={cert.issuer}
                          onChange={(e) => {
                            const updated = resume.certifications.map((item) =>
                              item.id === cert.id
                                ? { ...item, issuer: e.target.value }
                                : item,
                            )
                            setResume({ ...resume, certifications: updated })
                          }}
                          className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Issue Date
                        </label>
                        <input
                          type="month"
                          value={cert.issueDate}
                          onChange={(e) => {
                            const updated = resume.certifications.map((item) =>
                              item.id === cert.id
                                ? { ...item, issueDate: e.target.value }
                                : item,
                            )
                            setResume({ ...resume, certifications: updated })
                          }}
                          className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Credential ID (Optional)
                        </label>
                        <input
                          type="text"
                          value={cert.credentialId || ""}
                          onChange={(e) => {
                            const updated = resume.certifications.map((item) =>
                              item.id === cert.id
                                ? { ...item, credentialId: e.target.value }
                                : item,
                            )
                            setResume({ ...resume, certifications: updated })
                          }}
                          className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {resume.certifications.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    No certifications added yet.
                  </div>
                )}
              </div>
            )}

            {/* Languages */}
            {activeSection === "languages" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">Languages</h2>
                  <button
                    onClick={() => {
                      const newLang: Language = {
                        id: `lang_${Date.now()}`,
                        name: "",
                        proficiency: "conversational",
                      }
                      setResume({
                        ...resume,
                        languages: [...resume.languages, newLang],
                      })
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Plus className="size-4" />
                    Add Language
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {resume.languages.map((lang) => (
                    <div
                      key={lang.id}
                      className="p-4 rounded-lg border bg-card space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <input
                          type="text"
                          value={lang.name}
                          onChange={(e) => {
                            const updated = resume.languages.map((item) =>
                              item.id === lang.id
                                ? { ...item, name: e.target.value }
                                : item,
                            )
                            setResume({ ...resume, languages: updated })
                          }}
                          placeholder="Language name"
                          className="flex-1 px-3 py-1 rounded border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <button
                          onClick={() => {
                            setResume({
                              ...resume,
                              languages: resume.languages.filter(
                                (l) => l.id !== lang.id,
                              ),
                            })
                          }}
                          className="p-1 hover:bg-destructive/10 text-destructive rounded ml-2"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>

                      <select
                        value={lang.proficiency}
                        onChange={(e) => {
                          const updated = resume.languages.map((item) =>
                            item.id === lang.id
                              ? { ...item, proficiency: e.target.value as any }
                              : item,
                          )
                          setResume({ ...resume, languages: updated })
                        }}
                        className="w-full px-3 py-1 rounded border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      >
                        <option value="basic">Basic</option>
                        <option value="conversational">Conversational</option>
                        <option value="professional">Professional</option>
                        <option value="native">Native</option>
                      </select>
                    </div>
                  ))}
                </div>

                {resume.languages.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    No languages added yet.
                  </div>
                )}
              </div>
            )}

            {/* Style Settings */}
            {activeSection === "style" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-4">Style Settings</h2>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Template
                  </label>
                  <select
                    value={resume.template}
                    onChange={(e) =>
                      setResume({
                        ...resume,
                        template: e.target.value as any,
                        style: {
                          ...resume.style,
                          template: e.target.value as any,
                        },
                      })
                    }
                    className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="modern">Modern</option>
                    <option value="classic">Classic</option>
                    <option value="creative">Creative</option>
                    <option value="minimal">Minimal</option>
                    <option value="professional">Professional</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Primary Color
                  </label>
                  <div className="flex gap-4 items-center">
                    <input
                      type="color"
                      value={resume.style.primaryColor}
                      onChange={(e) =>
                        setResume({
                          ...resume,
                          style: {
                            ...resume.style,
                            primaryColor: e.target.value,
                          },
                        })
                      }
                      className="h-10 w-20 rounded border cursor-pointer"
                    />
                    <input
                      type="text"
                      value={resume.style.primaryColor}
                      onChange={(e) =>
                        setResume({
                          ...resume,
                          style: {
                            ...resume.style,
                            primaryColor: e.target.value,
                          },
                        })
                      }
                      className="flex-1 px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Font Family
                  </label>
                  <select
                    value={resume.style.fontFamily}
                    onChange={(e) =>
                      setResume({
                        ...resume,
                        style: { ...resume.style, fontFamily: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Inter">Inter</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Arial">Arial</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Times New Roman">Times New Roman</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Font Size
                  </label>
                  <select
                    value={resume.style.fontSize}
                    onChange={(e) =>
                      setResume({
                        ...resume,
                        style: {
                          ...resume.style,
                          fontSize: e.target.value as any,
                        },
                      })
                    }
                    className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Spacing
                  </label>
                  <select
                    value={resume.style.spacing}
                    onChange={(e) =>
                      setResume({
                        ...resume,
                        style: {
                          ...resume.style,
                          spacing: e.target.value as any,
                        },
                      })
                    }
                    className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="compact">Compact</option>
                    <option value="normal">Normal</option>
                    <option value="relaxed">Relaxed</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="showPhoto"
                      checked={resume.style.showPhoto}
                      onChange={(e) =>
                        setResume({
                          ...resume,
                          style: {
                            ...resume.style,
                            showPhoto: e.target.checked,
                          },
                        })
                      }
                      className="rounded"
                    />
                    <label htmlFor="showPhoto" className="text-sm">
                      Show profile photo
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="showIcons"
                      checked={resume.style.showIcons}
                      onChange={(e) =>
                        setResume({
                          ...resume,
                          style: {
                            ...resume.style,
                            showIcons: e.target.checked,
                          },
                        })
                      }
                      className="rounded"
                    />
                    <label htmlFor="showIcons" className="text-sm">
                      Show icons
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Preview Panel */}
        {showPreview && (
          <div className="w-1/2 bg-muted/30 overflow-y-auto">
            <div className="container py-6">
              <div
                className="bg-white rounded-lg shadow-2xl overflow-hidden"
                style={{ minHeight: "1056px" }}
              >
                <ResumeTemplateRenderer resume={resume} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
