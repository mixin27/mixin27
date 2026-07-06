'use client'

import { Suspense, ReactNode } from 'react'

interface SearchParamsWrapperProps {
  children: ReactNode
  fallback?: ReactNode
}

export function SearchParamsWrapper({
  children,
  fallback = (
    <div className="min-h-[60vh] flex items-center justify-center">
      <p className="text-muted-foreground">Loading...</p>
    </div>
  ),
}: SearchParamsWrapperProps) {
  return <Suspense fallback={fallback}>{children}</Suspense>
}
