import { Suspense } from 'react'
import NewContractForm from './new-contract-form'

export default function NewContractPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      }
    >
      <NewContractForm />
    </Suspense>
  )
}
