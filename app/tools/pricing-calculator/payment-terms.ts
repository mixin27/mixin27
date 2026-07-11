export type PaymentTermsPreset = {
  id: string
  label: string
  terms: string
}

export const defaultPaymentTermsPreset = "default"

export const paymentTermsPresets: PaymentTermsPreset[] = [
  {
    id: "default",
    label: "Use default settings",
    terms: "",
  },
  {
    id: "due_on_acceptance",
    label: "Due on acceptance",
    terms: "Payment is due upon quotation acceptance.",
  },
  {
    id: "net_7",
    label: "Net 7",
    terms: "Payment due within 7 days of quotation acceptance.",
  },
  {
    id: "net_15",
    label: "Net 15",
    terms: "Payment due within 15 days of quotation acceptance.",
  },
  {
    id: "net_30",
    label: "Net 30",
    terms: "Payment due within 30 days of quotation acceptance.",
  },
  {
    id: "milestone_50_50",
    label: "50% upfront / 50% on delivery",
    terms: "50% due at kickoff. Remaining 50% due on final delivery.",
  },
  {
    id: "milestone_30_40_30",
    label: "30% / 40% / 30% milestones",
    terms:
      "30% due at kickoff. 40% due after core delivery. 30% due on final delivery.",
  },
  {
    id: "monthly_retainer",
    label: "Monthly retainer (upfront)",
    terms: "Monthly retainer is billed and payable at the start of each month.",
  },
  {
    id: "custom",
    label: "Custom terms",
    terms: "",
  },
]
