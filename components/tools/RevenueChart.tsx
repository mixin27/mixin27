"use client"

import { useEffect, useRef, useState } from "react"
import type { MonthTotal } from "@/lib/tools/reports"
import { compactNumber, niceScale } from "@/lib/tools/reports"
import { formatMoney } from "@/lib/tools/totals"

const monthLabel = (ym: string, style: "short" | "long" = "short") =>
  new Date(`${ym}-01T00:00:00`).toLocaleDateString(undefined, style === "short" ? { month: "short" } : { month: "long", year: "numeric" })

/**
 * Single-series column chart of money received per month. Hover or focus a
 * month for its exact amount; the latest month and the highest month are
 * labelled directly. A table view is always available.
 */
export function RevenueChart({ data, currency }: { data: MonthTotal[]; currency: string }) {
  const wrap = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(600)
  const [active, setActive] = useState<number | null>(null)
  const [showTable, setShowTable] = useState(false)

  useEffect(() => {
    const el = wrap.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => setWidth(Math.max(260, Math.round(entry.contentRect.width))))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const height = 220
  const pad = { top: 22, right: 8, bottom: 26, left: 44 }
  const plotW = width - pad.left - pad.right
  const plotH = height - pad.top - pad.bottom
  const maxValue = Math.max(...data.map((d) => d.amount), 0)
  const { max, step } = niceScale(maxValue)
  const band = plotW / data.length
  const barW = Math.min(24, band * 0.6)
  const y = (v: number) => pad.top + plotH - (v / max) * plotH
  const ticks = Array.from({ length: Math.round(max / step) + 1 }, (_, i) => i * step)
  const labelEvery = band < 34 ? 2 : 1
  const peak = data.reduce((best, d, i) => (d.amount > (data[best]?.amount ?? 0) ? i : best), 0)
  const last = data.length - 1
  const money = (v: number) => `${currency} ${formatMoney(v, currency)}`
  const empty = maxValue === 0

  // Rounded top corners only; square at the baseline.
  const barPath = (x: number, top: number, w: number) => {
    const h = y(0) - top
    const r = Math.min(4, w / 2, h)
    return `M${x},${y(0)} V${top + r} Q${x},${top} ${x + r},${top} H${x + w - r} Q${x + w},${top} ${x + w},${top + r} V${y(0)} Z`
  }

  const tooltip = active !== null ? data[active] : null
  const tipX = active !== null ? pad.left + band * active + band / 2 : 0

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold">Money received per month · {currency}</h3>
        <button type="button" onClick={() => setShowTable((v) => !v)} className="text-xs font-semibold text-purple-500 hover:underline">
          {showTable ? "Show chart" : "Show table"}
        </button>
      </div>

      {showTable ? (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
              <th className="py-1 font-medium">Month</th>
              <th className="py-1 text-right font-medium">Received</th>
            </tr>
          </thead>
          <tbody>
            {[...data].reverse().map((d) => (
              <tr key={d.month} className="border-t border-border/60">
                <td className="py-1.5">{monthLabel(d.month, "long")}</td>
                <td className="py-1.5 text-right tabular-nums">{money(d.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div ref={wrap} className="relative">
          <svg
            width={width}
            height={height}
            role="img"
            aria-label={`Money received per month in ${currency}, last 12 months. Latest month ${money(data[last]?.amount ?? 0)}.`}
            className="block max-w-full overflow-visible"
            onMouseLeave={() => setActive(null)}
          >
            {ticks.map((t) => (
              <g key={t}>
                <line x1={pad.left} x2={width - pad.right} y1={y(t)} y2={y(t)} className="stroke-border" strokeWidth={1} />
                <text x={pad.left - 8} y={y(t)} dy="0.32em" textAnchor="end" className="fill-muted-foreground text-[11px] tabular-nums">
                  {compactNumber(t)}
                </text>
              </g>
            ))}

            {data.map((d, i) => {
              const x = pad.left + band * i + (band - barW) / 2
              const top = y(d.amount)
              const dim = active !== null && active !== i
              const labelled = !empty && d.amount > 0 && (i === last || i === peak)
              return (
                <g key={d.month}>
                  {d.amount > 0 && (
                    <path
                      d={barPath(x, top, barW)}
                      className={`fill-purple-600 dark:fill-purple-500 transition-opacity ${dim ? "opacity-40" : ""}`}
                    />
                  )}
                  {labelled && (
                    <text x={x + barW / 2} y={top - 6} textAnchor="middle" className="fill-foreground text-[11px] font-medium tabular-nums">
                      {compactNumber(d.amount)}
                    </text>
                  )}
                  {i % labelEvery === (last % labelEvery) && (
                    <text x={pad.left + band * i + band / 2} y={height - 8} textAnchor="middle" className="fill-muted-foreground text-[11px]">
                      {monthLabel(d.month)}
                    </text>
                  )}
                  {/* Hit area: the whole column band, bigger than the bar. */}
                  <rect
                    x={pad.left + band * i}
                    y={pad.top}
                    width={band}
                    height={plotH}
                    fill="transparent"
                    tabIndex={0}
                    aria-label={`${monthLabel(d.month, "long")}: ${money(d.amount)}`}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onBlur={() => setActive(null)}
                    className="cursor-default outline-none focus-visible:stroke-purple-500"
                  />
                </g>
              )
            })}
          </svg>

          {tooltip && (
            <div
              role="status"
              className="pointer-events-none absolute z-10 -translate-x-1/2 whitespace-nowrap rounded-lg border border-border bg-background px-3 py-2 text-xs shadow-lg"
              style={{ left: Math.min(Math.max(tipX, 70), width - 70), top: 0 }}
            >
              <p className="text-muted-foreground">{monthLabel(tooltip.month, "long")}</p>
              <p className="font-semibold tabular-nums">{money(tooltip.amount)}</p>
            </div>
          )}

          {empty && (
            <p className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-sm text-muted-foreground">
              No payments in the last 12 months
            </p>
          )}
        </div>
      )}
    </div>
  )
}
