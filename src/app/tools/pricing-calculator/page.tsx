"use client"

import { useMemo, useState, type Dispatch, type SetStateAction } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { v7 as uuidv7 } from "uuid"
import { ArrowLeft, Calculator, Copy, FileCheck, RotateCcw } from "lucide-react"

import { getSettings } from "@/lib/storage/tools-storage"
import { saveQuotationDraft } from "@/lib/storage/quotation-drafts"
import type { InvoiceItem } from "@/types/invoice"

import { addonDefaults, baseDefaults, supportDefaults } from "./data"
import {
  defaultPaymentTermsPreset,
  paymentTermsPresets,
} from "./payment-terms"
import { defaultPresetKey, presetOrder, templates } from "./presets"
import type { Item, Mode, PackageKey, SupportPlan } from "./types"

type QuoteScenario = "low" | "mid" | "high"

const cloneItems = (items: Item[]) => items.map((item) => ({ ...item }))
const cloneSupport = (items: SupportPlan[]) =>
  items.map((item) => ({ ...item }))

const applyPackage = (items: Item[], ids: string[]) => {
  const selected = new Set(ids)
  return items.map((item) => ({
    ...item,
    selected: selected.has(item.id),
  }))
}

const formatNumber = (value: number) =>
  Math.round(value).toLocaleString("en-US")

const roundDays = (value: number) => Math.round(value * 2) / 2

const sumDays = (items: Item[], key: "daysLow" | "daysHigh") =>
  items.reduce((sum, item) => sum + item[key], 0)

const packageKeys: PackageKey[] = ["mvp", "standard", "advanced"]

const getInitialPresetKey = () => {
  if (templates[defaultPresetKey]) return defaultPresetKey
  if (presetOrder.length > 0 && templates[presetOrder[0]]) return presetOrder[0]
  return Object.keys(templates)[0]
}

