import { cn } from "@/lib/utils"

interface BadgeProps {
  children: React.ReactNode
  variant?: "default" | "outline" | "available" | "category"
  className?: string
}

export function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-[11px] tracking-[0.08em] uppercase",
        variant === "default" &&
          "border-border bg-card/60 text-muted-foreground",
        variant === "outline" &&
          "border-border bg-transparent text-muted-foreground",
        variant === "available" &&
          "border-emerald-500/25 bg-emerald-500/10 text-emerald-400",
        variant === "category" &&
          "border-purple-500/20 bg-purple-500/10 text-purple-400",
        className
      )}
    >
      {variant === "available" && (
        <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" />
      )}
      {children}
    </span>
  )
}
