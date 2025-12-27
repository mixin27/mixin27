"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Plus,
  FileText,
  Search,
  Trash2,
  Eye,
  Edit,
  Copy,
  Download,
  ArrowLeft,
  MoreVertical,
  Upload,
} from "lucide-react"
import {
  getResumes,
  getResumeStats,
  deleteResume,
  duplicateResume,
  exportResumeJSON,
} from "@/lib/storage/tools-storage"
import { Resume } from "@/types/resume"
import { formatDate } from "@/lib/utils"
import { ImportModal } from "@/components/import-modal"

export default function ResumesPage() {
  const router = useRouter()
  const [resumes, setResumes] = useState<Resume[]>([])
  const [stats, setStats] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [templateFilter, setTemplateFilter] = useState<string>("all")
  const [showMenu, setShowMenu] = useState<string | null>(null)
  const [showImportModal, setShowImportModal] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    setResumes(getResumes())
    setStats(getResumeStats())
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this resume?")) {
      deleteResume(id)
      loadData()
    }
  }

  const handleDuplicate = (id: string) => {
    duplicateResume(id)
    loadData()
    setShowMenu(null)
  }

  const handleExport = (id: string) => {
    const json = exportResumeJSON(id)
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `resume-${id}.json`
    a.click()
    URL.revokeObjectURL(url)
    setShowMenu(null)
  }

  const handleImportSuccess = (resume: Resume) => {
    loadData()
    router.push(`/tools/resumes/${resume.id}/edit`)
  }

  const filteredResumes = resumes.filter((resume) => {
    const matchesSearch =
      resume.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resume.personal.fullName.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesTemplate =
      templateFilter === "all" || resume.template === templateFilter

    return matchesSearch && matchesTemplate
  })

  const getTemplateLabel = (template: string) => {
    return template.charAt(0).toUpperCase() + template.slice(1)
  }

  const getTemplateColor = (template: string) => {
    const colors: Record<string, string> = {
      modern: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      classic: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
      creative:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      minimal:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      professional:
        "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    }
    return colors[template] || colors.modern
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/tools"
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <ArrowLeft className="size-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold mb-2">Resume Builder</h1>
                <p className="text-muted-foreground">
                  Create and manage professional resumes
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowImportModal(true)}
                className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
              >
                <Upload className="size-4" />
                Import
              </button>
              <Link
                href="/tools/resumes/new"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <Plus className="size-4" />
                New Resume
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <div className="rounded-lg border bg-card p-6">
              <div className="text-center">
                <p className="text-3xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground mt-1">Total</p>
              </div>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <div className="text-center">
                <p className="text-3xl font-bold">{stats.templates.modern}</p>
                <p className="text-sm text-muted-foreground mt-1">Modern</p>
              </div>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <div className="text-center">
                <p className="text-3xl font-bold">{stats.templates.classic}</p>
                <p className="text-sm text-muted-foreground mt-1">Classic</p>
              </div>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <div className="text-center">
                <p className="text-3xl font-bold">{stats.templates.creative}</p>
                <p className="text-sm text-muted-foreground mt-1">Creative</p>
              </div>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <div className="text-center">
                <p className="text-3xl font-bold">{stats.templates.minimal}</p>
                <p className="text-sm text-muted-foreground mt-1">Minimal</p>
              </div>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <div className="text-center">
                <p className="text-3xl font-bold">
                  {stats.templates.professional}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Professional
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search resumes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <select
            value={templateFilter}
            onChange={(e) => setTemplateFilter(e.target.value)}
            className="px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Templates</option>
            <option value="modern">Modern</option>
            <option value="classic">Classic</option>
            <option value="creative">Creative</option>
            <option value="minimal">Minimal</option>
            <option value="professional">Professional</option>
          </select>
        </div>

        {/* Resumes Grid */}
        {filteredResumes.length === 0 ? (
          <div className="text-center py-12 rounded-lg border bg-card">
            <FileText className="size-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No resumes found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery || templateFilter !== "all"
                ? "Try adjusting your filters"
                : "Get started by creating your first resume"}
            </p>
            <Link
              href="/tools/resumes/new"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Plus className="size-4" />
              Create Resume
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResumes.map((resume) => (
              <div
                key={resume.id}
                className="rounded-lg border bg-card overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">
                        {resume.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {resume.personal.fullName || "Untitled"}
                      </p>
                    </div>
                    <div className="relative">
                      <button
                        onClick={() =>
                          setShowMenu(showMenu === resume.id ? null : resume.id)
                        }
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                      >
                        <MoreVertical className="size-4" />
                      </button>
                      {showMenu === resume.id && (
                        <div className="absolute right-0 mt-2 w-48 rounded-lg border bg-card shadow-lg z-10">
                          <button
                            onClick={() => handleDuplicate(resume.id)}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors"
                          >
                            <Copy className="size-4" />
                            Duplicate
                          </button>
                          <button
                            onClick={() => handleExport(resume.id)}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors"
                          >
                            <Download className="size-4" />
                            Export JSON
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getTemplateColor(resume.template)}`}
                    >
                      {getTemplateLabel(resume.template)}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground mb-4">
                    Updated {formatDate(resume.updatedAt)}
                  </p>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/tools/resumes/${resume.id}`}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border hover:bg-muted transition-colors text-sm"
                    >
                      <Eye className="size-4" />
                      Preview
                    </Link>
                    <Link
                      href={`/tools/resumes/${resume.id}/edit`}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm"
                    >
                      <Edit className="size-4" />
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(resume.id)}
                      className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Import Modal */}
      <ImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImportSuccess={handleImportSuccess}
      />
    </div>
  )
}
