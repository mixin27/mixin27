import { cn } from "@/lib/utils"

interface SectionLabelProps {
  children: React.ReactNode
  className?: string
}

export function SectionLabel({ children, className }: SectionLabelProps) {
  return (
    <p
      className={cn(
        "flex items-center gap-2.5 font-mono text-[11px] tracking-[0.2em] text-(--app-accent-primary) uppercase",
        className
      )}
    >
      <span
        className="block h-px w-7 bg-(--app-accent-primary)"
        aria-hidden="true"
      />
      {children}
    </p>
  )
}
