import type { Item, SupportPlan } from "./types"

export const baseDefaults: Item[] = [
  {
    id: "discovery",
    name: "Discovery & requirements",
    scope: "Workshops, flows, scope alignment",
    daysLow: 2,
    daysHigh: 4,
    selected: true,
  },
  {
    id: "uiux",
    name: "UI/UX design",
    scope: "Wireframes, UI kit, key screens",
    daysLow: 3,
    daysHigh: 6,
    selected: true,
  },
  {
    id: "setup",
    name: "Project setup & architecture",
    scope: "Repo, environments, structure",
    daysLow: 1,
    daysHigh: 2,
    selected: true,
  },
  {
    id: "pm",
    name: "Project management",
    scope: "Planning, reviews, coordination",
    daysLow: 2,
    daysHigh: 4,
    selected: true,
  },
  {
    id: "qa",
    name: "QA & regression",
    scope: "Test cycles, fixes, validation",
    daysLow: 3,
    daysHigh: 6,
    selected: true,
  },
  {
    id: "release",
    name: "Deployment & release",
    scope: "Staging, production launch",
    daysLow: 2,
    daysHigh: 4,
    selected: true,
  },
]

export const addonDefaults: Item[] = [
  {
    id: "delivery_zones",
    name: "Delivery zones",
    scope: "Zone rules + fee calculation",
    daysLow: 3,
    daysHigh: 5,
    selected: false,
  },
  {
    id: "sms_setup",
    name: "SMS provider setup",
    scope: "Integration + templates",
    daysLow: 2,
    daysHigh: 4,
    selected: false,
  },
  {
    id: "exports",
    name: "Excel/CSV exports",
    scope: "Orders and inventory",
    daysLow: 2,
    daysHigh: 3,
    selected: false,
  },
  {
    id: "offline_mode",
    name: "Offline mode (limited)",
    scope: "Cache + retry workflows",
    daysLow: 4,
    daysHigh: 6,
    selected: false,
  },
  {
    id: "branding_polish",
    name: "Branding + UI polish",
    scope: "Custom visuals and motion",
    daysLow: 3,
    daysHigh: 5,
    selected: false,
  },
]

export const supportDefaults: SupportPlan[] = [
  {
    id: "basic",
    name: "Basic",
    scope: "Minor fixes",
    hours: 6,
  },
  {
    id: "standard",
    name: "Standard",
    scope: "Fixes + small enhancements",
    hours: 12,
  },
  {
    id: "premium",
    name: "Premium",
    scope: "Priority support",
    hours: 24,
  },
]
