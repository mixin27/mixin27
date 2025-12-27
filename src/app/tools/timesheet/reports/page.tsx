"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { ArrowLeft, Download, ChevronLeft, ChevronRight } from "lucide-react"
import {
  getTimeEntries,
  getClients,
  formatDuration,
} from "@/lib/storage/tools-storage"
import { TimeEntry, Client } from "@/types/invoice"
import { formatDate } from "@/lib/utils"
import jsPDF from "jspdf"
import html2canvas from "html2canvas-pro"

type ViewType = "week" | "month" | "client" | "project"

export default function TimesheetReportsPage() {
  const [viewType, setViewType] = useState<ViewType>("week")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [entries, setEntries] = useState<TimeEntry[]>([])
  const [loadedClients, setLoadedClients] = useState<Client[]>([])
  const [selectedClientId, setSelectedClientId] = useState<string>("all")
  const [isGenerating, setIsGenerating] = useState(false)
  const reportRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadData = async () => {
      const [loadedEntries, loadedClients] = await Promise.all([
        getTimeEntries(),
        getClients(),
      ])
      setEntries(loadedEntries)
      setLoadedClients(loadedClients)
    }
    loadData()
  }, [])

  const getWeekStart = (date: Date) => {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1)
    return new Date(d.setDate(diff))
  }

  const getWeekEnd = (weekStart: Date) => {
    const d = new Date(weekStart)
    d.setDate(d.getDate() + 6)
    return d
  }

  const getMonthStart = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1)
  }

  const getMonthEnd = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0)
  }

  const navigatePrevious = () => {
    const newDate = new Date(currentDate)
    if (viewType === "week") {
      newDate.setDate(newDate.getDate() - 7)
    } else {
      newDate.setMonth(newDate.getMonth() - 1)
    }
    setCurrentDate(newDate)
  }

  const navigateNext = () => {
    const newDate = new Date(currentDate)
    if (viewType === "week") {
      newDate.setDate(newDate.getDate() + 7)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
  }

  const getFilteredEntries = () => {
    let filtered = entries

    if (selectedClientId !== "all") {
      filtered = filtered.filter((e) => e.clientId === selectedClientId)
    }

    if (viewType === "week") {
      const weekStart = getWeekStart(currentDate)
      const weekEnd = getWeekEnd(weekStart)
      filtered = filtered.filter((e) => {
        const entryDate = new Date(e.date)
        return entryDate >= weekStart && entryDate <= weekEnd
      })
    } else if (viewType === "month") {
      const monthStart = getMonthStart(currentDate)
      const monthEnd = getMonthEnd(currentDate)
      filtered = filtered.filter((e) => {
        const entryDate = new Date(e.date)
        return entryDate >= monthStart && entryDate <= monthEnd
      })
    }

    return filtered.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    )
  }

  const groupByDate = (entries: TimeEntry[]) => {
    const groups: Record<string, TimeEntry[]> = {}
    entries.forEach((entry) => {
      if (!groups[entry.date]) {
        groups[entry.date] = []
      }
      groups[entry.date].push(entry)
    })
    return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]))
  }

  const groupByClient = (entries: TimeEntry[]) => {
    const groups: Record<string, TimeEntry[]> = {}
    entries.forEach((entry) => {
      const key = entry.client.name
      if (!groups[key]) {
        groups[key] = []
      }
      groups[key].push(entry)
    })
    return Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]))
  }

  const groupByProject = (entries: TimeEntry[]) => {
    const groups: Record<string, TimeEntry[]> = {}
    entries.forEach((entry) => {
      if (!groups[entry.projectName]) {
        groups[entry.projectName] = []
      }
      groups[entry.projectName].push(entry)
    })
    return Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]))
  }

  const calculateTotals = (entries: TimeEntry[]) => {
    const totalMinutes = entries.reduce((sum, e) => sum + e.duration, 0)
    const billableMinutes = entries
      .filter((e) => e.billable)
      .reduce((sum, e) => sum + e.duration, 0)
    const totalEarnings = entries
      .filter((e) => e.billable)
      .reduce((sum, e) => sum + e.amount, 0)

    return {
      totalHours: totalMinutes / 60,
      billableHours: billableMinutes / 60,
      totalEarnings,
    }
  }

  const filteredEntries = getFilteredEntries()
  const totals = calculateTotals(filteredEntries)
  const clients = getClients()

  let groupedData: [string, TimeEntry[]][] = []
  if (viewType === "client") {
    groupedData = groupByClient(filteredEntries)
  } else if (viewType === "project") {
    groupedData = groupByProject(filteredEntries)
  } else {
    groupedData = groupByDate(filteredEntries)
  }

  const getPeriodLabel = () => {
    if (viewType === "week") {
      const weekStart = getWeekStart(currentDate)
      const weekEnd = getWeekEnd(weekStart)
      return `${formatDate(weekStart.toISOString())} - ${formatDate(weekEnd.toISOString())}`
    } else if (viewType === "month") {
      return currentDate.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    }
    return ""
  }

  const handleExportPDF = async () => {
    if (!reportRef.current) return

    setIsGenerating(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 100))

      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        windowWidth: reportRef.current.scrollWidth,
        windowHeight: reportRef.current.scrollHeight,
      })

      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = canvas.width
      const imgHeight = canvas.height
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
      const imgX = (pdfWidth - imgWidth * ratio) / 2
      const imgY = 0

      pdf.addImage(
        imgData,
        "PNG",
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio,
      )

      const filename = `Timesheet_${viewType}_${currentDate.toISOString().split("T")[0]}.pdf`
      pdf.save(filename)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Failed to generate PDF. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/tools/timesheet"
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <ArrowLeft className="size-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold">Timesheet Reports</h1>
                <p className="text-muted-foreground">
                  View and analyze your time entries
                </p>
              </div>
            </div>
            <button
              onClick={handleExportPDF}
              disabled={isGenerating}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <Download className="size-4" />
              {isGenerating ? "Generating..." : "Export PDF"}
            </button>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div ref={reportRef} className="bg-background">
          {/* View Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6 print:hidden">
            <div className="flex gap-2">
              <button
                onClick={() => setViewType("week")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewType === "week"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border hover:bg-accent"
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setViewType("month")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewType === "month"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border hover:bg-accent"
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setViewType("client")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewType === "client"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border hover:bg-accent"
                }`}
              >
                By Client
              </button>
              <button
                onClick={() => setViewType("project")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewType === "project"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border hover:bg-accent"
                }`}
              >
                By Project
              </button>
            </div>

            <select
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              className="px-4 py-2 rounded-lg border bg-card focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Clients</option>
              {loadedClients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>

          {/* Period Navigation */}
          {(viewType === "week" || viewType === "month") && (
            <div className="flex items-center justify-between mb-6 p-4 rounded-lg border bg-card print:hidden">
              <button
                onClick={navigatePrevious}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <ChevronLeft className="size-5" />
              </button>
              <h2 className="text-xl font-semibold">{getPeriodLabel()}</h2>
              <button
                onClick={navigateNext}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          )}

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="rounded-lg border bg-card p-6">
              <p className="text-sm text-muted-foreground mb-1">Total Hours</p>
              <p className="text-3xl font-bold">
                {totals.totalHours.toFixed(1)}h
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <p className="text-sm text-muted-foreground mb-1">
                Billable Hours
              </p>
              <p className="text-3xl font-bold">
                {totals.billableHours.toFixed(1)}h
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <p className="text-sm text-muted-foreground mb-1">
                Total Earnings
              </p>
              <p className="text-3xl font-bold">
                ${totals.totalEarnings.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Grouped Entries */}
          {groupedData.length === 0 ? (
            <div className="text-center py-12 rounded-lg border bg-card">
              <p className="text-muted-foreground">
                No time entries found for this period
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {groupedData.map(([groupKey, groupEntries]) => {
                const groupTotals = calculateTotals(groupEntries)

                return (
                  <div
                    key={groupKey}
                    className="rounded-lg border bg-card overflow-hidden"
                  >
                    <div className="p-4 bg-muted border-b flex justify-between items-center">
                      <h3 className="font-semibold">
                        {viewType === "week" || viewType === "month"
                          ? formatDate(groupKey)
                          : groupKey}
                      </h3>
                      <div className="text-sm text-muted-foreground">
                        {groupTotals.totalHours.toFixed(1)}h • $
                        {groupTotals.totalEarnings.toFixed(2)}
                      </div>
                    </div>
                    <div className="divide-y">
                      {groupEntries.map((entry) => (
                        <Link
                          key={entry.id}
                          href={`/tools/timesheet/${entry.id}`}
                          className="block p-4 hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium">
                                  {entry.projectName}
                                </span>
                                {entry.billable && (
                                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                                    Billable
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {entry.client.name} • {entry.description}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">
                                {formatDuration(entry.duration)}
                              </p>
                              {entry.billable && (
                                <p className="text-sm text-muted-foreground">
                                  ${entry.amount.toFixed(2)}
                                </p>
                              )}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
