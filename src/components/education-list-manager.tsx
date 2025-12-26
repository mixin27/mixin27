"use client"

import { useState } from "react"
import { GripVertical, Trash2, Plus } from "lucide-react"
import { Education } from "@/types/resume"

interface EducationListManagerProps {
  items: Education[]
  onUpdate: (items: Education[]) => void
  onAdd: () => void
  onDelete: (id: string) => void
  onEdit: (item: Education) => void
}

export function EducationListManager({
  items,
  onUpdate,
  onAdd,
  onDelete,
  onEdit,
}: EducationListManagerProps) {
  const [draggedItem, setDraggedItem] = useState<string | null>(null)

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedItem(id)
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

    const newItems = [...items]
    const draggedIndex = newItems.findIndex((item) => item.id === draggedItem)
    const targetIndex = newItems.findIndex((item) => item.id === targetId)

    if (draggedIndex === -1 || targetIndex === -1) return

    // Remove and reinsert
    const [removed] = newItems.splice(draggedIndex, 1)
    newItems.splice(targetIndex, 0, removed)

    onUpdate(newItems)
    setDraggedItem(null)
  }

  const handleDragEnd = () => {
    setDraggedItem(null)
  }

  const formatDate = (date: string, current?: boolean) => {
    if (current) return "Present"
    if (!date) return ""
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">
          {items.length} {items.length === 1 ? "Entry" : "Entries"}
        </h3>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-sm"
        >
          <Plus className="size-4" />
          Add Education
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
          <p className="mb-2">No education entries yet</p>
          <button
            onClick={onAdd}
            className="text-primary hover:underline text-sm"
          >
            Add your first education
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={item.id}
              draggable
              onDragStart={(e) => handleDragStart(e, item.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, item.id)}
              onDragEnd={handleDragEnd}
              onClick={() => onEdit(item)}
              className={`group flex items-start gap-3 p-4 rounded-lg border bg-card transition-all cursor-pointer ${
                draggedItem === item.id
                  ? "opacity-50 scale-95"
                  : "hover:shadow-md hover:border-primary/50"
              }`}
            >
              <div className="cursor-move" onClick={(e) => e.stopPropagation()}>
                <GripVertical className="size-5 text-muted-foreground" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                    {item.degree || "Untitled Degree"}{" "}
                    {item.field && `in ${item.field}`}
                  </h4>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    #{index + 1}
                  </span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                  {item.institution || "Institution not specified"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(item.startDate)} -{" "}
                  {item.current
                    ? "Present"
                    : item.endDate && formatDate(item.endDate)}
                  {item.location && ` • ${item.location}`}
                  {item.gpa && ` • GPA: ${item.gpa}`}
                </p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(item.id)
                }}
                className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                title="Delete"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
        💡 <strong>Tip:</strong> Drag entries to reorder them. Click an entry to
        edit its details.
      </div>
    </div>
  )
}
