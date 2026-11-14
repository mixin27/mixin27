import { formatMoney } from "@/lib/tools/totals"
import type { MoneyByCurrency } from "@/lib/tools/client-stats"

/** "USD 1,200.00 · MMK 50,000", or a dash when there is nothing. */
export function formatMoneyMap(map: MoneyByCurrency): string {
  const parts = Object.entries(map)
    .filter(([, v]) => v)
    .sort((a, b) => b[1] - a[1])
    .map(([code, v]) => `${code} ${formatMoney(v, code)}`)
  return parts.length ? parts.join(" · ") : "—"
}

export function MoneyMap({ value, className }: { value: MoneyByCurrency; className?: string }) {
  const entries = Object.entries(value).filter(([, v]) => v).sort((a, b) => b[1] - a[1])
  if (!entries.length) return <span className={className}>—</span>
  return (
    <span className={className}>
      {entries.map(([code, v]) => (
        <span key={code} className="block whitespace-nowrap tabular-nums">
          <span className="text-muted-foreground text-xs mr-1">{code}</span>
          {formatMoney(v, code)}
        </span>
      ))}
    </span>
  )
}
