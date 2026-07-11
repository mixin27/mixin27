"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Edit, Trash2, Save } from "lucide-react"
import {
  getTimeEntryById,
  deleteTimeEntry,
  saveTimeEntry,
  getClients,
} from "@/lib/storage/tools-storage"
import { TimeEntry, Client } from "@/types/invoice"
import { formatDate } from "@/lib/utils"

export default function TimeEntryViewPage() {
  const params = useParams()
  const router = useRouter()
  const [entry, setEntry] = useState<TimeEntry | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [clients, setClients] = useState<Client[]>([])

  // Edit form state
  const [selectedClientId, setSelectedClientId] = useState<string>("")
  const [projectName, setProjectName] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [date, setDate] = useState<string>("")
  const [startTime, setStartTime] = useState<string>("")
  const [endTime, setEndTime] = useState<string>("")
  const [hourlyRate, setHourlyRate] = useState<number>(0)
  const [billable, setBillable] = useState<boolean>(true)

  useEffect(() => {
    const loadData = async () => {
      const id = params.id as string
      const [loadedEntry, loadedClients] = await Promise.all([
        getTimeEntryById(id),
        getClients(),
      ])

      if (loadedEntry) {
        setEntry(loadedEntry)
        setClients(loadedClients)

        // Initialize edit form
        setSelectedClientId(loadedEntry.clientId)
        setProjectName(loadedEntry.projectName)
        setDescription(loadedEntry.description)
        setDate(loadedEntry.date)
        setStartTime(new Date(loadedEntry.startTime).toTimeString().slice(0, 5))
        setEndTime(new Date(loadedEntry.endTime).toTimeString().slice(0, 5))
        setHourlyRate(loadedEntry.hourlyRate)
        setBillable(loadedEntry.billable)
      } else {
        router.push("/tools/timesheet")
      }
    }

    loadData()
  }, [params.id, router])

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this time entry?")) {
      await deleteTimeEntry(entry!.id)
      router.push("/tools/timesheet")
    }
  }

  const calculateDurationMinutes = () => {
    if (!startTime || !endTime) return 0

    const [startHour, startMin] = startTime.split(":").map(Number)
    const [endHour, endMin] = endTime.split(":").map(Number)

    const startMinutes = startHour * 60 + startMin
    const endMinutes = endHour * 60 + endMin

    return endMinutes - startMinutes
  }

  const handleSave = async () => {
    if (!entry) return

    const client = clients.find((c) => c.id === selectedClientId)
    if (!client) {
      alert("Invalid client selected")
      return
    }

    const duration = calculateDurationMinutes()
    if (duration <= 0) {
      alert("End time must be after start time")
      return
    }

    const amount = (duration / 60) * hourlyRate

    const updatedEntry: TimeEntry = {
      ...entry,
      clientId: selectedClientId,
      client,
      projectName,
      description,
      date,
      startTime: `${date}T${startTime}:00`,
      endTime: `${date}T${endTime}:00`,
      duration,
      hourlyRate,
      amount: billable ? amount : 0,
      billable,
      updatedAt: new Date().toISOString(),
    }

    await saveTimeEntry(updatedEntry)
    setEntry(updatedEntry)
    setIsEditing(false)
  }

  if (!entry) {
    return (
      <>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </>
    )
  }

  const duration = calculateDurationMinutes()
  const amount = (duration / 60) * hourlyRate

  return (
    <>
      {/* Header */}
      <div className="relative border-b border-border/70 pt-32 pb-20">
        <div className="pointer-events-none absolute -top-10 right-0 size-[500px] rounded-full bg-purple-500/8 blur-[120px]" aria-hidden="true" />
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-start justify-between">
            <div>
              <Link href="/tools/timesheet" className="mb-8 flex items-center gap-2 font-mono text-[11px] tracking-widest text-purple-400 uppercase transition-colors hover:text-purple-300">
                <ArrowLeft className="size-3" />
                Back to Timesheet
              </Link>
              <h1 className="mb-4 text-5xl font-bold tracking-tight">{entry.projectName}</h1>
              <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">{entry.client.name}</p>
            </div>
            <div className="shrink-0 pt-14">
              <div className="flex items-center gap-2">
                {entry.billable && (
                  <span className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm font-medium">
                    Billable
                  </span>
                )}
                {entry.invoiced && (
                  <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-medium">
                    Invoiced
                  </span>
                )}
              </div>
            </div>
          </div>

          {!isEditing && (
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-purple-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-purple-400"
              >
                <Edit className="size-4" />
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="inline-flex items-center gap-2 rounded-xl border border-destructive text-destructive px-5 py-2.5 text-sm font-semibold hover:bg-destructive/10 transition-colors"
              >
                <Trash2 className="size-4" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="max-w-3xl mx-auto">
          {!isEditing ? (
            /* View Mode */
            <div className="space-y-6">
              <div className="rounded-2xl border border-border bg-card/60 shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Details</h2>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm text-muted-foreground mb-1">
                      Description
                    </dt>
                    <dd className="text-base">{entry.description}</dd>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <dt className="text-sm text-muted-foreground mb-1">
                        Date
                      </dt>
                      <dd className="text-base">{formatDate(entry.date)}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground mb-1">
                        Duration
                      </dt>
                      <dd className="text-base">
                        {Math.floor(entry.duration / 60)}h {entry.duration % 60}
                        m
                      </dd>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <dt className="text-sm text-muted-foreground mb-1">
                        Start Time
                      </dt>
                      <dd className="text-base">
                        {new Date(entry.startTime).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground mb-1">
                        End Time
                      </dt>
                      <dd className="text-base">
                        {new Date(entry.endTime).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </dd>
                    </div>
                  </div>
                  {entry.billable && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <dt className="text-sm text-muted-foreground mb-1">
                            Hourly Rate
                          </dt>
                          <dd className="text-base">
                            ${entry.hourlyRate.toFixed(2)}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm text-muted-foreground mb-1">
                            Amount
                          </dt>
                          <dd className="text-base font-semibold">
                            ${entry.amount.toFixed(2)}
                          </dd>
                        </div>
                      </div>
                    </>
                  )}
                  {entry.tags && entry.tags.length > 0 && (
                    <div>
                      <dt className="text-sm text-muted-foreground mb-2">
                        Tags
                      </dt>
                      <dd className="flex gap-2">
                        {entry.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 rounded-full bg-muted text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          ) : (
            /* Edit Mode */
            <div className="space-y-6">
              <div className="rounded-2xl border border-border bg-card/60 shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-6">Edit Time Entry</h2>
                <div className="space-y-6">
                  <div>
                    <label className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase mb-2 block">
                      Client <span className="text-destructive">*</span>
                    </label>
                    <select
                      value={selectedClientId}
                      onChange={(e) => setSelectedClientId(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background/80 px-4 py-3 text-sm text-foreground outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20"
                      required
                    >
                      {clients.map((client) => (
                        <option key={client.id} value={client.id}>
                          {client.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase mb-2 block">
                      Project Name <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background/80 px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase mb-2 block">
                      Description <span className="text-destructive">*</span>
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      className="w-full rounded-xl border border-border bg-background/80 px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 resize-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase mb-2 block">
                        Date <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full rounded-xl border border-border bg-background/80 px-4 py-3 text-sm text-foreground outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20"
                        required
                      />
                    </div>

                    <div>
                      <label className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase mb-2 block">
                        Start Time <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="w-full rounded-xl border border-border bg-background/80 px-4 py-3 text-sm text-foreground outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20"
                        required
                      />
                    </div>

                    <div>
                      <label className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase mb-2 block">
                        End Time <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="w-full rounded-xl border border-border bg-background/80 px-4 py-3 text-sm text-foreground outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20"
                        required
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-muted">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Duration:
                      </span>
                      <span className="text-2xl font-bold">
                        {Math.floor(duration / 60)}h {duration % 60}m
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="billable-edit"
                      checked={billable}
                      onChange={(e) => setBillable(e.target.checked)}
                      className="size-4 rounded border-gray-300"
                    />
                    <label
                      htmlFor="billable-edit"
                      className="text-sm font-medium"
                    >
                      This is billable time
                    </label>
                  </div>

                  {billable && (
                    <>
                      <div>
                        <label className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase mb-2 block">
                          Hourly Rate{" "}
                          <span className="text-destructive">*</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                            $
                          </span>
                          <input
                            type="number"
                            value={hourlyRate}
                            onChange={(e) =>
                              setHourlyRate(Number(e.target.value))
                            }
                            min="0"
                            step="0.01"
                            className="w-full pl-8 pr-4 py-3 rounded-xl border border-border bg-background/80 text-sm text-foreground outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20"
                            required
                          />
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-muted">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Total Amount:
                          </span>
                          <span className="text-2xl font-bold">
                            ${amount.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setIsEditing(false)}
                  className="rounded-xl border border-border bg-card/60 px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-card"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="inline-flex items-center gap-2 rounded-xl bg-purple-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-purple-400"
                >
                  <Save className="size-4" />
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
