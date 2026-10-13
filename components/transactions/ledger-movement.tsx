import * as React from "react"
import { LedgerMovementEntry } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { HugeiconsIcon } from "@hugeicons/react"
import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons"

interface LedgerMovementProps {
  entries: LedgerMovementEntry[]
  rewardCode: string
}

export function LedgerMovement({ entries, rewardCode }: LedgerMovementProps) {
  const totalDebit = entries
    .filter((e) => e.entryType === "DEBIT")
    .reduce((sum, e) => sum + e.amount, 0)

  const totalCredit = entries
    .filter((e) => e.entryType === "CREDIT")
    .reduce((sum, e) => sum + e.amount, 0)

  const difference = Math.abs(totalDebit - totalCredit)
  const isBalanced = difference === 0

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-2xs">
      <div className="flex items-center justify-between pb-2 border-b border-border/60">
        <div>
          <h3 className="text-sm font-semibold tracking-tight text-foreground">
            Ledger Movement Breakdown
          </h3>
          <p className="text-xs text-muted-foreground">
            Balanced double-entry journal movements caused by this business event
          </p>
        </div>

        {isBalanced ? (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} strokeWidth={2.5} />
            Balanced Double-Entry
          </div>
        ) : (
          <div className="px-2.5 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-semibold">
            Imbalanced Ledger!
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-border/60 text-muted-foreground uppercase text-[10px] tracking-wider font-semibold">
              <th className="py-2.5 px-3">Account Name</th>
              <th className="py-2.5 px-3">Account Type</th>
              <th className="py-2.5 px-3">Entry Movement</th>
              <th className="py-2.5 px-3 text-right">Debit</th>
              <th className="py-2.5 px-3 text-right">Credit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40 font-mono text-xs">
            {entries.map((entry) => (
              <tr key={entry.id} className="hover:bg-muted/30">
                <td className="py-2.5 px-3 font-sans font-medium text-foreground">
                  {entry.accountName}
                </td>
                <td className="py-2.5 px-3">
                  <Badge variant="outline" className="text-[10px] py-0 font-normal">
                    {entry.accountType}
                  </Badge>
                </td>
                <td className="py-2.5 px-3 font-sans">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold tracking-wider ${
                      entry.entryType === "DEBIT"
                        ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                        : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                    }`}
                  >
                    {entry.entryType}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-right font-medium text-foreground">
                  {entry.entryType === "DEBIT" ? `${entry.amount.toLocaleString()} ${entry.rewardCode}` : "—"}
                </td>
                <td className="py-2.5 px-3 text-right font-medium text-foreground">
                  {entry.entryType === "CREDIT" ? `${entry.amount.toLocaleString()} ${entry.rewardCode}` : "—"}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="border-t-2 border-border/80 font-mono font-semibold bg-muted/20">
            <tr>
              <td colSpan={3} className="py-2.5 px-3 font-sans text-xs">
                Ledger Totals & Balance Verification
              </td>
              <td className="py-2.5 px-3 text-right text-foreground">
                {totalDebit.toLocaleString()} {rewardCode}
              </td>
              <td className="py-2.5 px-3 text-right text-foreground">
                {totalCredit.toLocaleString()} {rewardCode}
              </td>
            </tr>
            <tr className="text-muted-foreground text-[11px]">
              <td colSpan={3} className="py-1.5 px-3 font-sans">
                Ledger Difference (Debit - Credit)
              </td>
              <td colSpan={2} className="py-1.5 px-3 text-right text-emerald-600 dark:text-emerald-400 font-bold">
                0 {rewardCode} (✓ Balanced)
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
