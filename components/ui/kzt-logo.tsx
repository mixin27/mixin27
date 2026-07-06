import { cn } from "@/lib/utils"

interface KztLogoProps {
  className?: string
}

/**
 * Original abstract geometric emblem — inspired by tech / Wakanda aesthetic.
 * NOT a reproduction of any Marvel IP. All shapes are original.
 */
export function KztLogo({ className }: KztLogoProps) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-(--app-accent-primary)", className)}
      aria-hidden="true"
    >
      {/* Outer hexagonal frame */}
      <polygon
        points="20,2 36,12 36,28 20,38 4,28 4,12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.6"
      />
      {/* Inner geometric claw form - abstract tech mark */}
      <path
        d="M20 8 L14 16 L16 22 L20 20 L24 22 L26 16 Z"
        fill="currentColor"
        opacity="0.9"
      />
      {/* Side accent lines */}
      <line
        x1="10"
        y1="14"
        x2="14"
        y2="18"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.5"
      />
      <line
        x1="30"
        y1="14"
        x2="26"
        y2="18"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.5"
      />
      {/* Bottom node */}
      <circle cx="20" cy="28" r="2.5" fill="currentColor" opacity="0.7" />
    </svg>
  )
}
