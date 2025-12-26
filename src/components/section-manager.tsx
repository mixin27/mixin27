"use client"

import { useState } from "react"
import { GripVertical, Eye, EyeOff } from "lucide-react"
import { Resume, ResumeSection } from "@/types/resume"

interface SectionManagerProps {
  resume: Resume
  onUpdate: (sections: ResumeSection[]) => void
}

export function SectionManager({ resume, onUpdate }: SectionManagerProps) {
  const [draggedItem, setDraggedItem] = useState<string | null>(null)

  const handleDragStart = (e: React.DragEvent, sectionId: string) => {
    setDraggedItem(sectionId)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault()

    if (!draggedItem || draggedItem === targetId) {
      setDraggedItem(null)
      return
    }

    const sections = [...resume.sections]
    const draggedIndex = sections.findIndex((s) => s.id === draggedItem)
    const targetIndex = sections.findIndex((s) => s.id === targetId)

    if (draggedIndex === -1 || targetIndex === -1) return

    // Remove dragged item
    const [removed] = sections.splice(draggedIndex, 1)
    // Insert at new position
    sections.splice(targetIndex, 0, removed)

    // Update order values
    sections.forEach((section, index) => {
      section.order = index
    })

    onUpdate(sections)
    setDraggedItem(null)
  }

  const handleDragEnd = () => {
    setDraggedItem(null)
  }

  const toggleVisibility = (sectionId: string) => {
    const sections = resume.sections.map((section) => {
      if (section.id === sectionId) {
        return { ...section, visible: !section.visible }
      }
      return section
    })
    onUpdate(sections)
  }

  const getSectionIcon = (type: string) => {
    switch (type) {
      case "personal":
        return "👤"
      case "summary":
        return "📝"
      case "experience":
        return "💼"
      case "education":
        return "🎓"
      case "skills":
        return "⚡"
      case "projects":
        return "🚀"
      case "certifications":
        return "🏆"
      case "languages":
        return "🌍"
      default:
        return "📄"
    }
  }

  const sortedSections = [...resume.sections].sort((a, b) => a.order - b.order)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Section Order & Visibility</h2>
        <p className="text-sm text-muted-foreground">Drag to reorder</p>
      </div>

      <div className="space-y-2">
        {sortedSections.map((section) => (
          <div
            key={section.id}
            draggable
            onDragStart={(e) => handleDragStart(e, section.id)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, section.id)}
            onDragEnd={handleDragEnd}
            className={`flex items-center gap-3 p-4 rounded-lg border bg-card transition-all cursor-move ${
              draggedItem === section.id
                ? "opacity-50 scale-95"
                : "hover:shadow-md"
            }`}
          >
            <GripVertical className="size-5 text-muted-foreground shrink-0" />

            <div className="flex items-center gap-2 flex-1">
              <span className="text-2xl">{getSectionIcon(section.type)}</span>
              <div>
                <p className="font-medium">{section.title}</p>
                <p className="text-xs text-muted-foreground capitalize">
                  {section.type}
                </p>
              </div>
            </div>

            <button
              onClick={() => toggleVisibility(section.id)}
              className={`p-2 rounded-lg transition-colors ${
                section.visible
                  ? "bg-primary/10 text-primary hover:bg-primary/20"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
              title={section.visible ? "Hide section" : "Show section"}
            >
              {section.visible ? (
                <Eye className="size-4" />
              ) : (
                <EyeOff className="size-4" />
              )}
            </button>

            <div className="text-sm font-medium text-muted-foreground w-8 text-center">
              {section.order + 1}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
        <p className="font-medium mb-1">💡 Tips:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Drag sections to reorder them in your resume</li>
          <li>Click the eye icon to show/hide sections</li>
          <li>Hidden sections won't appear in your resume or PDF</li>
          <li>Personal information is always first</li>
        </ul>
      </div>
    </div>
  )
}
