import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SHARE_KINDS, type ShareKind } from "@/lib/tools/share-link"
import { SharedDocument } from "./shared-document"

const TITLES: Record<ShareKind, string> = { invoice: "Invoice", quotation: "Quotation", receipt: "Receipt" }

export const dynamicParams = false
export function generateStaticParams() {
  return SHARE_KINDS.map((type) => ({ type }))
}

export async function generateMetadata({ params }: { params: Promise<{ type: string }> }): Promise<Metadata> {
  const { type } = await params
  return {
    title: TITLES[type as ShareKind] ?? "Shared document",
    robots: { index: false, follow: false },
    referrer: "no-referrer",
  }
}

export default async function SharedDocumentPage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params
  if (!SHARE_KINDS.includes(type as ShareKind)) notFound()
  return <SharedDocument kind={type as ShareKind} />
}
