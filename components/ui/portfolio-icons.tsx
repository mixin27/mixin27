import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface IconProps {
  className?: string
}

function IconBase({
  children,
  className,
  viewBox = "0 0 48 48",
}: IconProps & { children: ReactNode; viewBox?: string }) {
  return (
    <svg
      viewBox={viewBox}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(className)}
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

export function GridIcon({ className }: IconProps) {
  return (
    <IconBase className={className} viewBox="0 0 24 24">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </IconBase>
  )
}

export function FlutterDartIcon({ className }: IconProps) {
  return (
    <IconBase className={className}>
      <rect x="8" y="6" width="32" height="36" rx="4" />
      <path d="M16 18h16M16 24h12M16 30h8" />
      <circle
        cx="36"
        cy="36"
        r="8"
        fill="var(--background)"
        stroke="var(--app-accent-primary)"
      />
      <path d="M33 36l2 2 4-4" stroke="var(--app-accent-primary)" strokeWidth="2" />
    </IconBase>
  )
}

export function AndroidNativeIcon({ className }: IconProps) {
  return (
    <IconBase className={className}>
      <path d="M24 4L4 16v16l20 12 20-12V16L24 4z" />
      <path d="M24 4v28M4 16l20 12 20-12" />
    </IconBase>
  )
}

export function BackendApiIcon({ className }: IconProps) {
  return (
    <IconBase className={className}>
      <circle cx="24" cy="24" r="18" />
      <path d="M24 6c0 0-8 8-8 18s8 18 8 18" />
      <path d="M6 24h36" />
      <path d="M8 16h32M8 32h32" />
    </IconBase>
  )
}

export function WebReactIcon({ className }: IconProps) {
  return (
    <IconBase className={className}>
      <rect x="4" y="8" width="40" height="28" rx="3" />
      <path d="M16 36l-4 6M32 36l4 6M12 42h24" />
      <path d="M14 20l5 5-5 5M24 28h10" />
    </IconBase>
  )
}

export function CleanCodeIcon({ className }: IconProps) {
  return (
    <IconBase className={className}>
      <path d="M16 14l-8 10 8 10" />
      <path d="M32 14l8 10-8 10" />
      <path d="M28 8L20 40" />
    </IconBase>
  )
}

export function InnovationIcon({ className }: IconProps) {
  return (
    <IconBase className={className}>
      <path d="M24 6a10 10 0 0 0-6 18v4h12v-4a10 10 0 0 0-6-18Z" />
      <path d="M19 34h10M20 40h8" />
      <path d="M24 16v8M20 20h8" />
    </IconBase>
  )
}

export function UserCentricIcon({ className }: IconProps) {
  return (
    <IconBase className={className}>
      <circle cx="24" cy="16" r="6" />
      <path d="M10 40c2.5-7 7.3-10 14-10s11.5 3 14 10" />
      <path d="M8 20h4M36 20h4" />
    </IconBase>
  )
}

export function QualityFirstIcon({ className }: IconProps) {
  return (
    <IconBase className={className}>
      <path d="M24 6l14 6v9c0 10-6.4 17-14 21-7.6-4-14-11-14-21v-9l14-6Z" />
      <path d="M18 24l4 4 8-8" />
    </IconBase>
  )
}

export function AppPhoneIcon({ className }: IconProps) {
  return (
    <IconBase className={className}>
      <rect x="14" y="6" width="20" height="36" rx="5" />
      <path d="M22 12h4M20 34h8" />
      <path d="M8 16h2M8 24h2M8 32h2" opacity="0.7" />
    </IconBase>
  )
}
