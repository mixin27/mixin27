"use client"

import { useState, useRef } from "react"
import { Upload, X, FileJson, CheckCircle, AlertCircle } from "lucide-react"
import { importResumeJSON } from "@/lib/resume-storage"
import { Resume } from "@/types/resume"

interface ImportModalProps {
  isOpen: boolean
  onClose: () => void
  onImportSuccess: (resume: Resume) => void
}

export function ImportModal({
  isOpen,
  onClose,
  onImportSuccess,
}: ImportModalProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [jsonContent, setJsonContent] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!isOpen) return null

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      handleFile(file)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFile(file)
    }
  }

  const handleFile = (file: File) => {
    if (!file.name.endsWith(".json")) {
      setError("Please select a JSON file")
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      setJsonContent(content)
      setError(null)
    }
    reader.onerror = () => {
      setError("Failed to read file")
    }
    reader.readAsText(file)
  }

  const handleImport = () => {
    try {
      setError(null)
      const resume = importResumeJSON(jsonContent)
      setSuccess(true)
      setTimeout(() => {
        onImportSuccess(resume)
        handleClose()
      }, 1000)
    } catch (err) {
      setError("Invalid resume format. Please check your JSON file.")
      console.error("Import error:", err)
    }
  }

  const handleTextImport = () => {
    if (!jsonContent.trim()) {
      setError("Please paste JSON content or upload a file")
      return
    }
    handleImport()
  }

  const handleClose = () => {
    setJsonContent("")
    setError(null)
    setSuccess(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-card rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Upload className="size-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Import Resume</h2>
              <p className="text-sm text-muted-foreground">
                Upload a JSON file or paste JSON content
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Success Message */}
          {success && (
            <div className="rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 flex items-center gap-3">
              <CheckCircle className="size-5 text-green-600 dark:text-green-400" />
              <div>
                <p className="font-medium text-green-900 dark:text-green-100">
                  Import successful!
                </p>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Redirecting to your resume...
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 flex items-center gap-3">
              <AlertCircle className="size-5 text-red-600 dark:text-red-400" />
              <div>
                <p className="font-medium text-red-900 dark:text-red-100">
                  Import failed
                </p>
                <p className="text-sm text-red-700 dark:text-red-300">
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* File Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileSelect}
              className="hidden"
            />

            <FileJson className="size-12 mx-auto mb-4 text-muted-foreground" />

            <p className="text-lg font-medium mb-2">Drop JSON file here</p>
            <p className="text-sm text-muted-foreground mb-4">
              or click to browse
            </p>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Choose File
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 border-t" />
            <span className="text-sm text-muted-foreground">OR</span>
            <div className="flex-1 border-t" />
          </div>

          {/* Paste JSON */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Paste JSON Content
            </label>
            <textarea
              value={jsonContent}
              onChange={(e) => setJsonContent(e.target.value)}
              placeholder='{"id": "resume_123", "name": "My Resume", ...}'
              rows={10}
              className="w-full px-4 py-3 rounded-lg border bg-background font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Paste the JSON content exported from another resume
            </p>
          </div>

          {/* Instructions */}
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="font-medium mb-2 text-sm">📖 How to import:</p>
            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Export a resume as JSON from the resume list</li>
              <li>Upload the downloaded .json file here</li>
              <li>Or copy the JSON content and paste it above</li>
              <li>Click "Import Resume" to complete</li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t bg-muted/30">
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded-lg border hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleTextImport}
            disabled={!jsonContent.trim() || success}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Import Resume
          </button>
        </div>
      </div>
    </div>
  )
}
