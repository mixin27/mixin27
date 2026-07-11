"use client"

import { v7 as uuidv7 } from 'uuid'
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save } from "lucide-react"
import {
  saveTimeEntry,
  getClients,
  getClientById,
} from "@/lib/storage/tools-storage"
import { Client, TimeEntry } from "@/types/invoice"

export default function NewTimeEntryForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preSelectedClientId = searchParams.get("clientId")

  const [clients, setClients] = useState<Client[]>([])
  const [selectedClientId, setSelectedClientId] = useState<string>("")
  const [projectName, setProjectName] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [date, setDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  )
  const [startTime, setStartTime] = useState<string>("09:00")
  const [endTime, setEndTime] = useState<string>("17:00")
  const [hourlyRate, setHourlyRate] = useState<number>(50)
  const [billable, setBillable] = useState<boolean>(true)
  const [tags, setTags] = useState<string>("")

  useEffect(() => {
    const loadData = async () => {
      const loadedClients = await getClients()
      // const settings = getSettings()

      setClients(loadedClients)

      if (preSelectedClientId) {
        const client = await getClientById(preSelectedClientId)
        if (client) {
          setSelectedClientId(preSelectedClientId)
        }
      }
    }

    loadData()
  }, [preSelectedClientId])

  const calculateDurationMinutes = () => {
    if (!startTime || !endTime) return 0

    const [startHour, startMin] = startTime.split(":").map(Number)
    const [endHour, endMin] = endTime.split(":").map(Number)

    const startMinutes = startHour * 60 + startMin
    const endMinutes = endHour * 60 + endMin

    return endMinutes - startMinutes
  }

  const duration = calculateDurationMinutes()
  const amount = (duration / 60) * hourlyRate

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedClientId) {
      alert("Please select a client")
      return
    }

    const client = clients.find((c) => c.id === selectedClientId)
    if (!client) {
      alert("Invalid client selected")
      return
    }

    if (duration <= 0) {
      alert("End time must be after start time")
      return
    }

    const entry: TimeEntry = {
      id: uuidv7(),
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
      invoiced: false,
      tags: tags ? tags.split(",").map((t) => t.trim()) : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    await saveTimeEntry(entry)
    router.push("/tools/timesheet")
  }

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
              <h1 className="mb-4 text-5xl font-bold tracking-tight">New Time Entry</h1>
              <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">Manually add a time entry</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-16">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-8">
          {/* Client & Project */}
          <div className="rounded-2xl border border-border bg-card/60 shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">Client & Project</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <option value="">Choose a client...</option>
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
                  placeholder="e.g., Website Development"
                  className="w-full rounded-xl border border-border bg-background/80 px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase mb-2 block">
                  Description <span className="text-destructive">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="What did you work on?"
                  className="w-full rounded-xl border border-border bg-background/80 px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 resize-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* Time Details */}
          <div className="rounded-2xl border border-border bg-card/60 shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">Time Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

            {/* Duration Display */}
            <div className="mt-6 p-4 rounded-xl bg-muted">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Duration:</span>
                <span className="text-2xl font-bold">
                  {Math.floor(duration / 60)}h {duration % 60}m
                </span>
              </div>
            </div>
          </div>

          {/* Billing */}
          <div className="rounded-2xl border border-border bg-card/60 shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">Billing</h2>
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="billable"
                  checked={billable}
                  onChange={(e) => setBillable(e.target.checked)}
                  className="size-4 rounded border-gray-300"
                />
                <label htmlFor="billable" className="text-sm font-medium">
                  This is billable time
                </label>
              </div>

              {billable && (
                <div>
                  <label className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase mb-2 block">
                    Hourly Rate <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                      $
                    </span>
                    <input
                      type="number"
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(Number(e.target.value))}
                      min="0"
                      step="0.01"
                      className="w-full pl-8 pr-4 py-3 rounded-xl border border-border bg-background/80 text-sm text-foreground outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20"
                      required
                    />
                  </div>
                </div>
              )}

              {billable && (
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
              )}
            </div>
          </div>

          {/* Tags (Optional) */}
          <div className="rounded-2xl border border-border bg-card/60 shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">Additional Info</h2>
            <div>
              <label className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase mb-2 block">
                Tags (optional)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="development, design, meeting (comma separated)"
                className="w-full rounded-xl border border-border bg-background/80 px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Separate tags with commas
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 justify-end">
            <Link
              href="/tools/timesheet"
              className="rounded-xl border border-border bg-card/60 px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-card"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-purple-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-purple-400"
            >
              <Save className="size-4" />
              Save Time Entry
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
