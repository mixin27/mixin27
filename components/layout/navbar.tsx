"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { navItems, siteConfig } from "@/data/config"
import { cn } from "@/lib/utils"
import { KztLogo } from "@/components/ui/kzt-logo"
import { NetworkField } from "@/components/ui/network-field"

export function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          scrolled
            ? "border-b bg-background/92 backdrop-blur-xl"
            : "bg-transparent"
        )}
        style={
          scrolled
            ? {
                borderColor: "var(--app-accent-border)",
                boxShadow: "0 12px 40px rgba(0, 0, 0, 0.12)",
              }
            : undefined
        }
      >
        <NetworkField
          className="-top-6 -left-8 h-30 w-[18rem] mask-[radial-gradient(circle_at_24%_38%,black_0%,black_36%,rgba(0,0,0,0.82)_62%,transparent_90%)] opacity-100 brightness-125 saturate-150 dark:brightness-150 dark:saturate-200"
          connectionDistance={54}
          glowOpacity={1}
          lineOpacityScale={1.45}
          particleCount={36}
          particleOpacityScale={1.35}
          speed={0.16}
        />
        <div className="relative z-10 mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          {/* Logo */}
          <Link
            href="/"
            className="group flex items-center gap-2.5"
            aria-label="Home"
            onClick={() => setMobileOpen(false)}
          >
            <div className="relative flex items-center justify-center">
              <span className="absolute inset-[-6px] animate-[logo-pulse_3s_ease-in-out_infinite] rounded-full bg-(--app-accent-glow) blur-md" />
              <KztLogo className="relative size-8 transition-transform duration-300 group-hover:scale-110" />
            </div>
            <span className="font-heading text-lg font-extrabold tracking-[-0.02em] text-foreground">
              {siteConfig.handle}
              <span className="app-gradient-text">.</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav
            className="hidden items-center gap-1 md:flex"
            role="navigation"
            aria-label="Main"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "relative rounded-lg px-3.5 py-2 font-mono text-[12px] tracking-[0.08em] uppercase transition-colors",
                  pathname === item.href
                    ? "text-(--app-accent-secondary)"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {pathname === item.href && (
                  <span className="absolute inset-0 rounded-lg bg-(--app-tag-bg)" />
                )}
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA + hamburger */}
          <div className="flex items-center gap-3">
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="app-btn-primary hidden items-center gap-2 rounded-lg bg-(--app-accent-primary) px-4 py-2 font-mono text-[12px] font-medium tracking-[0.08em] text-white uppercase transition-all md:inline-flex"
            >
              Hire Me
            </Link>

            <button
              className="flex flex-col gap-1.5 rounded-lg p-2 transition-colors hover:bg-muted/70 md:hidden"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              <span
                className={cn(
                  "block h-0.5 w-5 bg-muted-foreground transition-all duration-200",
                  mobileOpen && "translate-y-2 rotate-45"
                )}
              />
              <span
                className={cn(
                  "block h-0.5 w-5 bg-muted-foreground transition-all duration-200",
                  mobileOpen && "opacity-0"
                )}
              />
              <span
                className={cn(
                  "block h-0.5 w-5 bg-muted-foreground transition-all duration-200",
                  mobileOpen && "-translate-y-2 -rotate-45"
                )}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-6 bg-background/95 backdrop-blur-xl md:hidden"
          role="dialog"
          aria-label="Mobile navigation"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "font-heading text-3xl font-bold tracking-tight transition-colors",
                pathname === item.href
                  ? "text-(--app-accent-secondary)"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={() => setMobileOpen(false)}
            className="app-btn-primary mt-4 rounded-xl bg-(--app-accent-primary) px-8 py-3 font-mono text-sm font-medium tracking-[0.08em] text-white uppercase"
          >
            Hire Me
          </Link>
        </div>
      )}
    </>
  )
}