export default function PricingCalculatorPage() {
  const router = useRouter()
  const initialPresetKey = getInitialPresetKey()
  const initialTemplate = templates[initialPresetKey]

  const [mode, setMode] = useState<Mode>("salary")
  const [monthlySalary, setMonthlySalary] = useState(1500000)
  const [workingDays, setWorkingDays] = useState(22)
  const [daysPerWeek, setDaysPerWeek] = useState(5)
  const [multiplierLow, setMultiplierLow] = useState(2.0)
  const [multiplierHigh, setMultiplierHigh] = useState(3.0)
  const [manualDayRateLow, setManualDayRateLow] = useState(140000)
  const [manualDayRateHigh, setManualDayRateHigh] = useState(200000)
  const [contingency, setContingency] = useState(15)
  const [paymentTermsPreset, setPaymentTermsPreset] = useState(
    defaultPaymentTermsPreset,
  )
  const [customPaymentTerms, setCustomPaymentTerms] = useState("")

  const [projectPreset, setProjectPreset] = useState(initialPresetKey)
  const [activePackage, setActivePackage] = useState<PackageKey>(
    initialTemplate?.defaultPackage ?? "mvp",
  )
  const [baseItems, setBaseItems] = useState(() => cloneItems(baseDefaults))
  const [features, setFeatures] = useState(() =>
    initialTemplate
      ? applyPackage(
          cloneItems(initialTemplate.features),
          initialTemplate.packages[initialTemplate.defaultPackage],
        )
      : [],
  )
  const [addons, setAddons] = useState(() => cloneItems(addonDefaults))
  const [supportPlans, setSupportPlans] = useState(() =>
    cloneSupport(supportDefaults),
  )
  const [copyStatus, setCopyStatus] = useState("Copy summary")
  const [quoteScenario, setQuoteScenario] = useState<QuoteScenario>("mid")
  const [customFeature, setCustomFeature] = useState({
    name: "",
    scope: "",
    daysLow: 2,
    daysHigh: 4,
  })

  const currentTemplate = templates[projectPreset] ?? initialTemplate

  const dayRates = useMemo(() => {
    let low = manualDayRateLow
    let high = manualDayRateHigh

    if (mode === "salary") {
      const baseRate = monthlySalary / Math.max(1, workingDays)
      low = baseRate * multiplierLow
      high = baseRate * multiplierHigh
    }

    if (low > high) {
      return { low: high, high: low }
    }

    return { low, high }
  }, [
    mode,
    manualDayRateLow,
    manualDayRateHigh,
    monthlySalary,
    workingDays,
    multiplierLow,
    multiplierHigh,
  ])

  const baseSelected = baseItems.filter((item) => item.selected)
  const featureSelected = features.filter((item) => item.selected)
  const addonSelected = addons.filter((item) => item.selected)

  const baseDaysLow = sumDays(baseSelected, "daysLow")
  const baseDaysHigh = sumDays(baseSelected, "daysHigh")
  const featureDaysLow = sumDays(featureSelected, "daysLow")
  const featureDaysHigh = sumDays(featureSelected, "daysHigh")
  const addonDaysLow = sumDays(addonSelected, "daysLow")
  const addonDaysHigh = sumDays(addonSelected, "daysHigh")

  const totalDaysLow = baseDaysLow + featureDaysLow + addonDaysLow
  const totalDaysHigh = baseDaysHigh + featureDaysHigh + addonDaysHigh

  const baseFeeLow = totalDaysLow * dayRates.low
  const baseFeeHigh = totalDaysHigh * dayRates.high
  const contingencyLow = baseFeeLow * (contingency / 100)
  const contingencyHigh = baseFeeHigh * (contingency / 100)
  const totalWithContingencyLow = baseFeeLow + contingencyLow
  const totalWithContingencyHigh = baseFeeHigh + contingencyHigh

  const timelineLow = totalDaysLow / Math.max(1, daysPerWeek)
  const timelineHigh = totalDaysHigh / Math.max(1, daysPerWeek)

  const hourlyLow = dayRates.low / 8
  const hourlyHigh = dayRates.high / 8

  const paymentTermsPreview = useMemo(() => {
    if (paymentTermsPreset === "custom") {
      return customPaymentTerms.trim() || "Add custom payment terms."
    }
    const preset = paymentTermsPresets.find(
      (item) => item.id === paymentTermsPreset,
    )
    if (preset?.id === "default") {
      return "Use default payment terms from settings."
    }
    return preset?.terms || "Select a payment terms preset."
  }, [customPaymentTerms, paymentTermsPreset])

  const scenarioDayRate = useMemo(() => {
    if (quoteScenario === "low") return dayRates.low
    if (quoteScenario === "high") return dayRates.high
    return (dayRates.low + dayRates.high) / 2
  }, [dayRates.high, dayRates.low, quoteScenario])

  const getScenarioDays = (item: Item) => {
    if (quoteScenario === "low") return roundDays(item.daysLow)
    if (quoteScenario === "high") return roundDays(item.daysHigh)
    return roundDays((item.daysLow + item.daysHigh) / 2)
  }

  const scenarioBaseDays = baseSelected.reduce(
    (sum, item) => sum + getScenarioDays(item),
    0,
  )
  const scenarioFeatureDays = featureSelected.reduce(
    (sum, item) => sum + getScenarioDays(item),
    0,
  )
  const scenarioAddonDays = addonSelected.reduce(
    (sum, item) => sum + getScenarioDays(item),
    0,
  )
  const scenarioSubtotal =
    (scenarioBaseDays + scenarioFeatureDays + scenarioAddonDays) *
    scenarioDayRate
  const scenarioContingency = scenarioSubtotal * (contingency / 100)
  const scenarioTotal = scenarioSubtotal + scenarioContingency

  const handlePresetChange = (value: string) => {
    const template = templates[value]
    if (!template) return

    const nextPackage = template.defaultPackage
    const nextFeatures = applyPackage(
      cloneItems(template.features),
      template.packages[nextPackage],
    )

    setProjectPreset(value)
    setActivePackage(nextPackage)
    setFeatures(nextFeatures)
  }

  const handlePackageSelect = (key: PackageKey) => {
    if (!currentTemplate) return
    const packageIds = currentTemplate.packages[key] || []
    setFeatures((prev) => applyPackage(prev, packageIds))
    setActivePackage(key)
  }

  const handleSelectAll = () =>
    setFeatures((prev) => prev.map((item) => ({ ...item, selected: true })))

  const handleSelectNone = () =>
    setFeatures((prev) => prev.map((item) => ({ ...item, selected: false })))

  const handleItemChange = (
    setter: Dispatch<SetStateAction<Item[]>>,
    id: string,
    field: "selected" | "daysLow" | "daysHigh",
    value: boolean | number,
  ) => {
    setter((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item

        if (field === "selected") {
          return { ...item, selected: value as boolean }
        }

        const updated = {
          ...item,
          [field]: value as number,
        }

        if (field === "daysLow" && updated.daysLow > updated.daysHigh) {
          updated.daysHigh = updated.daysLow
        }

        if (field === "daysHigh" && updated.daysHigh < updated.daysLow) {
          updated.daysLow = updated.daysHigh
        }

        return updated
      }),
    )
  }

  const handleSupportChange = (id: string, value: number) => {
    setSupportPlans((prev) =>
      prev.map((plan) => (plan.id === id ? { ...plan, hours: value } : plan)),
    )
  }

  const handleAddFeature = () => {
    if (!customFeature.name.trim()) return

    const idBase = customFeature.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "")

    const newFeature: Item = {
      id: `custom-${idBase}-${Date.now()}`,
      name: customFeature.name.trim(),
      scope: customFeature.scope.trim() || "Custom feature",
      daysLow: customFeature.daysLow,
      daysHigh: customFeature.daysHigh,
      selected: true,
    }

    setFeatures((prev) => [...prev, newFeature])
    setCustomFeature({ name: "", scope: "", daysLow: 2, daysHigh: 4 })
  }

  const handleReset = () => {
    const nextPresetKey = getInitialPresetKey()
    const nextTemplate = templates[nextPresetKey]

    setMode("salary")
    setMonthlySalary(1500000)
    setWorkingDays(22)
    setDaysPerWeek(5)
    setMultiplierLow(2.0)
    setMultiplierHigh(3.0)
    setManualDayRateLow(140000)
    setManualDayRateHigh(200000)
    setContingency(15)
    setPaymentTermsPreset(defaultPaymentTermsPreset)
    setCustomPaymentTerms("")
    setProjectPreset(nextPresetKey)
    setActivePackage(nextTemplate?.defaultPackage ?? "mvp")
    setBaseItems(cloneItems(baseDefaults))
    setAddons(cloneItems(addonDefaults))
    setSupportPlans(cloneSupport(supportDefaults))

    if (nextTemplate) {
      setFeatures(
        applyPackage(
          cloneItems(nextTemplate.features),
          nextTemplate.packages[nextTemplate.defaultPackage],
        ),
      )
    } else {
      setFeatures([])
    }
  }

  const buildSummaryText = () => {
    return [
      "Myanmar Project Fee Summary",
      `Mode: ${mode}`,
      `Day rate: ${formatNumber(dayRates.low)} to ${formatNumber(
        dayRates.high,
      )} MMK/day`,
      `Base scope days: ${baseDaysLow.toFixed(1)} to ${baseDaysHigh.toFixed(
        1,
      )}`,
      `Feature days: ${featureDaysLow.toFixed(1)} to ${featureDaysHigh.toFixed(
        1,
      )}`,
      `Add-on days: ${addonDaysLow.toFixed(1)} to ${addonDaysHigh.toFixed(1)}`,
      `Total days: ${totalDaysLow.toFixed(1)} to ${totalDaysHigh.toFixed(1)}`,
      `Base fee: ${formatNumber(baseFeeLow)} to ${formatNumber(
        baseFeeHigh,
      )} MMK`,
      `Contingency: ${contingency}%`,
      `Total with contingency: ${formatNumber(
        totalWithContingencyLow,
      )} to ${formatNumber(totalWithContingencyHigh)} MMK`,
    ].join("\n")
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(buildSummaryText())
      setCopyStatus("Copied!")
      setTimeout(() => setCopyStatus("Copy summary"), 1500)
    } catch (error) {
      setCopyStatus("Copy failed")
      setTimeout(() => setCopyStatus("Copy summary"), 1500)
    }
  }

  const buildQuotationItems = (): InvoiceItem[] => {
    const items: InvoiceItem[] = []

    const pushItem = (prefix: string, item: Item) => {
      const quantity = getScenarioDays(item)
      if (quantity <= 0) return
      const rate = scenarioDayRate
      items.push({
        id: uuidv7(),
        description: `${prefix}: ${item.name}`,
        quantity,
        rate,
        amount: quantity * rate,
      })
    }

    baseSelected.forEach((item) => pushItem("Base", item))
    featureSelected.forEach((item) => pushItem("Feature", item))
    addonSelected.forEach((item) => pushItem("Add-on", item))

    const subtotal = items.reduce((sum, item) => sum + item.amount, 0)
    if (contingency > 0) {
      const contingencyAmount = subtotal * (contingency / 100)
      items.push({
        id: uuidv7(),
        description: `Contingency (${contingency}%)`,
        quantity: 1,
        rate: contingencyAmount,
        amount: contingencyAmount,
      })
    }

    return items
  }

  const buildDraftNotes = () => {
    const scenarioLabel =
      quoteScenario === "low"
        ? "Low (min days + low rate)"
        : quoteScenario === "high"
          ? "High (max days + high rate)"
          : "Balanced (avg days + mid rate)"

    const lines = [
      "Generated from Pricing Calculator",
      `Preset: ${currentTemplate?.label ?? "Custom"}`,
      `Scenario: ${scenarioLabel}`,
      `Day rate used: ${formatNumber(scenarioDayRate)} MMK/day`,
      `Base days: ${scenarioBaseDays.toFixed(1)}`,
      `Feature days: ${scenarioFeatureDays.toFixed(1)}`,
      `Add-on days: ${scenarioAddonDays.toFixed(1)}`,
      `Scenario total: ${formatNumber(scenarioTotal)} MMK`,
    ]

    return lines.join("\n")
  }

  const handleCreateQuotation = () => {
    const itemCount =
      baseSelected.length + featureSelected.length + addonSelected.length
    if (itemCount === 0) {
      alert("Select at least one item before generating a quotation.")
      return
    }

    const settings = getSettings()
    if (paymentTermsPreset === "custom" && !customPaymentTerms.trim()) {
      alert("Please add custom payment terms or choose a preset.")
      return
    }

    const selectedPreset = paymentTermsPresets.find(
      (preset) => preset.id === paymentTermsPreset,
    )
    const resolvedTerms =
      paymentTermsPreset === "custom"
        ? customPaymentTerms.trim()
        : selectedPreset?.id === "default"
          ? settings.defaultPaymentTerms
          : selectedPreset?.terms || settings.defaultPaymentTerms
    const draftId = uuidv7()
    const items = buildQuotationItems()

    saveQuotationDraft({
      id: draftId,
      source: "pricing-calculator",
      createdAt: new Date().toISOString(),
      currency: settings.defaultCurrency,
      taxRate: settings.defaultTaxRate,
      discount: 0,
      discountType: "percentage",
      notes: buildDraftNotes(),
      terms: resolvedTerms,
      items,
    })

    router.push(`/tools/quotations/new?draftId=${draftId}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-linear-to-br from-primary/10 via-background to-transparent">
        <div className="container py-8">
          <div className="flex flex-col gap-4">
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              Back to tools
            </Link>
            <div className="flex flex-col gap-2">
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                <Calculator className="size-4" />
                Pricing Calculator
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">
                Project Fee Calculator
              </h1>
              <p className="text-muted-foreground max-w-2xl">
                Build estimates with fixed base scope, preset templates, and
                flexible features. Optimized for Myanmar freelance pricing.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-10 space-y-6">
        <section className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-semibold">1. Rate inputs</h2>
              <p className="text-sm text-muted-foreground">
                Choose salary-based or manual day-rate pricing.
              </p>
            </div>
            <div className="inline-flex gap-2 rounded-lg border bg-muted/40 p-1 text-sm">
              {["salary", "manual"].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setMode(value as Mode)}
                  className={`px-3 py-1.5 rounded-md transition-colors ${
                    mode === value
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {value === "salary" ? "Salary-based" : "Manual day rate"}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="flex flex-col gap-2 text-sm font-medium text-muted-foreground">
              Monthly salary (MMK)
              <input
                type="number"
                value={monthlySalary}
                min={0}
                step={5000}
                onChange={(event) =>
                  setMonthlySalary(Number(event.target.value) || 0)
                }
                className="h-10 rounded-lg border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-muted-foreground">
              Working days per month
              <input
                type="number"
                value={workingDays}
                min={1}
                step={1}
                onChange={(event) =>
                  setWorkingDays(Number(event.target.value) || 1)
                }
                className="h-10 rounded-lg border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-muted-foreground">
              Work days per week
              <input
                type="number"
                value={daysPerWeek}
                min={1}
                step={1}
                onChange={(event) =>
                  setDaysPerWeek(Number(event.target.value) || 1)
                }
                className="h-10 rounded-lg border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
            <label className="flex flex-col gap-2 text-sm font-medium text-muted-foreground">
              Multiplier low
              <input
                type="number"
                value={multiplierLow}
                min={1}
                step={0.1}
                onChange={(event) =>
                  setMultiplierLow(Number(event.target.value) || 1)
                }
                className="h-10 rounded-lg border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-muted-foreground">
              Multiplier high
              <input
                type="number"
                value={multiplierHigh}
                min={1}
                step={0.1}
                onChange={(event) =>
                  setMultiplierHigh(Number(event.target.value) || 1)
                }
                className="h-10 rounded-lg border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-muted-foreground">
              Contingency %
              <input
                type="number"
                value={contingency}
                min={0}
                step={1}
                onChange={(event) =>
                  setContingency(Number(event.target.value) || 0)
                }
                className="h-10 rounded-lg border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </label>
            <div className="rounded-lg border bg-muted/30 p-3 text-sm">
              <p className="text-muted-foreground">Computed day rate</p>
              <p className="text-lg font-semibold text-primary">
                {formatNumber(dayRates.low)} to {formatNumber(dayRates.high)}
                <span className="text-sm font-normal text-muted-foreground">
                  {" "}
                  MMK/day
                </span>
              </p>
            </div>
          </div>

          {mode === "manual" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <label className="flex flex-col gap-2 text-sm font-medium text-muted-foreground">
                Day rate low (MMK)
                <input
                  type="number"
                  value={manualDayRateLow}
                  min={0}
                  step={1000}
                  onChange={(event) =>
                    setManualDayRateLow(Number(event.target.value) || 0)
                  }
                  className="h-10 rounded-lg border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-muted-foreground">
                Day rate high (MMK)
                <input
                  type="number"
                  value={manualDayRateHigh}
                  min={0}
                  step={1000}
                  onChange={(event) =>
                    setManualDayRateHigh(Number(event.target.value) || 0)
                  }
                  className="h-10 rounded-lg border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </label>
            </div>
          )}
        </section>

        <section className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">2. Fixed scope base</h2>
            <p className="text-sm text-muted-foreground">
              Core work applied to most projects. Adjust days or uncheck if
              excluded.
            </p>
          </div>
          <PricingTable
            items={baseItems}
            dayRates={dayRates}
            label="Base item"
            onChange={(id, field, value) =>
              handleItemChange(setBaseItems, id, field, value)
            }
          />
        </section>

        <section className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold">3. Project features</h2>
              <p className="text-sm text-muted-foreground">
                Pick a preset or build your own feature list.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleSelectNone}
                className="rounded-lg border px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground"
              >
                Select none
              </button>
              {packageKeys.map((key) => {
                const available = currentTemplate?.packages[key].length
                const isActive = activePackage === key
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handlePackageSelect(key)}
                    disabled={!available}
                    className={`rounded-lg border px-3 py-1.5 text-sm capitalize transition-colors ${
                      available
                        ? isActive
                          ? "border-primary bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground"
                        : "cursor-not-allowed text-muted-foreground/60"
                    }`}
                  >
                    {key}
                  </button>
                )
              })}
              <button
                type="button"
                onClick={handleSelectAll}
                className="rounded-lg border px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground"
              >
                Select all
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-4 mb-4">
            <label className="flex flex-col gap-2 text-sm font-medium text-muted-foreground">
              Project preset
              <select
                value={projectPreset}
                onChange={(event) => handlePresetChange(event.target.value)}
                className="h-10 rounded-lg border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {presetOrder.map((key) => (
                  <option key={key} value={key}>
                    {templates[key]?.label ?? key}
                  </option>
                ))}
              </select>
            </label>
            <div className="rounded-lg border bg-muted/30 p-3 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Preset note:</span>{" "}
              {currentTemplate?.note ?? "Add a template in presets.ts"}
            </div>
          </div>

          <PricingTable
            items={features}
            dayRates={dayRates}
            label="Feature"
            onChange={(id, field, value) =>
              handleItemChange(setFeatures, id, field, value)
            }
          />

          <div className="mt-6 rounded-xl border bg-muted/10 p-4">
            <h3 className="text-lg font-semibold mb-3">Add custom feature</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <label className="flex flex-col gap-2 text-sm font-medium text-muted-foreground">
                Feature name
                <input
                  type="text"
                  value={customFeature.name}
                  onChange={(event) =>
                    setCustomFeature((prev) => ({
                      ...prev,
                      name: event.target.value,
                    }))
                  }
                  className="h-10 rounded-lg border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-muted-foreground">
                Scope
                <input
                  type="text"
                  value={customFeature.scope}
                  onChange={(event) =>
                    setCustomFeature((prev) => ({
                      ...prev,
                      scope: event.target.value,
                    }))
                  }
                  className="h-10 rounded-lg border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-muted-foreground">
                Days low
                <input
                  type="number"
                  min={0}
                  step={0.5}
                  value={customFeature.daysLow}
                  onChange={(event) =>
                    setCustomFeature((prev) => ({
                      ...prev,
                      daysLow: Number(event.target.value) || 0,
                    }))
                  }
                  className="h-10 rounded-lg border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-muted-foreground">
                Days high
                <input
                  type="number"
                  min={0}
                  step={0.5}
                  value={customFeature.daysHigh}
                  onChange={(event) =>
                    setCustomFeature((prev) => ({
                      ...prev,
                      daysHigh: Number(event.target.value) || 0,
                    }))
                  }
                  className="h-10 rounded-lg border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </label>
            </div>
            <div className="mt-4">
              <button
                type="button"
                onClick={handleAddFeature}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Add feature
              </button>
            </div>
          </div>
        </section>

        <section className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">4. Add-ons</h2>
            <p className="text-sm text-muted-foreground">
              Optional extras that can be quoted separately.
            </p>
          </div>
          <PricingTable
            items={addons}
            dayRates={dayRates}
            label="Add-on"
            onChange={(id, field, value) =>
              handleItemChange(setAddons, id, field, value)
            }
          />
        </section>

        <section className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">5. Monthly support</h2>
            <p className="text-sm text-muted-foreground">
              Calculated using the same day-rate band. Not included in totals.
            </p>
          </div>
          <SupportTable
            plans={supportPlans}
            hourlyRates={{ low: hourlyLow, high: hourlyHigh }}
            onChange={handleSupportChange}
          />
        </section>

        <section className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">6. Payment terms</h2>
            <p className="text-sm text-muted-foreground">
              Used when generating a quotation from this calculator.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-4">
            <label className="flex flex-col gap-2 text-sm font-medium text-muted-foreground">
              Payment terms preset
              <select
                value={paymentTermsPreset}
                onChange={(event) =>
                  setPaymentTermsPreset(event.target.value)
                }
                className="h-10 rounded-lg border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {paymentTermsPresets.map((preset) => (
                  <option key={preset.id} value={preset.id}>
                    {preset.label}
                  </option>
                ))}
              </select>
            </label>
            <div className="rounded-lg border bg-muted/30 p-3 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Preview:</span>{" "}
              {paymentTermsPreview}
            </div>
          </div>

          {paymentTermsPreset === "custom" && (
            <div className="mt-4">
              <label className="flex flex-col gap-2 text-sm font-medium text-muted-foreground">
                Custom payment terms
                <textarea
                  value={customPaymentTerms}
                  onChange={(event) => setCustomPaymentTerms(event.target.value)}
                  rows={4}
                  className="rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </label>
            </div>
          )}
        </section>

        <section className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold">Summary</h2>
              <p className="text-sm text-muted-foreground">
                Totals include base scope, selected features, and add-ons.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="size-4" />
                Reset defaults
              </button>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                <Copy className="size-4" />
                {copyStatus}
              </button>
              <button
                type="button"
                onClick={handleCreateQuotation}
                disabled={totalDaysHigh === 0}
                className="inline-flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 px-3 py-2 text-sm font-medium text-primary hover:bg-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FileCheck className="size-4" />
                Create quotation
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-4 mb-6">
            <label className="flex flex-col gap-2 text-sm font-medium text-muted-foreground">
              Quotation scenario
              <select
                value={quoteScenario}
                onChange={(event) =>
                  setQuoteScenario(event.target.value as QuoteScenario)
                }
                className="h-10 rounded-lg border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="low">Low (min days + low rate)</option>
                <option value="mid">Balanced (avg days + mid rate)</option>
                <option value="high">High (max days + high rate)</option>
              </select>
            </label>
            <div className="rounded-lg border bg-muted/30 p-3 text-sm">
              <p className="text-muted-foreground">Scenario summary</p>
              <p className="text-base font-semibold text-foreground">
                {formatNumber(scenarioTotal)} MMK
              </p>
              <p className="text-xs text-muted-foreground">
                Rate: {formatNumber(scenarioDayRate)} MMK/day · Days:{" "}
                {(scenarioBaseDays + scenarioFeatureDays + scenarioAddonDays).toFixed(
                  1,
                )}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SummaryCard label="Base scope days">
              {baseDaysLow.toFixed(1)} to {baseDaysHigh.toFixed(1)}
            </SummaryCard>
            <SummaryCard label="Feature days">
              {featureDaysLow.toFixed(1)} to {featureDaysHigh.toFixed(1)}
            </SummaryCard>
            <SummaryCard label="Add-on days">
              {addonDaysLow.toFixed(1)} to {addonDaysHigh.toFixed(1)}
            </SummaryCard>
            <SummaryCard label="Total days">
              {totalDaysLow.toFixed(1)} to {totalDaysHigh.toFixed(1)}
            </SummaryCard>
            <SummaryCard label="Base fee range">
              {formatNumber(baseFeeLow)} to {formatNumber(baseFeeHigh)} MMK
            </SummaryCard>
            <SummaryCard label="Contingency">
              {formatNumber(contingencyLow)} to {formatNumber(contingencyHigh)}{" "}
              MMK ({contingency}%)
            </SummaryCard>
            <SummaryCard label="Total with contingency" highlight>
              {formatNumber(totalWithContingencyLow)} to{" "}
              {formatNumber(totalWithContingencyHigh)} MMK
            </SummaryCard>
            <SummaryCard label="Estimated timeline">
              {timelineLow.toFixed(1)} to {timelineHigh.toFixed(1)} weeks
            </SummaryCard>
            <SummaryCard label="Hourly rate band">
              {formatNumber(hourlyLow)} to {formatNumber(hourlyHigh)} MMK/hour
            </SummaryCard>
          </div>
        </section>
      </div>
    </div>
  )
}

