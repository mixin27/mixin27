import { Metadata } from "next"

import ToolsContent from "./tools-content"

export const metadata: Metadata = {
  title: "KZT Freelance Tools",
  description:
    "KZT Freelance Tools is a free web app for freelancers to create quotations, invoices, receipts and contracts, track payments, and back up their data to their own Google Drive.",
}

export default function ToolsPage() {
  return <ToolsContent />
}
