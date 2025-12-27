"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Plus,
  Clock,
  Play,
  Pause,
  Square,
  Search,
  ArrowLeft,
  Calendar,
  DollarSign,
} from "lucide-react"
import {
  getTimeEntries,
  getTimeTrackingStats,
  getRunningTimer,
  saveRunningTimer,
  clearRunningTimer,
  saveTimeEntry,
  getClients,
  calculateDuration,
  formatDuration,
} from "@/lib/storage/tools-storage"
import { TimeEntry, RunningTimer, Client } from "@/types/invoice"
import { formatDate } from "@/lib/utils"

export default function TimeTrackingPage() {
  const [entries, setEntries] = useState<TimeEntry[]>([])
  const [stats, setStats] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<
    "all" | "billable" | "non-billable"
  >("all")
  const [timer, setTimer] = useState<RunningTimer | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [showTimerModal, setShowTimerModal] = useState(false)

  useEffect(() => {
    loadData()
    loadTimer()
  }, [])

  // Timer interval
  useEffect(() => {
    if (!timer || timer.isPaused) return

    const interval = setInterval(() => {
      const now = Date.now()
      const start = new Date(timer.startTime).getTime()
      const elapsed = Math.floor((now - start - timer.totalPausedTime) / 1000)
      setElapsedTime(elapsed)
    }, 1000)

    return () => clearInterval(interval)
  }, [timer])

  const loadData = () => {
    const loadedEntries = getTimeEntries()
    setEntries(
      loadedEntries.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      ),
    )
    setStats(getTimeTrackingStats())
  }

  const loadTimer = () => {
    const runningTimer = getRunningTimer()
    if (runningTimer) {
      setTimer(runningTimer)
      const now = Date.now()
      const start = new Date(runningTimer.startTime).getTime()
      const elapsed = Math.floor(
        (now - start - runningTimer.totalPausedTime) / 1000,
      )
      setElapsedTime(elapsed)
    }
  }

  const startTimer = () => {
    setShowTimerModal(true)
  }

  const pauseTimer = () => {
    if (!timer) return

    const updatedTimer = {
      ...timer,
      isPaused: true,
      pausedAt: new Date().toISOString(),
    }
    setTimer(updatedTimer)
    saveRunningTimer(updatedTimer)
  }

  const resumeTimer = () => {
    if (!timer || !timer.pausedAt) return

    const pauseDuration = Date.now() - new Date(timer.pausedAt).getTime()
    const updatedTimer = {
      ...timer,
      isPaused: false,
      pausedAt: undefined,
      totalPausedTime: timer.totalPausedTime + pauseDuration,
    }
    setTimer(updatedTimer)
    saveRunningTimer(updatedTimer)
  }

  const stopTimer = () => {
    if (!timer) return

    const now = new Date()
    const startTime = new Date(timer.startTime)
    const duration = calculateDuration(timer.startTime, now.toISOString())

    // Create time entry from timer
    const client = getClients().find((c) => c.id === timer.clientId)
    if (!client) {
      alert("Client not found")
      return
    }

    // const settings = { defaultCurrency: "USD" } // Get from settings if needed
    const hourlyRate = 50 // Default rate, can be customized

    const entry: TimeEntry = {
      id: crypto.randomUUID(),
      clientId: timer.clientId,
      client,
      projectName: timer.projectName,
      description: timer.description,
      date: startTime.toISOString().split("T")[0],
      startTime: timer.startTime,
      endTime: now.toISOString(),
      duration: duration - Math.floor(timer.totalPausedTime / 1000 / 60),
      hourlyRate,
      amount:
        ((duration - Math.floor(timer.totalPausedTime / 1000 / 60)) / 60) *
        hourlyRate,
      billable: true,
      invoiced: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    saveTimeEntry(entry)
    clearRunningTimer()
    setTimer(null)
    setElapsedTime(0)
    loadData()
  }

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      entry.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFilter =
      filterType === "all" ||
      (filterType === "billable" && entry.billable) ||
      (filterType === "non-billable" && !entry.billable)

    return matchesSearch && matchesFilter
  })

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
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
                <h1 className="text-3xl font-bold mb-2">Time Tracking</h1>
                <p className="text-muted-foreground">
                  Track your time and manage timesheets
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link
                href="/tools/timesheet/reports"
                className="inline-flex items-center gap-2 rounded-lg border bg-background px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
              >
                <Calendar className="size-4" />
                Reports
              </Link>
              <Link
                href="/tools/timesheet/new"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <Plus className="size-4" />
                Manual Entry
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Timer Card */}
        <div className="rounded-lg border bg-card p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Timer</h2>
              {timer && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    {timer.projectName} - {timer.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Client:{" "}
                    {getClients().find((c) => c.id === timer.clientId)?.name}
                  </p>
                </div>
              )}
            </div>
            <div className="text-center">
              <div className="text-5xl font-mono font-bold mb-4">
                {formatTime(elapsedTime)}
              </div>
              <div className="flex gap-3">
                {!timer ? (
                  <button
                    onClick={startTimer}
                    className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 text-white hover:bg-green-700 transition-colors"
                  >
                    <Play className="size-5" />
                    Start Timer
                  </button>
                ) : (
                  <>
                    {timer.isPaused ? (
                      <button
                        onClick={resumeTimer}
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 transition-colors"
                      >
                        <Play className="size-5" />
                        Resume
                      </button>
                    ) : (
                      <button
                        onClick={pauseTimer}
                        className="inline-flex items-center gap-2 rounded-lg bg-yellow-600 px-6 py-3 text-white hover:bg-yellow-700 transition-colors"
                      >
                        <Pause className="size-5" />
                        Pause
                      </button>
                    )}
                    <button
                      onClick={stopTimer}
                      className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-6 py-3 text-white hover:bg-red-700 transition-colors"
                    >
                      <Square className="size-4" />
                      Stop
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="rounded-lg border bg-card p-6">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <Clock className="size-6 text-blue-600 dark:text-blue-200" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {stats.totalHours.toFixed(1)}h
                  </p>
                  <p className="text-sm text-muted-foreground">Total Hours</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-card p-6">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <DollarSign className="size-6 text-green-600 dark:text-green-200" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    ${stats.totalEarnings.toFixed(0)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Total Earnings
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-card p-6">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                  <span className="text-2xl">📊</span>
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {stats.thisWeekHours.toFixed(1)}h
                  </p>
                  <p className="text-sm text-muted-foreground">This Week</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-card p-6">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                  <span className="text-2xl">💰</span>
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    ${stats.uninvoicedEarnings.toFixed(0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Uninvoiced</p>
                </div>
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
              placeholder="Search time entries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Entries</option>
            <option value="billable">Billable Only</option>
            <option value="non-billable">Non-Billable Only</option>
          </select>
        </div>

        {/* Time Entries List */}
        {filteredEntries.length === 0 ? (
          <div className="text-center py-12 rounded-lg border bg-card">
            <Clock className="size-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              No time entries found
            </h3>
            <p className="text-muted-foreground mb-6">
              Start tracking your time or add a manual entry
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={startTimer}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <Play className="size-4" />
                Start Timer
              </button>
              <Link
                href="/tools/timesheet/new"
                className="inline-flex items-center gap-2 rounded-lg border bg-background px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
              >
                <Plus className="size-4" />
                Manual Entry
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEntries.map((entry) => (
              <Link
                key={entry.id}
                href={`/tools/timesheet/${entry.id}`}
                className="block rounded-lg border bg-card p-6 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">
                        {entry.projectName}
                      </h3>
                      {entry.billable ? (
                        <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:text-green-200">
                          Billable
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-900 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:text-gray-200">
                          Non-billable
                        </span>
                      )}
                      {entry.invoiced && (
                        <span className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:text-blue-200">
                          Invoiced
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {entry.client.name} • {entry.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(entry.date)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold mb-1">
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
        )}
      </div>

      {/* Timer Start Modal */}
      {showTimerModal && (
        <TimerStartModal
          onStart={(clientId, projectName, description) => {
            const newTimer: RunningTimer = {
              id: crypto.randomUUID(),
              clientId,
              projectName,
              description,
              startTime: new Date().toISOString(),
              isPaused: false,
              totalPausedTime: 0,
            }
            setTimer(newTimer)
            saveRunningTimer(newTimer)
            setShowTimerModal(false)
            setElapsedTime(0)
          }}
          onClose={() => setShowTimerModal(false)}
        />
      )}
    </div>
  )
}

// Timer Start Modal Component
interface TimerStartModalProps {
  onStart: (clientId: string, projectName: string, description: string) => void
  onClose: () => void
}

function TimerStartModal({ onStart, onClose }: TimerStartModalProps) {
  const [clients, setClients] = useState<Client[]>([])
  const [clientId, setClientId] = useState("")
  const [projectName, setProjectName] = useState("")
  const [description, setDescription] = useState("")

  useEffect(() => {
    setClients(getClients())
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!clientId || !projectName || !description) {
      alert("Please fill in all fields")
      return
    }
    onStart(clientId, projectName, description)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg max-w-md w-full p-6">
        <h2 className="text-2xl font-bold mb-4">Start Timer</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Client <span className="text-destructive">*</span>
            </label>
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              required
            >
              <option value="">Select client...</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Project Name <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="e.g., Website Development"
              className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Description <span className="text-destructive">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="What are you working on?"
              className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              required
            />
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border bg-background hover:bg-accent transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
            >
              <Play className="size-4" />
              Start Timer
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