function PricingTable({
  items,
  dayRates,
  label,
  onChange,
}: {
  items: Item[]
  dayRates: { low: number; high: number }
  label: string
  onChange: (
    id: string,
    field: "selected" | "daysLow" | "daysHigh",
    value: boolean | number,
  ) => void
}) {
  return (
    <div className="space-y-3">
      <div className="hidden md:grid grid-cols-[40px_2fr_1.4fr_1fr] gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        <span>Pick</span>
        <span>{label}</span>
        <span>Days</span>
        <span>Fee range</span>
      </div>
      {items.length === 0 ? (
        <div className="rounded-lg border bg-muted/10 p-4 text-sm text-muted-foreground">
          No items yet. Add a custom feature to get started.
        </div>
      ) : (
        items.map((item) => {
          const feeLow = item.daysLow * dayRates.low
          const feeHigh = item.daysHigh * dayRates.high

          return (
            <div
              key={item.id}
              className="grid grid-cols-1 md:grid-cols-[40px_2fr_1.4fr_1fr] gap-3 rounded-xl border bg-muted/5 p-4"
            >
              <div className="flex items-start md:items-center">
                <input
                  type="checkbox"
                  checked={item.selected}
                  onChange={(event) =>
                    onChange(item.id, "selected", event.target.checked)
                  }
                  className="size-4 rounded border-muted-foreground"
                />
              </div>
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-muted-foreground">{item.scope}</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  step={0.5}
                  value={item.daysLow}
                  onChange={(event) =>
                    onChange(
                      item.id,
                      "daysLow",
                      Number(event.target.value) || 0,
                    )
                  }
                  className="h-9 w-20 rounded-lg border bg-background px-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <span className="text-sm text-muted-foreground">to</span>
                <input
                  type="number"
                  min={0}
                  step={0.5}
                  value={item.daysHigh}
                  onChange={(event) =>
                    onChange(
                      item.id,
                      "daysHigh",
                      Number(event.target.value) || 0,
                    )
                  }
                  className="h-9 w-20 rounded-lg border bg-background px-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="text-sm font-semibold text-primary">
                {formatNumber(feeLow)} to {formatNumber(feeHigh)} MMK
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}

function SupportTable({
  plans,
  hourlyRates,
  onChange,
}: {
  plans: SupportPlan[]
  hourlyRates: { low: number; high: number }
  onChange: (id: string, value: number) => void
}) {
  return (
    <div className="space-y-3">
      <div className="hidden md:grid grid-cols-[1.2fr_1.6fr_1fr_1fr] gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        <span>Plan</span>
        <span>Coverage</span>
        <span>Hours</span>
        <span>Fee range</span>
      </div>
      {plans.map((plan) => {
        const feeLow = plan.hours * hourlyRates.low
        const feeHigh = plan.hours * hourlyRates.high
        return (
          <div
            key={plan.id}
            className="grid grid-cols-1 md:grid-cols-[1.2fr_1.6fr_1fr_1fr] gap-3 rounded-xl border bg-muted/5 p-4"
          >
            <div className="font-semibold">{plan.name}</div>
            <div className="text-sm text-muted-foreground">{plan.scope}</div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                step={1}
                value={plan.hours}
                onChange={(event) =>
                  onChange(plan.id, Number(event.target.value) || 0)
                }
                className="h-9 w-24 rounded-lg border bg-background px-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <span className="text-sm text-muted-foreground">hrs</span>
            </div>
            <div className="text-sm font-semibold text-primary">
              {formatNumber(feeLow)} to {formatNumber(feeHigh)} MMK
            </div>
          </div>
        )
      })}
    </div>
  )
}

function SummaryCard({
  label,
  highlight,
  children,
}: {
  label: string
  highlight?: boolean
  children: React.ReactNode
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        highlight ? "border-primary/40 bg-primary/5" : "bg-muted/10"
      }`}
    >
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold mt-2">{children}</p>
    </div>
  )
}
