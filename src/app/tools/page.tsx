import { Metadata } from "next"

import ToolsContent from "./tools-content"

export const metadata: Metadata = {
  title: "Freelance Tools",
  description:
    "Professional tools for freelancers - invoices, quotations, contracts, and more.",
}

export default function ToolsPage() {
  return <ToolsContent />
}
