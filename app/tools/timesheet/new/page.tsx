import { Suspense } from "react"
import NewTimeEntryForm from "./new-time-entry-form"

export default function NewTimeEntryPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      }
    >
      <NewTimeEntryForm />
    </Suspense>
  )
}
