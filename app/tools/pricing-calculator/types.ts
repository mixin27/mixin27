export type Mode = "salary" | "manual"

export type PackageKey = "mvp" | "standard" | "advanced"

export type Item = {
  id: string
  name: string
  scope: string
  daysLow: number
  daysHigh: number
  selected: boolean
}

export type SupportPlan = {
  id: string
  name: string
  scope: string
  hours: number
}

export type Template = {
  label: string
  note: string
  defaultPackage: PackageKey
  features: Item[]
  packages: Record<PackageKey, string[]>
}
